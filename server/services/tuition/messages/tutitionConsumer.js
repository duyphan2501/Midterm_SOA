// tuitionConsumer.js
import { consumeQueue } from "../../../shared/messages/rabbitMQ.js";
import ReplicaUserModel from "../models/ReplicaUserModel.js";
import TuitionModel from "../models/TuitionModel.js";

const startConsumer = async () => {
  try {
    await consumeQueue("user_created", async (msg) => {
      const user = JSON.parse(msg);
      console.log("Consume user:", user);

      await ReplicaUserModel.create(user);
    });

    await consumeQueue("payment_success", async (msg) => {
      const payment = JSON.parse(msg);
      console.log("Consume payment:", payment);

      await TuitionModel.updateOne(
        { _id: payment.tuitionId },
        { status: "PAID" }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export { startConsumer };
