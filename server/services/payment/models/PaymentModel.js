import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    tuitionId: { type: String, required: true },
    otpCode: String,
    otpExpireAt: Date,
    payerId: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true, collection: "payments" }
);

export default mongoose.model("Payment", paymentSchema);
