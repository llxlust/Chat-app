export interface IChatRoom{
    _id?:string
    log:IChatHistory[]
    member:IFriend[]
    createAt:Date
    updateAt:Date
}

export interface IChatHistory{
    message:string
    author:IAuthor
    timestamp:number
}

export interface IChatHistoryWithConvertTime extends IChatHistory{
    time?:string
}

export interface IAuthor{
    id:string
    username:string
}

export interface IFriend {
    id:string
    username:string
    profile:string
}