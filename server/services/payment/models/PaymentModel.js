import { pool } from "../database/connectDB.js";

const checkPaidPayment = async (paymentCode) => {
  const query = `SELECT 1 FROM payments WHERE payment_code = ? AND status = ? LIMIT 1`;
  const [rows] = await pool.query(query, [paymentCode, "SUCCESS"]);
  return rows.length > 0;
};

const create = async (
  paymentCode,
  tuitionId,
  payerId,
  otpCode,
  otpExpireAt,
  amount
) => {
  const query = `
    INSERT INTO payments
      (payment_code, tuition_id, payer_id, otp_code, otp_expire_at, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [rows] = await pool.query(query, [
    paymentCode,
    tuitionId,
    payerId,
    otpCode,
    otpExpireAt,
    amount,
  ]);
  return rows.insertId;
};

const findPaymentById = async (paymentId) => {
  const query = `SELECT * FROM payments WHERE payment_id = ? LIMIT 1`;
  const [rows] = await pool.query(query, [paymentId]);
  return rows.length > 0 ? rows[0] : null;
};

const updatePaymentSuccess = async (paymentId, otpCode) => {
  const query = `UPDATE payments
       SET status = 'SUCCESS', otp_code = NULL, otp_expire_at = NULL
       WHERE payment_id = ? AND status = 'PENDING' AND otp_code = ? AND otp_expire_at > NOW()`;
  const [result] = await pool.query(query, [paymentId, otpCode]);
  return result.affectedRows;
};

const updatePaymentOtp = async (paymentId, otpCode, otpExpireAt) => {
  const query = `UPDATE payments
       SET otp_code = ?, otp_expire_at = ?
       WHERE payment_id = ?`;
  const [result] = await pool.query(query, [otpCode, otpExpireAt, paymentId]);
  return result.affectedRows;
}

const updateStatus = async (paymentId, status) => {
  const query = `UPDATE payments SET status = ? WHERE payment_id = ?`;
  const [result] = await pool.query(query, [status, paymentId]);
  return result.affectedRows;
};

const PaymentModel = {
  checkPaidPayment,
  create,
  findPaymentById,
  updatePaymentSuccess,
  updatePaymentOtp,
  updateStatus
};

export default PaymentModel;
