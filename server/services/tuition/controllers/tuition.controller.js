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


const getTuitionInfo = async (req, res,next) => {
  try {
    const {id} = req.params;

    if (!id) throw CreateError.BadRequest("Thiếu mã học phí")

    const tuition = await TuitionModel.getTuiTionById(id)

    if (!tuition) throw CreateError.NotFound("Học phí không tồn tại")

    return res.status(200).json({
      tuition,
      success: true
    })
  } catch (error) {
    next(error)
  }
  
}

export { getUnPaidTuitionFee, getTuitionInfo };
