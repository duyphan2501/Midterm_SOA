import express from "express"
import { createPayment, processPayment, sendOtp } from "../controllers/payment.controller.js"
import checkAuth from "../middlewares/checkAuth.js"
const router = express.Router()

router.post("/create", checkAuth, createPayment)
router.put("/process", processPayment)
router.put("/otp/send", sendOtp)

export default router