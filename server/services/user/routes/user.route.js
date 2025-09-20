import express from "express";
import {
  decreaseBalance,
  login,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.put("/decrease-balance", decreaseBalance);

export default router;
