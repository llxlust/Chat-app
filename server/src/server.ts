import express, { NextFunction, Request } from "express";
import socket, { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import connectDB from "./configs/db";
import { ErrorHandler } from "./middlewares/errorHandler";
import { Version } from "./utils/constant";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import chatRoute from "./routes/chatroom";
import cookieParser from "cookie-parser";
import cookieF from "cookie";
import { ErrorResponse } from "./utils/errorResponse";
import { ISingleResponse } from "./types/generic";
import ChatRoom from "./models/ChatRoom";
dotenv.config();

const app = express();

const PORT = process.env.PORT || undefined;

if (!PORT) {
  process.exit(1);
}
void connectDB();
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(`/api/${Version.V1}/auth`, authRoute);
app.use(`/api/${Version.V1}/chat`, chatRoute);
app.use(`/api/${Version.V1}/user`, userRoute);
const server = app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});

export const io = new Server(server, {
  cookie: true,
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
io.use(async (socket, next) => {
  const cookieString = socket.handshake.headers.cookie;
  if (!cookieString) {
    next(new ErrorResponse("Not authorize", 403));
    return;
  }
  const cookies = cookieF.parse(cookieString as string);
  const cookie = cookies.uid;
  if (!cookie) {
    next(new ErrorResponse("Not authorize", 403));
    return;
  }
  next();
}).on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log("aaaa");
    console.log("join chat: " + data);
    socket.join(data);
  });
  interface IData {
    roomID:string
    msg:string
    from:{
        id:string
        username:string
    }
  }
//   socket.on("send_message",async (data:IData) => {
//     console.log(data, ":send_message_data");
//     socket
//       .to(data.roomID)
//       .emit("recive_message", {
//         message: data.msg,
//         from: { id: data.from.id, username: data.from.username },
//       });
     
//   });
});
app.use(ErrorHandler);
