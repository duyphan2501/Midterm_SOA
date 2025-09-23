import CreateError from "http-errors";
import PaymentModel from "../models/PaymentModel.js";
import { sendOtpCode } from "../helpers/email.helper.js";
import {
  generateNewOtpCode,
  generatePaymentCode,
} from "../helpers/payment.helper.js";
import { publishMessage } from "../messages/rabbitMQ.js";
import dotenv from "dotenv";
import axios from "axios";
import OtpModel from "../models/OtpModel.js";
dotenv.config({ quite: true });

const createPayment = async (req, res, next) => {
  try {
    const { tuition, payer } = req.body;

    if (!tuition || !payer)
      throw CreateError.BadRequest("Tuition or payer is missing");

    if (payer.balance < tuition.amount)
      throw CreateError.BadRequest("Payer balance is not enough to pay");

    const paidTuition = await PaymentModel.checkPaidPayment(tuition.tuition_id);

    if (paidTuition) throw CreateError.Conflict("Tuition is already paid");

    const paymentCode = generatePaymentCode(tuition);


    const newPaymentId = await PaymentModel.create(
      paymentCode,
      tuition.tuition_id,
      payer.user_id,
      tuition.amount
    );

    const { otpCode, otpExpireAt } = await generateNewOtpCode(newPaymentId, 1);

    const getPayment = () => PaymentModel.findPaymentById(newPaymentId);
    const createOtp = () => OtpModel.create(newPaymentId, otpCode, otpExpireAt);
    const [payment, otpId] = await Promise.all([getPayment(), createOtp()]);
    // await sendOtpCode(payer.email, payer.fullname, otpCode, 1);

    return res.status(201).json({
      message: "Create payment successfully!",
      payment: {
        ...payment,
        otpCode: undefined,
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const processPayment = async (req, res, next) => {
  try {
    const { otpCode, payment } = req.body;

    if (!otpCode) throw CreateError.BadRequest("Please enter OTP code");
    if (!payment) throw CreateError.BadRequest("Payment is missing");

    const affectedRows = await PaymentModel.updatePaymentSuccess(
      payment.payment_id,
      otpCode
    );

    // Case 1: update thành công -> tiếp tục flow balance
    if (affectedRows > 0) {
      try {
        await axios.put(`${process.env.USER_SERVICE_HOST}/decrease-balance`, {
          userId: payment.payer_id,
          decreaseAmount: payment.amount,
        });

        await publishMessage("payment_success", JSON.stringify(payment));

        return res.status(200).json({
          message: "Payment successfully!",
          success: true,
        });
      } catch (err) {
        await PaymentModel.updateStatus(payment.payment_id, "FAILED", "User balance is not enough");
        await publishMessage("payment_failed", JSON.stringify(payment));

        return res.status(400).json({
          message: "Insufficient balance or UserService error",
          success: false,
        });
      }
    }

    // Case 2: deadlock (MySQL rollback)
    if (affectedRows === -1) {
      throw CreateError.Conflict("Payment is being processed by another request");
    }

    // Case 3: OTP invalid
    const otpRecord = await OtpModel.getValidOtpByPaymentId(payment.payment_id);
    if (!otpRecord)
      throw CreateError.Forbidden("OTP code is expired! Please request again");
    if (otpRecord.otp_code !== otpCode)
      throw CreateError.Forbidden("OTP code is not correct");

    // check paid tuition
    const paidTuition = await PaymentModel.checkPaidTiontion(payment.tuition_id);
    if (paidTuition) {
      await PaymentModel.updateStatus(payment.payment_id, "FAILED", "Tuition already paid");
      throw CreateError.Conflict("Tuition has been paid by another request");
    }

    // check payment record
    const paymentRecord = await PaymentModel.findPaymentById(payment.payment_id);
    if (!paymentRecord) throw CreateError.NotFound("Payment does not exist");

    if (paymentRecord.status === "FAILED") {
      throw CreateError.Conflict("Payment is cancelled");
    }

    // Trường hợp còn lại: không thỏa điều kiện nào
    throw CreateError.Conflict("Payment already processed by another request");
  } catch (error) {
    next(error);
  }
};


const sendOtp = async (req, res, next) => {
  try {
    const { payer, paymentId } = req.body;

    if (!payer) throw CreateError.BadRequest("Payer is required");

    if (!paymentId) throw CreateError.BadRequest("Payment ID is required");

    await OtpModel.disableValidOtpByPaymentId(paymentId);

    const { otpCode, otpExpireAt } = await generateNewOtpCode(paymentId, 1);

    // await sendOtpCode(payer.email, payer.fullname, otpCode, 1);

    await OtpModel.create(paymentId, otpCode, otpExpireAt);

    return res.status(200).json({
      message: "OTP sent successfully!",
      otpCode,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { createPayment, processPayment, sendOtp };
