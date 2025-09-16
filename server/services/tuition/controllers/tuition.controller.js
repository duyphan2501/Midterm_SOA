import CreateError from "http-errors";
import TuitionModel from "../models/TuitionModel.js";
import ReplicaUserModel from "../models/ReplicaUserModel.js";

const getUnPaidTuitionFee = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!studentId) throw CreateError.BadRequest("Student ID is required");

    const tuitionQuery = TuitionModel.findOne({ studentId, status: "UNPAID" });
    const studentQuery = ReplicaUserModel.findOne({ studentId });

    const [tuition, student] = await Promise.all([tuitionQuery, studentQuery]);

    if (!tuition)
      throw CreateError.NotFound("There is no any unpaid tuition fee");
    if (!student) throw CreateError.NotFound("Student does not exist");

    return res.status(200).json({
      success: true,
      tuition,
      student,
    });
  } catch (error) {
    next(error);
  }
};

const createTuitionFee = async (req, res, next) => {
  try {
    const { studentId, semester, amount } = req.body;

    if (!studentId || !semester || amount === undefined) {
      throw CreateError.BadRequest(
        "studentId, semester and amount are required"
      );
    }

    const student = await ReplicaUserModel.findOne({ studentId });
    if (!student) throw CreateError.NotFound("Student does not exist");

    const tuition = await TuitionModel.create({
      studentId,
      semester,
      amount,
    });

    return res.status(201).json({
      success: true,
      message: "Tuition fee created successfully",
      tuition,
    });
  } catch (error) {
    next(error);
  }
};

export { getUnPaidTuitionFee, createTuitionFee };
