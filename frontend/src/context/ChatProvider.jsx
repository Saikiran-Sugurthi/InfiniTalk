import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Children } from "react";
import { createContext } from "react";

import { useNavigate } from "react-router-dom";

const ChatContext=createContext();

export default function ChatProvider({Children}){

    const [user,setUser]=useState();

   const navigate=useNavigate();


    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        
        setUser(userInfo);

        if(!userInfo){
            navigate("/");
        }

    },[navigate])


    return(
        <ChatContext.Provider value={{user,setUser}}>{Children}</ChatContext.Provider>
    )

}


export const ChatState=()=>{
    return useContext(ChatContext);
}