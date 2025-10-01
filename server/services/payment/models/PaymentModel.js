import { pool } from "../database/connectDB.js";

const checkPaidTuition = async (tuitionId) => {
  const query = `SELECT 1 FROM payments WHERE tuition_id = ? AND status = ? LIMIT 1`;
  const [rows] = await pool.query(query, [tuitionId, "SUCCESS"]);
  return rows.length > 0;
};

const create = async (paymentCode, tuitionId, payerId, amount) => {
  const query = `
    INSERT INTO payments
      (payment_code, tuition_id, payer_id, amount)
    VALUES (?, ?, ?, ?)
  `;
  const [rows] = await pool.query(query, [
    paymentCode,
    tuitionId,
    payerId,
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
  try {
    const [result] = await pool.query(
      `
      UPDATE payments p
      JOIN otps o ON o.payment_id = p.payment_id
      LEFT JOIN payments p2 
        ON p2.tuition_id = p.tuition_id 
       AND p2.status = 'SUCCESS'
      SET 
        p.status = 'SUCCESS',
        o.is_used = 1
      WHERE 
        p.payment_id = ? 
        AND p.status = 'PENDING'
        AND o.otp_code = ?
        AND o.is_used = 0
        AND o.expire_at > NOW()
        AND p2.payment_id IS NULL
    `,
      [paymentId, otpCode]
    );

    return result.affectedRows;
  } catch (err) {
    // Nếu deadlock, coi như affectedRows = -1 để service biết
    if (err.code === "ER_LOCK_DEADLOCK") {
      return -1;
    }
    throw err;
  }
};

const updateStatus = async (paymentId, status, description = null) => {
  let query = `UPDATE payments SET status = ?`;
  const params = [status];

  if (description) {
    query += `, description = ?`; 
    params.push(description);
  }

  query += ` WHERE payment_id = ?`;
  params.push(paymentId);

  const [result] = await pool.query(query, params);
  return result.affectedRows;
};

const getDuplicatePayment = async(tuitionId, payerId, status) => {
  const query = `SELECT * FROM payments where tuition_id = ? AND payer_id = ? AND status = ? LIMIT 1`;
  const [rows] = await pool.query(query, [tuitionId, payerId, status])
  return rows.length > 0 ? rows[0]: null;
}

const getPaymentHistoryByPayerId = async (payerId) => {
  const query = `SELECT payment_code, tuition_id, updated_at, description, amount, status FROM payments where payer_id = ? AND status != ? ORDER BY updated_at DESC`;
  const [rows] = await pool.query(query, [payerId, "PENDING"])
  return rows.length > 0 ? rows: [];
}

const PaymentModel = {
  checkPaidTuition,
  create,
  findPaymentById,
  updatePaymentSuccess,
  updateStatus,
  getDuplicatePayment,
  getPaymentHistoryByPayerId
};

export default PaymentModel;
