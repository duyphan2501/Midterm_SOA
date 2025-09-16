// tuitionConsumer.js
import { consumeQueue } from "../../../shared/messages/rabbitMQ.js";
import ReplicaUserModel from "../models/ReplicaUserModel.js"
const startConsumer = async () => {
  await consumeQueue("user_created", async (msg) => {
    try {
      const user = JSON.parse(msg);
      console.log("New User:", user);

      await ReplicaUserModel.create(user);
    } catch (err) {
      console.log(err);
    }
  });

  console.log("Tuition consumer is ready")
};

export {startConsumer}
