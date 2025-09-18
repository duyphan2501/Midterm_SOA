import { subscribeMessage } from "../../../shared/messages/rabbitMQ.js";
import UserModel from "../models/UserModel.js";

const startConsumer = async () => {
  try {
    await subscribeMessage(
      "payment_success",
      "queue_update_balance",
      async (msg) => {
        const payment = JSON.parse(msg);
        const affectedRows = await UserModel.decreaseBalance(
          payment.amount, payment.payer_id
        );

        if (affectedRows)
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
