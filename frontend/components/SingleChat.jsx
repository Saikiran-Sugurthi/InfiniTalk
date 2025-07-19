import React, { useEffect, useState } from "react";
import { ChatState } from "../src/context/ChatProvider";
import { getSender, getSenderFull } from "../src/config/ChatLogics";
import ProfileModal from "../src/miscalleneous/ProfileModal";
import GroupUpdateModal from "../src/miscalleneous/GroupUpdateModal";
import CircularProgress from '@mui/material/CircularProgress';
import ScrollableChat from "../components/ScrollableChat"
import {io} from 'socket.io-client';
import axios from "axios";
import { useToast } from "./ToastContext";
import { formControlClasses } from "@mui/material";



const ENDPOINT="http://localhost:3000";
var socket,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages,setMessages]=useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading,setLoading]=useState(false);
  const [socketConnected,setSocketConnected]=useState(false);
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);


  const showToast=useToast();


  const typingHandler=(e)=>{
    setNewMessage(e.target.value);

    //typing effect logic

    if(!socketConnected) return;

    if(!typing){
      setTyping("true");
      socket.emit("typing",selectedChat._id);

    }

    var lastTypingTime=new Date().getTime();

    var timerLength=1000;

    setTimeout(()=>{
      var timeNow=new Date().getTime();

      var timeDiff=timeNow-lastTypingTime;

      if(timeDiff>=timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false);
      }


    },timerLength);


  }

  const fetchMessages=async()=>{

      if(!selectedChat) return;

      try {
        setLoading(true);
        
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }

        const {data}=await axios.get(`http://localhost:3000/api/message/${selectedChat._id}`,config);

        setMessages(data);
        console.log(data);
        setLoading(false);
        
        socket.emit("join chat",selectedChat._id);

      } catch (error) {
        setLoading(false);
        showToast(error.message,"error");
      }


  }

    useEffect(()=>{
      fetchMessages()
      selectedChatCompare=selectedChat;
    },[selectedChat]);


  useEffect(() => {
  if (!socket) {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected",()=>setSocketConnected(true))
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>setIsTyping(false));
  }

  return () => {
    if (socket) {
      socket.disconnect();
    }
  };
}, []);
useEffect(() => {
  // if (!socket) return;

  socket.on("message recieved", (newMessageRecieved) => {
    if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
      // show notification
    } else {
      setMessages(prevMessages => [...prevMessages, newMessageRecieved]);
    }
  });

  // return () => {
  //   socket.off("message recieved");
  // };
},[] );


  const sendMessage=async(event)=>{

    if(event.key=="Enter" && newMessage ){
      socket.emit("stop typing",selectedChat._id);
      try {
        
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`
          }
        }
        setNewMessage("");
        const {data}=await axios.post("http://localhost:3000/api/message/",{
          content:newMessage,
          chatId:selectedChat._id
        },config);
        
        console.log(data)
        

        setMessages([...messages,data])
        socket.emit("new message",data);

      } catch (error) {
        showToast(error.message,"error");

      }


    }

  }

  

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full w-full">

          {/* Chat Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b shadow-sm bg-white">
            <div className="text-xl font-semibold">
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <GroupUpdateModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </>
              )}
            </div>
          </div>

          {/* Chat Body (Messages Area) */}
          <div className="flex-1 p-4 bg-[#E8E8E8] overflow-y-auto">
            {loading? <CircularProgress size={60} className="text-blue-500"/>:(<div className="messages">
              <ScrollableChat messages={messages} isTyping={isTyping}/>
            
            </div>)}
             
          </div>
         

          {/* Chat Input (at the bottom) */}
          <div className="px-4 py-2 border-t bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                onKeyDown={sendMessage}
                value={newMessage}
                onChange={typingHandler}
                className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                onClick={sendMessage}
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <p className="text-3xl pb-3">Click on any user to start chatting</p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
