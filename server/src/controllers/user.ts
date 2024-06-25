import { NextFunction, Request } from "express";
import { ISingleResponse } from "../types/generic";
import { IFriend, IRequestWithUser, IUser } from "../types/user";
import { ErrorResponse } from "../utils/errorResponse";
import User from "../models/User";
import { MongooseError } from "mongoose";
import ChatRoom from "../models/ChatRoom";

export const AddFriend = async (
  req: Request,
  res: ISingleResponse<IUser>,
  next: NextFunction
) => {
  const user = (req as IRequestWithUser).user;
  const { friendUsername, userID } = req.body;
  let chatroomId = ""
  try {
    if (!friendUsername) {
      next(new ErrorResponse("Please provide friend id", 200));
      return;
    }
    const friendUserFind = await User.findOne({ username: friendUsername });
    const currentUserFind = await User.findOne({ username: user.username });
    if (!friendUserFind) {
      next(new ErrorResponse("User not found", 200));
      return;
    }
    const friendIdList = friendUserFind?.friendList.map((value: IFriend) => {
      return value.id;
    });
    if (friendIdList.includes(userID)) {
      next(new ErrorResponse("user already added to friend list", 200));
      return;
    }
    if (userID === String(friendUserFind._id)) {
        next(new ErrorResponse("can't add yourself to friend list", 200));
        return;
      }
    if (!friendIdList.includes(userID)) {
      try {
        const chat = await ChatRoom.create({
          member: [
            { username: currentUserFind?.username, id: currentUserFind?._id ,profile: currentUserFind?.profile},
            { username: friendUserFind.username, id: friendUserFind._id,profile:friendUserFind.profile },
          ],
          createAt:Date.now(),
          updateAt:Date.now()
        });
        chatroomId = chat._id as string
      } catch (error) {
        console.log(error);
        next(new ErrorResponse("unable to create chat room", 500));
        return;
      }
    }
    const friendUser = await User.findOneAndUpdate(
      { username: friendUsername },
      { $addToSet: { friendList: { id: userID, username: user.username } ,chatroom:chatroomId} }
    );

    const updateUser = await User.findByIdAndUpdate(
      userID,
      {
        $addToSet: {
          friendList: { id: friendUser?._id, username: friendUser?.username },
          chatroom: chatroomId
        },
      },
      { new: true }
    );
    if (!updateUser) {
      console.log("Here");
      next(new ErrorResponse("Access denied", 500));
      return;
    }
    res
      .status(200)
      .json({ data: updateUser, success: true, timestamp: Date.now() });
  } catch (error) {
    console.log(error);
    next(new ErrorResponse("Access denied", 500));
  }
};
