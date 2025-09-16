import express from "express"
import { createPayment, processPayment, sendOtp } from "../controllers/payment.controller.js"

const router = express.Router()

router.post("/create", createPayment)
router.put("/process", processPayment)
router.put("/otp/send", sendOtp)

export default router