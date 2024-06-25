import { useContext, useState } from "react";
import classes from "./chat-list.module.scss";
import { TbBubblePlus } from "react-icons/tb";
import axios, { AxiosError, AxiosResponse } from "axios";
import { SessionContext } from "../../../../stores/session.context";
import { IErrorResponse, IResponse } from "../../../../types/response";
import { IUser } from "../../../../types/user";
import { IChatRoom } from "../../../../types/chatroom";
import ChatRoom from "./components/chat-room";

export default function ChatList({
  chatroomList,
  setCurrentChatroom,
  currentChatroom,
}: {
  chatroomList: IChatRoom[];
  setCurrentChatroom: (chat:IChatRoom) => void;
  currentChatroom:string
}) {
  const [friendUsername, setFriendUsername] = useState<string>("");
  const { user } = useContext(SessionContext);
  const AddFriend = async () => {
    try {
      const data = (await axios.post(
        "http://localhost:3100/api/v1/user/addFriend",
        { friendUsername, userID: user?._id },
        { withCredentials: true }
      )) as AxiosResponse;
      const response = data.data as IResponse<IUser | string>;
      if (!response.success) {
        const errorData = data.data as IErrorResponse;
        alert(errorData.data);
      } else {
        alert(`${friendUsername} is your friend now`);
        window.location.reload()
      }
    } catch (error) {
      const message = "An error occurred. Please try again.";
      console.log(message)
    }
  };

  return (
    <>
      <div className={classes.hero}>
        <div className={classes.controller}>
          <input onChange={(e) => setFriendUsername(e.target.value)}></input>
          <TbBubblePlus
            onClick={() => AddFriend()}
            className={classes.create}
          />
        </div>
        <div className={classes.chatroom}>
          {chatroomList.map((value: IChatRoom, index: number) => {
            return (
              <div onClick={() => setCurrentChatroom(value)} key={index}>
                <ChatRoom
                  currentChat={currentChatroom}
                  currentUser={user?.username as string}
                  data={value}
                />
              </div>
            );
          })}
          {/* <ChatRoom username="userx1c" /> */}
        </div>
      </div>
    </>
  );
}
