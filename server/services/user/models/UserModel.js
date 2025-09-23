import { pool } from "../database/connectDB.js";

const findUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = ? LIMIT 1";
  const [rows] = await pool.query(query, [username]);
  return rows.length > 0 ? rows[0] : null;
};

const findUserById = async (userId) => {
  const query = "SELECT * FROM users WHERE user_id = ? LIMIT 1";
  const [rows] = await pool.query(query, [userId]);
  return rows.length > 0 ? rows[0] : null;
}

const getBalance = async (userId) => {
  const query = "SELECT balance FROM users WHERE id = ? LIMIT 1";
  const [rows] = await pool.query(query, [userId]);
  return rows.length > 0 ? rows[0].balance : null;
};

const decreaseBalance = async (decreaseAmount, userId) => {
  const query = "UPDATE users SET balance = balance - ? WHERE user_id = ? AND balance >= ?";
  const [result] = await pool.query(query, [decreaseAmount, userId, decreaseAmount]);
  return result.affectedRows; 
};

const UserModel = { findUserByUsername, getBalance, decreaseBalance, findUserById }

export default UserModel;
