import express from 'express'
import { Protect } from '../middlewares/auth'
import { GetAllChatRoom, SendMessage } from '../controllers/chatroom'

const router = express.Router()

router.get(`/getAllChatroom`,Protect,GetAllChatRoom)
router.post(`/joinRoom`,Protect,SendMessage)
export default router