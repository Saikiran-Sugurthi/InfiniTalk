import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
const MyChats = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:3000/api/chat",
        config
      );

      console.log(data);
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
    console.log("Stored userInfo:", storedUser);

    fetchChats();                     
  }, []);

  return (
     <div
    className="flex flex-col bg-white p-4 w-full rounded-md shadow "
  >
    
    <div className="flex justify-between items-center mb-4">
      <p className="text-lg font-semibold">My Chats</p>

      <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm transition">
        New Group Chat
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
<div className="flex flex-col items-center p-3 rounded-lg w-full h-full overflow-y-hidden bg-white">

  {chats ? (
    <div className="w-full overflow-y-scroll">
      {chats.map((chat) => (
        <div
          onClick={() => setSelectedChat(chat)}
          key={chat._id}
          className={`cursor-pointer rounded px-3 py-2 mb-2 shadow-sm ${
            selectedChat?._id === chat._id ? "bg-[#5c8f96] text-white" : "bg-white text-black"
          }`}
        >
          {!chat.isGroupChat?getSender(loggedUser,chat.users):chat.chatName}
        </div>
      ))}
    </div>
  ) : (
    <ChatLoading />
  )}
  
</div>

    
  </div>
  );
};

export default MyChats;




//  className={`${
//       selectedChat ? "hidden" : "flex"
//     } flex-col bg-white p-4 w-full rounded-md shadow`}