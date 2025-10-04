import CreateError from "http-errors";
import PaymentModel from "../models/PaymentModel.js";
import {
  sendOtpCode,
  sendPaymentSuccessEmail,
} from "../helpers/email.helper.js";
import { generatePaymentCode } from "../helpers/payment.helper.js";
import { publishMessage } from "../messages/rabbitMQ.js";
import dotenv from "dotenv";
import axios from "axios";
import OtpModel from "../models/OtpModel.js";
import { generateNewOtpCode } from "../helpers/otp.helper.js";
dotenv.config({ quite: true });

const createPayment = async (req, res, next) => {
  try {
    const { tuition, payer } = req.body;

    if (!tuition || !payer)
      throw CreateError.BadRequest("Học phí và người trả phải được cung cấp");

    if (payer.balance < tuition.amount)
      throw CreateError.BadRequest("Số dư không đủ để thanh toán");

    const paidTuition = await PaymentModel.checkPaidTuition(tuition.tuition_id);
    if (paidTuition) throw CreateError.Conflict("Học phí đã được thanh toán");

    // Kiểm tra payment đang chờ xử lý
    let payment = await PaymentModel.getDuplicatePayment(
      tuition.tuition_id,
      payer.user_id,
      "PENDING"
    );

    if (!payment) {
      // Tạo payment mới nếu chưa có
      const paymentCode = generatePaymentCode(tuition);
      const newPaymentId = await PaymentModel.create(
        paymentCode,
        tuition.tuition_id,
        payer.user_id,
        tuition.amount
      );
      payment = await PaymentModel.findPaymentById(newPaymentId);
    } else {
      // nếu otp còn hiệu lực thì ko gửi otp lại
      const existingOtp = await OtpModel.getValidOtpByPaymentId(
        payment.payment_id
      );
      if (existingOtp)
        return res.status(200).json({
          message: "Vui lòng nhập mã OTP đã được gửi.",
          payment,
          success: true,
        });
    } 

    // Tạo OTP
    const { otpCode, otpExpireAt } = await generateNewOtpCode(
      payment.payment_id,
      1
    );

    await Promise.all([
      OtpModel.create(payment.payment_id, otpCode, otpExpireAt),
      // sendOtpCode(payer.email, payer.fullname, otpCode, 1),
    ]);

    return res.status(201).json({
      message: "Vui lòng kiểm tra email để lấy mã OTP",
      payment,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const processPayment = async (req, res, next) => {
  try {
    const { otpCode, payment } = req.body;

    if (!otpCode) throw CreateError.BadRequest("Vui lòng nhập mã OTP");
    if (!payment) throw CreateError.BadRequest("Thanh toán phải được cung cấp");

    const affectedRows = await PaymentModel.updatePaymentSuccess(
      payment.payment_id,
      otpCode
    );

    // update thành công -> thử trừ balance
    if (affectedRows > 0) {
      try {
        const response = await axios.put(
          `${process.env.USER_SERVICE_HOST}/decrease-balance`,
          {
            userId: payment.payer_id,
            decreaseAmount: payment.amount,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.SERVICE_TOKEN}`,
            },
          }
        );

        const payer = response.data.user;

        const paymentMessage = {
          email: payer.email,
          fullname: payer.fullname,
          tuitionId: payment.tuition_id,
          paymentCode: payment.payment_code,
          amount: payment.amount,
        };

        await publishMessage("payment_success", JSON.stringify(paymentMessage));

        return res.status(200).json({
          message: "Thanh toán thành công!",
          payer,
          success: true,
        });
      } catch (err) {
        const statusCode = err.response?.status || 500;
        console.log(statusCode)
        if (statusCode === 401 || statusCode === 403)
          return res.status(statusCode).json({
            message: `Phiên đăng nhập đã hết hạn`,
            success: false,
          });

        const isInsufficientBalance = statusCode === 409;
        const failReason = isInsufficientBalance
          ? "Số dư không đủ"
          : "Lỗi server, vui lòng thử lại sau";

        await PaymentModel.updateStatus(
          payment.payment_id,
          "FAILED",
          failReason
        );

        console.error(err);

        await publishMessage(
          "payment_failed",
          JSON.stringify({ tuitionId: payment.tuition_id })
        );

        return res.status(statusCode).json({
          message: `Thanh toán không thành công: ${failReason}`,
          success: false,
        });
      }
    }

    // deadlock
    if (affectedRows === -1)
      throw CreateError.Conflict("Thanh toán đang được xử lý bởi yêu cầu khác");

    // OTP invalid
    const otpRecord = await OtpModel.getValidOtpByPaymentId(payment.payment_id);
    if (!otpRecord)
      throw CreateError.Unauthorized(
        "OTP đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu gửi lại OTP"
      );
    if (otpRecord.otp_code !== otpCode)
      throw CreateError.Unauthorized(
        "Mã OTP không đúng. Vui lòng kiểm tra lại"
      );

    // check học phí thanh toán chưa
    const paidTuition = await PaymentModel.checkPaidTuition(payment.tuition_id);
    if (paidTuition) {
      await PaymentModel.updateStatus(
        payment.payment_id,
        "FAILED",
        "Học phí đã được thanh toán bởi người khác"
      );
      throw CreateError.Conflict("Học phí đã được thanh toán bởi người khác");
    }

    // check payment record
    const paymentRecord = await PaymentModel.findPaymentById(
      payment.payment_id
    );
    if (!paymentRecord) throw CreateError.NotFound("Thanh toán không tồn tại");

    if (paymentRecord.status === "FAILED")
      throw CreateError.Conflict("Thanh toán đã bị huỷ");

    // không thỏa điều kiện nào
    throw CreateError.Conflict("Thanh toán không thể thực hiện");
  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const { payer, paymentId } = req.body;

    if (!payer) throw CreateError.BadRequest("Người nhận không tồn tại");

    if (!paymentId) throw CreateError.BadRequest("Mã thanh toán không tồn tại");

    const isPaid = await PaymentModel.checkSuccessPayment(paymentId)

    if (isPaid)
      throw CreateError.Conflict("Học phí đã được thanh toán")

    await OtpModel.disableValidOtpByPaymentId(paymentId);

    const { otpCode, otpExpireAt } = await generateNewOtpCode(paymentId, 1);

    // await sendOtpCode(payer.email, payer.fullname, otpCode, 1);

    await OtpModel.create(paymentId, otpCode, otpExpireAt);

    return res.status(200).json({
      message: "Đã gửi OTP thành công!",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const { payerId } = req.params;

    if (!payerId) throw CreateError.BadRequest("Thiếu mã người thanh toán");

    const payments = await PaymentModel.getPaymentHistoryByPayerId(payerId);

    return res.status(200).json({
      payments,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { createPayment, processPayment, sendOtp, getPaymentHistory };
