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
exports.AddFriend = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const User_1 = __importDefault(require("../models/User"));
const ChatRoom_1 = __importDefault(require("../models/ChatRoom"));
const AddFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { friendUsername, userID } = req.body;
    let chatroomId = "";
    try {
        if (!friendUsername) {
            next(new errorResponse_1.ErrorResponse("Please provide friend id", 200));
            return;
        }
        const friendUserFind = yield User_1.default.findOne({ username: friendUsername });
        const currentUserFind = yield User_1.default.findOne({ username: user.username });
        if (!friendUserFind) {
            next(new errorResponse_1.ErrorResponse("User not found", 200));
            return;
        }
        const friendIdList = friendUserFind === null || friendUserFind === void 0 ? void 0 : friendUserFind.friendList.map((value) => {
            return value.id;
        });
        if (friendIdList.includes(userID)) {
            next(new errorResponse_1.ErrorResponse("user already added to friend list", 200));
            return;
        }
        if (userID === String(friendUserFind._id)) {
            next(new errorResponse_1.ErrorResponse("can't add yourself to friend list", 200));
            return;
        }
        if (!friendIdList.includes(userID)) {
            try {
                const chat = yield ChatRoom_1.default.create({
                    member: [
                        { username: currentUserFind === null || currentUserFind === void 0 ? void 0 : currentUserFind.username, id: currentUserFind === null || currentUserFind === void 0 ? void 0 : currentUserFind._id, profile: currentUserFind === null || currentUserFind === void 0 ? void 0 : currentUserFind.profile },
                        { username: friendUserFind.username, id: friendUserFind._id, profile: friendUserFind.profile },
                    ],
                    createAt: Date.now(),
                    updateAt: Date.now()
                });
                chatroomId = chat._id;
            }
            catch (error) {
                console.log(error);
                next(new errorResponse_1.ErrorResponse("unable to create chat room", 500));
                return;
            }
        }
        const friendUser = yield User_1.default.findOneAndUpdate({ username: friendUsername }, { $addToSet: { friendList: { id: userID, username: user.username }, chatroom: chatroomId } });
        const updateUser = yield User_1.default.findByIdAndUpdate(userID, {
            $addToSet: {
                friendList: { id: friendUser === null || friendUser === void 0 ? void 0 : friendUser._id, username: friendUser === null || friendUser === void 0 ? void 0 : friendUser.username },
                chatroom: chatroomId
            },
        }, { new: true });
        if (!updateUser) {
            console.log("Here");
            next(new errorResponse_1.ErrorResponse("Access denied", 500));
            return;
        }
        res
            .status(200)
            .json({ data: updateUser, success: true, timestamp: Date.now() });
    }
    catch (error) {
        console.log(error);
        next(new errorResponse_1.ErrorResponse("Access denied", 500));
    }
});
exports.AddFriend = AddFriend;
