import { sendPaymentSuccessEmail } from "../helpers/email.helper.js";
import {
  subscribeMessage,
} from "../messages/rabbitMQ.js";

const startConsumer = async () => {
  try {
    await subscribeMessage(
      "payment_success",
      "email_payment_success",
      async (msg) => {
        const payment = JSON.parse(msg);
        if (!payment.email)
            throw new Error("Email receiver is missing")
        const tuition = payment.paymentCode?.split("_")[0] || payment.paymentCode;

        await sendPaymentSuccessEmail(
          payment.email,
          payment.fullname,
          tuition,
          payment.amount
        )
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export { startConsumer };
