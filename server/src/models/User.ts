import mongoose, { Model } from "mongoose";
import { IUser, IUserWithMethod } from "../types/user";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config()
export const UserModel = "User"
export type UserModelType = Model<IUser,Record<string,unknown>,IUserWithMethod>
const UserSchema = new mongoose.Schema<IUser>({
    username:{
        type:String,
        required:[true,"Please provide username"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        select:false
    },
    friendList:{
        type:[{id:String,username:String}],
        default:[]
    },
    profile:{
        type:String,
        required:[true,"Please provide profile image"],
    },
    chatroom:{
        type:[String],
        default:[]
    }
})

UserSchema.pre("save",async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(this.password,salt)
    this.password = password
})

UserSchema.methods.getSignJwt =  function () {
    return jwt.sign({id:this._id},process.env.JWT_SECRET as string)
}

UserSchema.methods.matchPassword = async function (enteredPassword:string) {
    return await bcrypt.compare(enteredPassword,this.password)
}

export default mongoose.model<IUser,UserModelType>(UserModel,UserSchema)