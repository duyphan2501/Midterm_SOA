import {
  subscribeMessage,
} from "../messages/rabbitMQ.js";
import TuitionModel from "../models/TuitionModel.js";

const startConsumer = async () => {
  try {
    await subscribeMessage(
      "payment_success",
      "tuition_payment_success",
      async (msg) => {
        const payment = JSON.parse(msg);
        const affectedRows = await TuitionModel.updateStatus(payment.tuitionId, "PAID");
        if (affectedRows === 1) console.log(`Tuition ${payment.tuitionId} marked PAID`);
        else throw new Error("Cannot update tuition status");
      }
    );

    await subscribeMessage(
      "payment_failed",
      "tuition_payment_failed",
      async (msg) => {
        const payment = JSON.parse(msg);
        const affectedRows = await TuitionModel.updateStatus(payment.tuitionId, "UNPAID");
        if (affectedRows === 1) console.log(`Tuition ${payment.tuitionId} marked UNPAID`);
        else throw new Error("Cannot update tuition status");
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export { startConsumer };
