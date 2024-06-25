import { useEffect, useState } from 'react'
import { IChatRoom } from '../../../../../types/chatroom'
import classes from './chat-room.module.scss'
interface IChatRoomProps{
    data:IChatRoom
    currentUser:string
    currentChat:string
}
export default function ChatRoom({data,currentUser,currentChat}:IChatRoomProps){
    const [username,setUsername] = useState<string>("user not found")
    const [imgPath,setImgPath] = useState<string>("")
    useEffect(()=>{
        data.member.map((value)=>{
            if(value.username !== currentUser){
                setUsername(value.username)
                setImgPath(value.profile)
            }
        })
    },[])
    return <>
        <div className={classes[`${currentChat === data._id ? "card-active" : "card"}`]}>
            <img className={classes.profile} src={`/public/${imgPath}`}/>
            <div>
                <div className={classes.name}>{username}</div>
                <div className={classes.lastest}>lastest message</div>
            </div>
        </div>
    </>
}