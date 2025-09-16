import {
  consumeQueue,
  subscribeMessage,
} from "../../../shared/messages/rabbitMQ.js";
import ReplicaUserModel from "../models/ReplicaUserModel.js";
import TuitionModel from "../models/TuitionModel.js";

const startConsumer = async () => {
  try {
    await consumeQueue("user_created", async (msg) => {
      const user = JSON.parse(msg);
      await ReplicaUserModel.create(user);
    });

    await subscribeMessage(
      "payment_success",
      "queue_deduct_tuition",
      async (msg) => {
        const payment = JSON.parse(msg);
        const updated = await TuitionModel.findByIdAndUpdate(
          payment.tuitionId,
          { status: "PAID" }
        );
        if (updated) console.log("Deducted tutition");
        else throw new Error("Failed to deducted tutition");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export { startConsumer };
