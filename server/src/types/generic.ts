import { Response } from "express";

export interface ISingleReturn<T>{
    data:T
    success:boolean
    timestamp:number
}

export interface ISingleResponse<T> extends Response{
    json:(body:ISingleReturn<T>) => this
}