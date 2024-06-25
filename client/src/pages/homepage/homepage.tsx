import classes from "./homepage.module.scss";
import ChatList from "./components/chat-list/chat-list";
import ChatPlayGround from "./components/chat-playground/chat-playground";
import * as socketIO from "socket.io-client";
import { useEffect, useState } from "react";
import { IChatRoom } from "../../types/chatroom";
import axios, { AxiosResponse } from "axios";
export default function HomePage() {
  const socket = socketIO.connect("http://localhost:3100/", {
    withCredentials: true,
  });
  const [chatroom, setChatRoom] = useState<IChatRoom[] | null>();
  const [currentChatroom, setCurrentChatroom] = useState<IChatRoom | null>(null);
  const [current,setCurrent] = useState<string>("")
  const fetch = async () => {
    try {
      const data = (await axios.get(
        "http://localhost:3100/api/v1/chat/getAllChatroom",
        { withCredentials: true }
      )) as AxiosResponse;
      setChatRoom(data.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  console.log(currentChatroom, ":currentChatroom");
  return (
    <>
      <div className={classes.container}>
        {chatroom && (
          <ChatList
            setCurrentChatroom={(chat: IChatRoom) => {setCurrentChatroom(chat)
                setCurrent(chat._id as string)
            }}
            chatroomList={chatroom}
            currentChatroom={current}
          />
        )}
        <ChatPlayGround data={currentChatroom as IChatRoom} socket={socket} />
      </div>
    </>
  );
}
