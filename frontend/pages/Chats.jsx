import { useEffect } from "react";
import axios from 'axios';
import { useState } from "react";

export default function Chats(){
    const [chats,setChats]=useState([]);

    const fetchChats=async()=>{
        const {data}= await axios.get("http://localhost:3000/api/chat");
        console.log(data.chats);
        setChats(data.chats);
    }

    useEffect(()=>{
        fetchChats();
    },[]);


    return(
        <div>
           {chats.map((chat)=>(<div key={chat._id}>{chat.chatName}</div>))}
        </div>
    )
}