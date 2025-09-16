import express from "express"
import { createTuitionFee, getUnPaidTuitionFee } from "../controllers/tuition.controller.js"

const router = express.Router()

router.get("/get/unpaid/:studentId", getUnPaidTuitionFee)
router.post("/create", createTuitionFee)

export default router