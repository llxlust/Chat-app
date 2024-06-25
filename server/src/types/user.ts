import { Request } from "express"

export interface IUser {
    username:string
    password:string
    friendList:IFriend[]
    profile:string
    chatroom:string[]
}



export interface IUserWithMethod extends IUser{
    getSignJwt: ()=>string
    matchPassword: (enteredPassword:number)=>boolean
}

export interface IAuthReturn{
    user:IUser
    token:string
}
export interface IFriend {
    id:string
    username:string
    profile?:string
}
export interface IRequestWithUser extends Request{
    user:IUser
}