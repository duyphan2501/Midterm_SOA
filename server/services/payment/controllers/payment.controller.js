import CreateError from "http-errors";
import PaymentModel from "../models/PaymentModel.js";
import { sendOtpCode } from "../helpers/email.helper.js";
import { generatePaymentCode } from "../helpers/payment.helper.js";
import { publishMessage } from "../../../shared/messages/rabbitMQ.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config({ quite: true });

const createPayment = async (req, res, next) => {
  try {
    const { tuition, payer } = req.body;

    if (!tuition || !payer)
      throw CreateError.BadRequest("Tuition or payer is missing");

    if (payer.balance < tuition.amount)
      throw CreateError.BadRequest("Payer balance is not enough to pay");

    const paymentCode = generatePaymentCode(tuition);

    const paidPayment = await PaymentModel.checkPaidPayment(paymentCode);

    if (paidPayment) throw CreateError.Conflict("Payment has been processed");

    const otpCode = Math.floor(Math.random() * 900000 + 100000);

    // await sendOtpCode(payer.email, payer.fullname, otpCode, 1);

    const otpExpireAt = new Date(Date.now() + 1000 * 60 * 1);

    const newPaymentId = await PaymentModel.create(
      paymentCode,
      tuition.tuition_id,
      payer.user_id,
      otpCode,
      otpExpireAt,
      tuition.amount
    );
    const payment = await PaymentModel.findPaymentById(newPaymentId);

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
    let { otpCode, payment } = req.body;

    if (!otpCode) throw CreateError.BadRequest("Please enter OTP code");
    if (!payment) throw CreateError.BadRequest("Payment is missing");

    const affectedRows = await PaymentModel.updatePaymentSuccess(
      payment.payment_id,
      otpCode
    );

    if (affectedRows === 1) {
      try {
        // 2️⃣ Trừ balance atomic
        await axios.put(`${process.env.USER_SERVICE_HOST}/decrease-balance`, {
          userId: payment.payer_id,
          decreaseAmount: payment.amount,
        });

        // 3️⃣ Nếu balance đủ → publish success
        await publishMessage("payment_success", JSON.stringify(payment));

        return res.status(200).json({
          message: "Payment successfully!",
          success: true,
        });
      } catch (err) {
        // 4️⃣ Nếu trừ balance fail → rollback payment + publish fail
        await PaymentModel.updateStatus(payment.payment_id, "FAILED");
        await publishMessage("payment_failed", JSON.stringify(payment));

        return res.status(400).json({
          message: "Insufficient balance or UserService error",
          success: false,
        });
      }
    }

    // payment fail
    payment = await PaymentModel.findPaymentById(payment.payment_id);
    if (!payment) throw CreateError.NotFound("Payment does not exist");

    if (payment.status === "SUCCESS")
      throw CreateError.Conflict("Payment is already paid");
    if (payment.status === "FAILED")
      throw CreateError.Conflict("Payment is cancelled");
    if (new Date(payment.otp_expire_at) < new Date())
      throw CreateError.Forbidden("OTP code is expired! Please request again");
    if (payment.otp_code !== otpCode)
      throw CreateError.Forbidden("OTP code is not correct");

    // Nếu tới đây mà vẫn không match thì có thể do race condition
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

    const otpCode = Math.floor(Math.random() * 900000 + 100000);
    // await sendOtpCode(payer.email, payer.fullname, otpCode, 1);
    const otpExpireAt = new Date(Date.now() + 1000 * 60 * 1);

    const affectedRows = await PaymentModel.updatePaymentOtp(
      paymentId,
      otpCode,
      otpExpireAt
    );
    if (!affectedRows)
      throw CreateError.InternalServerError("Failed to update otp");

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
