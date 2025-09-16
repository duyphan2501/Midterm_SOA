import mongoose from "mongoose";

const replicaUserSchema = new mongoose.Schema({
    studentId: {type: String, unique: true, required: true},
    fullname: {type: String, required: true},
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
}, { timestamps: true, collection: "replica_users" })


export default mongoose.model("ReplicaUser", replicaUserSchema)