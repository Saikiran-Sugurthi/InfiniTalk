// import { useEffect } from "react";
// import axios from 'axios';
// import { useState } from "react";
import SideDrawer from "../src/miscalleneous/SideDrawer";
import MyChats from "../src/miscalleneous/MyChats";
import ChatBox from "../src/miscalleneous/ChatBox";
import {ChatState} from "../src/context/ChatProvider"
import Drawer from "../src/miscalleneous/Drawer";

export default function Chats(){
    

    const {user}=ChatState();
    


    return(
        <div style={{width:"100%"}}>
            {user && <SideDrawer/>}
            {user && <Drawer />}

            <div style={{display:"flex",justifyContent:"space-between",width:"100%",height:"91vh",padding:"10px"}}>
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