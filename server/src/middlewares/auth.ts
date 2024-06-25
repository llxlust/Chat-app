import { NextFunction, Request } from "express";
import { ISingleResponse } from "../types/generic";
import { ErrorResponse } from "../utils/errorResponse";
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { IJwtpayloadWithID } from "../types/auth";
import User from "../models/User";
import { MongooseError } from "mongoose";
import { IRequestWithUser } from "../types/user";
dotenv.config()
export const Protect = async (req:Request,res:ISingleResponse<string>,next:NextFunction) => {
    console.log("aaaa")
    const {uid} = req.cookies
    if(!uid){
        next(new ErrorResponse("Access denied",400))
        return
    }
    
    const decode = jwt.verify(uid,process.env.JWT_SECRET as string) as IJwtpayloadWithID
   try{
    const user = await User.findById(decode.id)
    if(!user){
        console.log("e")
        next(new ErrorResponse("Access denied",400))
        return
    }
    (req as IRequestWithUser).user = user 
    next()
   }catch(error){
    console.log(error)
    next(new ErrorResponse("Access denied",400))
   }
}