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
        await sendPaymentSuccessEmail(
          payment.email,
          payment.fullname,
          payment.paymentCode,
          payment.amount
        )
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export { startConsumer };
