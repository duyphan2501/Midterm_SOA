const mongoose = require('mongoose');

const tuitionSchema = new mongoose.Schema({
  mssv: {type: String, required: true},
  semester: {type: String, required: true},
  amount: {type: Number, required: true, min: 0},
  status: {
    type: String,
    enum: ["PAID", "UNPAID"],
    default: "UNPAID"
  },
}, { timestamps: true, collection: "tuitions" })

module.exports = mongoose.model('Tuition', tuitionSchema);
