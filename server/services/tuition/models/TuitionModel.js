import mongoose from "mongoose";

const tuitionSchema = new mongoose.Schema({
  studentId: {type:String, required: true},
  fullname: {type:String, required: true},
  semester: {type: String, required: true},
  amount: {type: Number, required: true, min: 0},
  status: {
    type: String,
    enum: ["PAID", "UNPAID"],
    default: "UNPAID"
  },
}, { timestamps: true, collection: "tuitions" })

export default mongoose.model('Tuition', tuitionSchema);
