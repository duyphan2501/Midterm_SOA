const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    tuitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Tuition" },
    otpCode: String,
    otpExpireAt: Date,
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true, collection: "payments" }
);

module.exports = mongoose.model("Payment", paymentSchema);
