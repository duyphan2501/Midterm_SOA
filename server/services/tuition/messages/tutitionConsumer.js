import {
  subscribeMessage,
} from "../../../shared/messages/rabbitMQ.js";
import TuitionModel from "../models/TuitionModel.js";

const startConsumer = async () => {
  try {
    await subscribeMessage(
      "payment_success",
      "queue_deduct_tuition",
      async (msg) => {
        const payment = JSON.parse(msg);
        const affectedRows = await TuitionModel.markPaidTuition(payment.tuitionId);
        if (affectedRows) console.log("Deducted tutition");
        else throw new Error("Failed to deducted tutition");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export { startConsumer };
