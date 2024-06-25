import express, { NextFunction, Request } from 'express'
import { ISingleResponse } from '../types/generic'
import { DeleteToken, Login, LoginByToken, Register } from '../controllers/auth'

const router = express.Router()

router.post("/register",Register)
router.post("/login",Login)
router.post("/loginByToken",LoginByToken)
router.delete("/logout",DeleteToken)
export default router