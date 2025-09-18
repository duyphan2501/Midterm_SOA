import { pool } from "../database/connectDB.js";

const findUnpaidTuition = async (studentId) => {
  const query = `SELECT * FROM tuitions WHERE student_id = ? AND status = ?`;
  const [rows] = await pool.query(query, [studentId, "UNPAID"])
  return rows.length > 0 ? rows: null
}

const markPaidTuition = async (tuitionId) => {
  const query = `UPDATE tuitions SET status = ? WHERE tuition_id = ?`;
  const [result] = await pool.query(query, ["PAID", tuitionId]);
  return result.affectedRows; 
}

const TuitionModel = {findUnpaidTuition, markPaidTuition}

export default TuitionModel