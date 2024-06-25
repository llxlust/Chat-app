import { NextFunction, Request, Response } from "express";
import { ISingleResponse } from "../types/generic";
import { ErrorResponse } from "../utils/errorResponse";

export const ErrorHandler = (err:ErrorResponse,req:Request,res:ISingleResponse<string>,next:NextFunction) => {
    const code:number = err.statusCode
    let msg:string = err.message
    if(err.message === "11000"){
        msg = "Can't use duplicate credentails"
    }
    res.status(code).json({data:msg,success:false,timestamp:Date.now()})
}