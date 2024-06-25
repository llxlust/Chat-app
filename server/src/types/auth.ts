import {JwtPayload } from "jsonwebtoken";

export interface IJwtpayloadWithID extends JwtPayload {
    id:string
}

