import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({quite: true})

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI tuitiondb not found in environment variables");
    } 

    await mongoose.connect(mongoURI);

    console.log("Tuitions db connected successfully");
  } catch (error) {
    console.error("Tuitions db failed to connect:", error.message);
  }
};

export default connectDB