import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config()

async function connectDB() {
    const conn = mongoose.connect(process.env.DB_CONNECTION_STRING as string)
    console.log(`connecting to db : ${(await conn).connection.host}`)
}

export default connectDB