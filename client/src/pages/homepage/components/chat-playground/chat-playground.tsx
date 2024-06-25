import { useContext, useEffect, useState } from "react";
import classes from "./chat-playground.module.scss";
import { IChatHistory, IChatHistoryWithConvertTime, IChatRoom } from "../../../../types/chatroom";
import { SessionContext } from "../../../../stores/session.context";
import axios from "axios";
export default function ChatPlayGround({
  socket,
  data,
}: {
  socket: any;
  data: IChatRoom;
}) {
  const { user } = useContext(SessionContext);
  const [messageLog, setMessageLog] = useState<IChatHistory[]>([]);
  const [inputMsg, setInputMsg] = useState<string>("");
  const [imgPath, setImgPath] = useState<string>("");
  const joinRoom = async (id: string) => {
    socket.emit("join_room", id);
  };
  useEffect(() => {
    if (data) {
      setMessageLog(data.log);
      joinRoom(data._id as string);
      data.member.map((value) => {
        if (value.username !== user?.username) {
          console.log(value.profile);
          setImgPath(value.profile);
        }
      });
    }
  }, [data]);

  useEffect(() => {
    socket.on("recive_message", (data: any) => {
      setMessageLog((prev) => [
        ...prev,
        { author: data.author, message: data.message, timestamp: Date.now() },
      ]);
    });
    return () => {
      socket.off("recive_message", (data: any) => {
        setMessageLog((prev) => [
          ...prev,
          { author: data.author, message: data.message, timestamp: Date.now() },
        ]);
      });
    };
  }, [socket]);
  console.log(messageLog);
  const onSendMessageHandler = async () => {
    if (inputMsg === "") {
      return;
    }
    try {
      const payload: IChatHistory = {
        author: {
          id: user?._id as string,
          username: user?.username as string,
        },
        message: inputMsg,
        timestamp: Date.now(),
      };
      const sentMsg = await axios.post(
        "http://localhost:3100/api/v1/chat/joinRoom",
        { payload, roomID: data._id },
        { withCredentials: true }
      );
      console.log(sentMsg);
    } catch (err) {
      console.log(err);
    }
    setInputMsg("");
    //setMessageLog((prev) => [...prev, { form: "self", msg: inputMsg }]);
  };

  return (
    <>
      <div className={classes.hero}>
        <div>
          <div className={classes.chatArea}>
            {data && (
              <>
                {messageLog.map((value: IChatHistoryWithConvertTime, index: number) => {
                  return (
                    <>
                      <div key={index}>
                        {value.author.username === user?.username ? (
                          <>
                            <div className={classes.selfContainer}>
                             <div>
                                <div className={classes.self}>
                                  {value.message}
                                </div>
                               <div style={{display:"flex",justifyContent:"end"}}> <div className={classes.time}>{value.timestamp}</div></div>
                             </div>
                              <img
                                className={classes.img}
                                src={`./public/${user.profile}`}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={classes.incomingContainer}>
                              <img
                                className={classes.img}
                                src={`./public/${imgPath}`}
                              />
                              <div>
                                {" "}
                                <div className={classes.incoming}>
                                  {value.message}
                                </div>
                                <div className={classes.time}>{value.timestamp}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </div>
        {data && (
          <>
            <div className={classes.sendBar}>
              <input
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              ></input>
              <button onClick={() => onSendMessageHandler()}>
                Send message
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
