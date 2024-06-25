import mongoose, { Model } from "mongoose";
import { IChatRoom, IChatRoomWIthMethod } from "../types/chatroom";
export const ChatRoomModel = 'ChatRoom'
export type ChatRoomModelType = Model<IChatRoom,Record<string,unknown>,IChatRoomWIthMethod>
export const ChatRoomSchema = new mongoose.Schema<IChatRoom>({
    log:{
        type:[{message:String,author:{username:String,id:String},timestamp:Number}],
        default:[]
    },
    member:{
        type:[{username:String,id:String,profile:String}],
        required:[true,"room must have member"]
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model<IChatRoom,ChatRoomModelType>(ChatRoomModel,ChatRoomSchema)