import { pool } from "../database/connectDB.js";

const findUnpaidTuition = async (studentId) => {
  const query = `SELECT tuition_id, student_id, student_name, semester, amount, status FROM tuitions WHERE student_id = ? AND status = ?`;
  const [rows] = await pool.query(query, [studentId, "UNPAID"]);
  return rows.length > 0 ? rows : null;
};

const updateStatus = async (tuitionId, status) => {
  const query = `UPDATE tuitions SET status = ? WHERE tuition_id = ?`;
  const [result] = await pool.query(query, [status, tuitionId]);
  return result.affectedRows;
};

const checkStatus = async (tuitionId, status) => {
  const query = `SELECT 1 FROM tuitions WHERE tuition_id = ? AND status = ? LIMIT 1`;
  const [rows] = await pool.query(query, [tuitionId, status]);
  return rows.length > 0;
};

const getTuiTionById = async (tuitionId) => {
  const query = `SELECT student_name, student_id, semester FROM tuitions WHERE tuition_id = ? LIMIT 1`;
  const [rows] = await pool.query(query, [tuitionId]);
  return rows.length > 0 ? rows[0] : null;
};

const TuitionModel = {
  findUnpaidTuition,
  updateStatus,
  checkStatus,
  getTuiTionById,
};

export default TuitionModel;
