import express from "express"
import { getUnPaidTuitionFee } from "../controllers/tuition.controller.js"

const router = express.Router()

router.get("/get/unpaid/:studentId", getUnPaidTuitionFee)

export default router