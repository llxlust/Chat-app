export interface IResponse<T1,T2 = T1>{
    data:T1 | T2
    success:boolean
    timestamp:number
}

export interface IErrorResponse{
    data:string
    success:boolean
    timestamp:number
}