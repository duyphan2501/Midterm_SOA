import CreateError from "http-errors";
import TuitionModel from "../models/TuitionModel.js";

const getUnPaidTuitionFee = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!studentId) throw CreateError.BadRequest("Vui lòng nhập mã sinh viên");
    const tuition = await TuitionModel.findUnpaidTuition(studentId);
    if (!tuition)
      throw CreateError.NotFound("Không tìm thấy học phí chưa thanh toán");

    return res.status(200).json({
      success: true,
      tuition,
    });
  } catch (error) {
    next(error);
  }
};

export { getUnPaidTuitionFee };
