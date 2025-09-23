import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { checkConnection } from "./database/connectDB.js";
import router from "./routes/user.route.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import { startConsumer } from "./messages/userConsumer.js";
import { resetMQ } from "../../shared/messages/rabbitMQ.js";

dotenv.config({ quite: true });

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_, res) => res.json({ success: true, service: "users" }));

const PORT = process.env.PORT || 3001;

app.use("/", router);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Users service on ${PORT}`);
  await checkConnection();
  // await resetMQ("payment_sucess", ["queue_update_balance", "queue_deduct_tuition"])
  // await startConsumer();
});
