import { pool } from "../database/connectDB.js";

const findUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = ? LIMIT 1";
  const [rows] = await pool.query(query, [username]);
  return rows.length > 0 ? rows[0] : null;
};

const getBalance = async (userId) => {
  const query = "SELECT balance FROM users WHERE id = ? LIMIT 1";
  const [rows] = await pool.query(query, [userId]);
  return rows.length > 0 ? rows[0].balance : null;
};

const decreaseBalance = async (decreaseAmount, userId) => {
  const query = "UPDATE users SET balance = balance - ? WHERE user_id = ?";
  const [result] = await pool.query(query, [decreaseAmount, userId]);
  return result.affectedRows; 
};

const UserModel = { findUserByUsername, getBalance, decreaseBalance }

export default UserModel;
