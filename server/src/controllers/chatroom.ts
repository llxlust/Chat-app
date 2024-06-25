import { NextFunction, Request } from "express";
import { ISingleResponse } from "../types/generic";
import { IChatRoom } from "../types/chatroom";
import { IRequestWithUser } from "../types/user";
import { ErrorResponse } from "../utils/errorResponse";
import ChatRoom from "../models/ChatRoom";
import { io } from "../server";

export const GetAllChatRoom = async (req:Request,res:ISingleResponse<IChatRoom[]>,next:NextFunction) => {
    const user = (req as IRequestWithUser).user
    if(!user){
        next(new ErrorResponse("access denied",400))
        return
    }
    try{
        const chat = await ChatRoom.find({'_id':user.chatroom})
        res.status(200).json({data:chat,success:true,timestamp:Date.now()})
    }catch(err){
        next(new ErrorResponse("Server Error",500))
    }
}

export const SendMessage = async (req:Request,res:ISingleResponse<string>,next:NextFunction) => {
    const {roomID,payload} = req.body
    console.log(payload)
    if(!roomID){
        next(new ErrorResponse("Invalid chat id",400))
        return
    }
   try{
    io.to(roomID).emit("recive_message",{message:payload.message,author:payload.author,timestamp:payload.timestamp})
    const chat = await ChatRoom.findByIdAndUpdate(roomID,{$push:{log:payload},updateAt:payload.timestamp})
    res.status(200).json({data:`Sent message success`,success:true,timestamp:Date.now()})
   }catch(err){
    next(new ErrorResponse("Server error",500))
   }
}