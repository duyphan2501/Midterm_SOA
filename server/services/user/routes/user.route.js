import express from "express";
import {
  createAccount,
  getUserInfo,
  login,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/create", createAccount);
router.get("/get/:username", getUserInfo);

export default router;
