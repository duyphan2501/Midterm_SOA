import express from "express"
import cors from "cors"
import morgan from "morgan";
import dotenv from 'dotenv'
import connectDB from "./database/connectDB.js";
dotenv.config({quite: true})

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_, res) => res.json({ success: true, service: 'tuitions' }));

const PORT = process.env.PORT || 3002

app.listen(PORT, async() => {
  console.log(`Tuitions service on ${PORT}`)
  await connectDB()
});
