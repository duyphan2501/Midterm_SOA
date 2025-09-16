import CreateError from "http-errors";
import PaymentModel from "../models/PaymentModel.js";
import { sendOtpCode } from "../helpers/email.helper.js";
import { generatePaymentId } from "../helpers/payment.helper.js";
import { publishMessage } from "../../../shared/messages/rabbitMQ.js";
const createPayment = async (req, res, next) => {
  try {
    const { tuition, payer } = req.body;

    if (!tuition || !payer)
      throw CreateError.BadRequest("Tuition or payer is missing");

    if (payer.balance < tuition.amount)
        throw CreateError.BadRequest("Payer balance is not enough to pay")

    const paymentId = generatePaymentId(tuition);

    const paidPayment = await PaymentModel.findOne({paymentId, status: "SUCCESS"})

    if (paidPayment)
        throw CreateError.Conflict("Payment has been processed")

    const otpCode = Math.floor(Math.random() * 900000 + 100000);

    // await sendOtpCode(payer.email, payer.fullname, otpCode);

    const otpExpireAt = new Date(Date.now() + 1000 * 60 * 5);

    const payment = await PaymentModel.create({
      paymentId,
      tuitionId: tuition._id,
      payerId: payer.username,
      otpCode,
      otpExpireAt,
      amount: tuition.amount
    });

    return res.status(201).json({
      message: "Create payment successfully!",
      payment: {
        ...payment._doc,
        otpCode: undefined
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

    if (!payment._id) throw CreateError.BadRequest("Payment is missing");

    const foundPayment = await PaymentModel.findById(payment._id);

    // handle error
    if (!foundPayment) throw CreateError.NotFound("Payment does not exist");
    else if (foundPayment.status === "PAID")
      throw CreateError.Conflict("Payment is paid");
    else if (foundPayment.status === "FAILED")
      throw CreateError.Conflict("Payment is cancelled");
    else if (foundPayment.otpExpireAt < new Date())
      throw CreateError.Forbidden(
        "OTP code is expired! Click sent OTP again to continue"
      );
    else if (foundPayment.otpCode !== otpCode)
      throw CreateError.Forbidden("OTP code is not correct");

    // payment success
    foundPayment.status = "SUCCESS";
    foundPayment.otpCode = undefined;
    foundPayment.otpExpireAt = undefined;
    await foundPayment.save();

    await publishMessage("payment_success", JSON.stringify(foundPayment))
    
    return res.status(200).json({
      message: "Payment is successfully!",
      payment: foundPayment,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const { payer, paymentObId } = req.body;

    if (!payer) throw CreateError.BadRequest("Payer is required");

    if (!paymentObId)
      throw CreateError.BadRequest("Payment object ID is required");

    const otpCode = Math.floor(Math.random() * 900000 + 100000);
    // await sendOtpCode(payer.email, payer.fullname, otpCode);
    const otpExpireAt = new Date(Date.now() + 1000 * 60 * 5);

    await PaymentModel.updateOne(
      { _id: paymentObId },
      {
        otpCode,
        otpExpireAt,
      }
    );

    return res.status(200).json({
        message: "OTP sent successfully!",
        success: true,
    })

  } catch (error) {
    next(error);
  }
};

export { createPayment, processPayment, sendOtp };
