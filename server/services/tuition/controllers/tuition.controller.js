import CreateError from "http-errors";
import TuitionModel from "../models/TuitionModel.js";

const getUnPaidTuitionFee = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!studentId) throw CreateError.BadRequest("Student ID is required");
    const tuition = await TuitionModel.findUnpaidTuition(studentId);
    if (!tuition)
      throw CreateError.NotFound("There is no any unpaid tuition fee");

    return res.status(200).json({
      success: true,
      tuition,
    });
  } catch (error) {
    next(error);
  }
};

export { getUnPaidTuitionFee };
