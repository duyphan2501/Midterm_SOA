import { subscribeMessage } from "../../../shared/messages/rabbitMQ.js";
import UserModel from "../models/UserModel.js";

const startConsumer = async () => {
  try {
    await subscribeMessage(
      "payment_success",
      "queue_update_balance",
      async (msg) => {
        const payment = JSON.parse(msg);
        const updated = await UserModel.updateOne(
          { username: payment.payerId },
          { $inc: { balance: -payment.amount } }
        );

        if (updated.modifiedCount)
          console.log("Updated balance")
        else
          throw new Error("Failed to update balance")
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export { startConsumer };
