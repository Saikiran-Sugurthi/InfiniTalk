// import { useEffect } from "react";
// import axios from 'axios';
// import { useState } from "react";
import SideDrawer from "../src/miscalleneous/SideDrawer";
import MyChats from "../src/miscalleneous/MyChats";
import ChatBox from "../src/miscalleneous/ChatBox";
import {ChatState} from "../src/context/ChatProvider"

export default function Chats(){
    

    const {user}=ChatState();
    


    return(
        <div style={{width:"100%"}}>
            {user && <SideDrawer/>}

            <div>
                {user && <MyChats/>}
                {user && <ChatBox/>}
            </div>
          
        </div>
    )
}



// const fetchChats=async()=>{
    //     const {data}= await axios.get("http://localhost:3000/api/chat");
    //     console.log(data.chats);
    //     setChats(data.chats);
    // }

    // useEffect(()=>{
    //     fetchChats();
    // },[]);