import express from "express";
import {
  decreaseBalance,
  login,
  refreshUser,
} from "../controllers/user.controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/login", login);
router.put("/decrease-balance", checkAuth, decreaseBalance);
router.get("/refresh", checkAuth, refreshUser);

export default router;
