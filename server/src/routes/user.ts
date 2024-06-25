import express from 'express'
import { AddFriend } from '../controllers/user'
import { Protect } from '../middlewares/auth'
import { io } from '../server'

const router = express.Router()

router.post("/addFriend",Protect,AddFriend)
export default router