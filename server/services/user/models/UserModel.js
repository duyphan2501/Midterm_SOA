const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, unique: true, index: true, required: true },
    phone: { type: String, required: true },
    balance: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
