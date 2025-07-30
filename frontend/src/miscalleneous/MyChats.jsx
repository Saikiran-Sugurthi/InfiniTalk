import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import Avatar from "@mui/material/Avatar";
import GroupChatModal from "../miscalleneous/GropupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:3000/api/chat", config);
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="flex flex-col bg-[#2B2D31] p-4 w-full rounded-md shadow-lg h-full text-white">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">My Chats</p>
        <GroupChatModal>
          <button className="flex items-center gap-2 bg-[#4E5058] hover:bg-[#5c5e68] text-white px-4 py-2 rounded-lg transition">
            New Group Chat
            <i className="fa-solid fa-plus text-sm"></i>
          </button>
        </GroupChatModal>
      </div>

      <div className="flex flex-col items-center p-3 rounded-lg w-full h-full overflow-y-hidden bg-[#1E1F22]">
        {chats ? (
          <div className="w-full overflow-y-scroll h-full pr-1 custom-scrollbar">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                className={`cursor-pointer px-3 py-2 mb-2 flex items-start gap-3 rounded-md transition duration-150 ${
                  selectedChat?._id === chat._id
                    ? "bg-[#5865F2] text-white"
                    : "bg-[#313338] hover:bg-[#3C3F45] text-gray-200"
                }`}
              >
                <Avatar
                  src={chat.pic}
                  alt={chat.name}
                  sx={{ width: 36, height: 36 }}
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </span>
                  {chat.latestMessage && (
                    <span className="text-sm text-gray-400 truncate w-[180px]">
                      <strong>{chat.latestMessage.sender.name}: </strong>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.slice(0, 50) + "..."
                        : chat.latestMessage.content}
                    </span>
                  )}
                </div>
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
