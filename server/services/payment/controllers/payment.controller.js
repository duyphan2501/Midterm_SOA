import CreateError from "http-errors";
import PaymentModel from "../models/PaymentModel.js";
import { sendOtpCode } from "../helpers/email.helper.js";
import { generatePaymentId } from "../helpers/payment.helper.js";

const createPayment = async (req, res, next) => {
  try {
    const { tuition, payer } = req.body;

    if (!tuition || !payer)
      throw CreateError.BadRequest("Tuition or payer is missing");

    const otpCode = Math.floor(Math.random() * 900000 + 100000);

    await sendOtpCode(payer.email, payer.fullname, otpCode);

    const otpExpireAt = new Date(Date.now() + 1000 * 60 * 5);

    const paymentId = generatePaymentId(tuition);

    const payment = await PaymentModel.create({
      paymentId,
      tuitionId: tuition._id,
      payerId: payer.username,
      otpCode,
      otpExpireAt,
    });

    return res.status(201).json({
      message: "Create payment successfully!",
      payment,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { createPayment };
