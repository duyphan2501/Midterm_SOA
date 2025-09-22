import { pool } from "../database/connectDB.js";

const create = async (paymentId, otpCode, otpExpireAt, is_used = 0) => {
  const query = `INSERT INTO otps (payment_id, otp_code, expire_at, is_used) VALUES (?, ?, ?, ?)`;
  const [rows] = await pool.query(query, [
    paymentId,
    otpCode,
    otpExpireAt,
    is_used,
  ]);
  return rows.insertId;
};

const disableValidOtpByPaymentId = async (paymentId) => {
  const query = `UPDATE otps SET is_used = 1 WHERE payment_id = ? AND is_used = 0 AND expire_at >= NOW()`;
  const [result] = await pool.query(query, [paymentId]);
  return result.affectedRows;
};

const getValidOtpByPaymentId = async (paymentId) => {
  const query = `SELECT otp_code FROM otps WHERE payment_id = ? AND is_used = 0 AND expire_at >= NOW() LIMIT 1`;
  const [rows] = await pool.query(query, [paymentId]);
  return rows.length > 0 ? rows[0] : null;
};

const checkExistingValidOtp = async (paymentId, otpCode) => {
  const query = `SELECT 1 FROM otps WHERE otp_code = ? AND payment_id = ? AND is_used = 0 AND expire_at >= NOW() LIMIT 1`;
  const [rows] = await pool.query(query, [otpCode, paymentId]);
  return rows.length > 0;
};

const OtpModel = {
  create,
  getValidOtpByPaymentId,
  disableValidOtpByPaymentId,
  checkExistingValidOtp,
};

export default OtpModel;
