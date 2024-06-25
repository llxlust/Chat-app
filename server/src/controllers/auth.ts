import { NextFunction, Request } from "express";
import { ISingleResponse } from "../types/generic";
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()
import {
  IAuthReturn,
  IUser,
  IUserWithMethod,
} from "../types/user";
import { ErrorResponse } from "../utils/errorResponse";
import { MongooseError } from "mongoose";
import User from "../models/User";
import { IJwtpayloadWithID } from "../types/auth";

export const SendTokenResponse = async (
  user: IUserWithMethod,
  res: ISingleResponse<IUser>,
  code: number
) => {
  const token = user.getSignJwt();
  res
    .status(code)
    .cookie("uid", token)
    .json({
      data: user,
      success: true,
      timestamp: Date.now(),
    });
};

export const Register = async (
  req: Request,
  res: ISingleResponse<IUser>,
  next: NextFunction
) => {
  const { username, password,profile } = req.body;
  console.log(profile,":profile")
  if (!username || !password ||!profile) {
    next(new ErrorResponse("Please provide credential", 400));
    return;
  }
  try {
    const user = await User.create({ username, password,profile });
    SendTokenResponse(user, res, 201);
  } catch (error) {
    next(new ErrorResponse((error as any).code, 500));
  }
};

export const Login = async (
  req: Request,
  res: ISingleResponse<IUser>,
  next: NextFunction
) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next(new ErrorResponse("Please provide credential", 400));
    return;
  }
  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      next(new ErrorResponse("Invalid Credential", 404));
      return;
    }
    console.log(password, ":password");
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      next(new ErrorResponse("Invalid Credential", 404));
      return;
    }
    SendTokenResponse(user, res, 200);
  } catch (error) {
    console.log(error);
  }
};

export const LoginByToken = async (req:Request,res:ISingleResponse<IUser>,next:NextFunction) => {
  const {uid} =  req.cookies
  if(!uid){
    next(new ErrorResponse("Access denied",400))
    return
  }
  const decode = jwt.verify(uid,process.env.JWT_SECRET as string) as IJwtpayloadWithID
  const user = await User.findById(decode.id)
  if(!user){
    next(new ErrorResponse("Access denied",400))
    return
  }
  res.status(200).json({data:user,success:true,timestamp:Date.now()})
}

export const DeleteToken = async (req:Request,res:ISingleResponse<string>,next:NextFunction) => {
  const {uid} = req.cookies
  if(!uid){
    next(new ErrorResponse("Access denied",400))
    return
  }
  res.cookie("uid","").status(200).json({data:"Logout",success:true,timestamp:Date.now()})
}