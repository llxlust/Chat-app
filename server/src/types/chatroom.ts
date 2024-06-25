import { IFriend } from "./user"

export interface IChatRoom{
    _id?:string
    log:IChatHistory[]
    member:IFriend[]
    createAt:Date
    updateAt:Date
    profile:string
}

export interface IChatHistory{
    message:string
    author:IAuthor
    timestamp:number
}

export interface IAuthor{
    id:string
    username:string
}

export interface IChatRoomWIthMethod extends IChatRoom{

}