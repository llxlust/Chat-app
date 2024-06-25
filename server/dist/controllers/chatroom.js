"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = exports.GetAllChatRoom = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const ChatRoom_1 = __importDefault(require("../models/ChatRoom"));
const server_1 = require("../server");
const GetAllChatRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        next(new errorResponse_1.ErrorResponse("access denied", 400));
        return;
    }
    try {
        const chat = yield ChatRoom_1.default.find({ '_id': user.chatroom });
        res.status(200).json({ data: chat, success: true, timestamp: Date.now() });
    }
    catch (err) {
        next(new errorResponse_1.ErrorResponse("Server Error", 500));
    }
});
exports.GetAllChatRoom = GetAllChatRoom;
const SendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomID, payload } = req.body;
    console.log(payload);
    if (!roomID) {
        next(new errorResponse_1.ErrorResponse("Invalid chat id", 400));
        return;
    }
    try {
        server_1.io.to(roomID).emit("recive_message", { message: payload.message, author: payload.author, timestamp: payload.timestamp });
        const chat = yield ChatRoom_1.default.findByIdAndUpdate(roomID, { $push: { log: payload }, updateAt: payload.timestamp });
        res.status(200).json({ data: `Sent message success`, success: true, timestamp: Date.now() });
    }
    catch (err) {
        next(new errorResponse_1.ErrorResponse("Server error", 500));
    }
});
exports.SendMessage = SendMessage;
