import OtpModel from "../models/OtpModel.js";

const generatePaymentCode = (tuition) => {
  const semesterString = tuition.semester.split("_").join("");
  return `HP${tuition.student_id}${semesterString}`;
};

const generateNewOtpCode = async (paymentId, minutesExpire) => {
  while (true) {
    const otpCode = Math.floor(Math.random() * 900000 + 100000);
    const isExisting = await OtpModel.checkExistingValidOtp(paymentId, otpCode);
    if (!isExisting) {
      const otpExpireAt = new Date(Date.now() + 1000 * 60 * minutesExpire);
      return { otpCode, otpExpireAt };
    }
  }
};

export { generatePaymentCode, generateNewOtpCode };
