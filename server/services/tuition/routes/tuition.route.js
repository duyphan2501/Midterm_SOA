import express from "express"
import { getUnPaidTuitionFee } from "../controllers/tuition.controller.js"
import checkAuth from "../../../shared/middlewares/checkAuth.js"

const router = express.Router()

router.get("/get/unpaid/:studentId", checkAuth, getUnPaidTuitionFee)

export default router