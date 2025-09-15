import express from "express"
import { createAccount, login } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/login", login)
router.post("/create", createAccount)

export default router