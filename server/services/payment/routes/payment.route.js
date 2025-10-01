import express from "express"
import { createPayment, getPaymentHistory, processPayment, sendOtp } from "../controllers/payment.controller.js"
import checkAuth from "../middlewares/checkAuth.js"
import { otpLimiter } from "../middlewares/arcjet.middleware.js"
const router = express.Router()

router.post("/create", checkAuth, createPayment)
router.put("/process", processPayment)
router.put("/otp/send", checkAuth, otpLimiter, sendOtp)
router.get("/history/:payerId", checkAuth, getPaymentHistory)

export default router