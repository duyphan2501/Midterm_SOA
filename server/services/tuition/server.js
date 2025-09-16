import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./database/connectDB.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import router from "./routes/tuition.route.js";
import { startConsumer } from "./messages/tutitionConsumer.js";
dotenv.config({ quite: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_, res) =>
  res.json({ success: true, service: "tuitions" })
);

const PORT = process.env.PORT || 3002;

app.use("/", router);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Tuitions service on ${PORT}`);
  await connectDB();
  await startConsumer()
});
