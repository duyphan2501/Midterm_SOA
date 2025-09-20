import { pool } from "../database/connectDB.js";

const findUnpaidTuition = async (studentId) => {
  const query = `SELECT * FROM tuitions WHERE student_id = ? AND status = ?`;
  const [rows] = await pool.query(query, [studentId, "UNPAID"])
  return rows.length > 0 ? rows: null
}

const updateStatus = async (tuitionId, status) => {
  const query = `UPDATE tuitions SET status = ? WHERE tuition_id = ?`;
  const [result] = await pool.query(query, [status, tuitionId]);
  return result.affectedRows; 
}

const checkStatus = async (tuitionId, status) => {
  const query = `SELECT 1 FROM tuitions WHERE tuition_id = ? AND status = ? LIMIT 1`;
  const [rows] = await pool.query(query, [tuitionId, status]);
  return rows.length > 0;
}

const TuitionModel = {findUnpaidTuition, updateStatus, checkStatus}

export default TuitionModel