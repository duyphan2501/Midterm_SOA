import express from "express"
import { getTuitionInfo, getUnPaidTuitionFee } from "../controllers/tuition.controller.js"
import checkAuth from "../middlewares/checkAuth.js"

const router = express.Router()

router.get("/get/unpaid/:studentId", checkAuth, getUnPaidTuitionFee)
router.get("/get/:id", checkAuth, getTuitionInfo)

export default router