import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { checkConnection } from "./database/connectDB.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import router from "./routes/payment.route.js";
dotenv.config({ quite: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_, res) =>
  res.json({ success: true, service: "payments" })
);

const PORT = process.env.PORT || 3003;

app.use("/", router);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Payments service on ${PORT}`);
  await checkConnection();
});
