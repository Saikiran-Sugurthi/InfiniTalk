import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender,getSenderFull } from "../config/ChatLogics";
import Avatar from "@mui/material/Avatar";
import GroupChatModal from "../miscalleneous/GropupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat`, config);
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
    if (user) {
        fetchChats();
    }
  }, [fetchAgain, user]);

  return (
    <div className="flex flex-col bg-[var(--background-main)] text-[var(--text-primary)] p-4 w-full rounded-md shadow-lg h-full transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">My Chats</p>
        <GroupChatModal>
          <button className="flex items-center gap-2 bg-[var(--background-button)] hover:bg-[var(--background-button-hover)] text-[var(--text-primary)] px-4 py-2 rounded-lg transition-colors duration-200">
            New Group Chat
            <i className="fa-solid fa-plus text-sm"></i>
          </button>
        </GroupChatModal>
      </div>

      <div className="flex flex-col items-center p-3 rounded-lg w-full h-full overflow-y-hidden bg-[var(--background-chat-list)] transition-colors duration-300">
        {chats ? (
          <div className="w-full overflow-y-scroll h-full pr-1 custom-scrollbar">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                className={`cursor-pointer px-3 py-2 mb-2 flex items-start gap-3 rounded-md transition-colors duration-150 ${
                  selectedChat?._id === chat._id
                    ? "bg-[var(--background-chat-item-selected)] text-[var(--text-chat-item-selected)]"
                    : "bg-[var(--background-chat-item)] hover:bg-[var(--background-chat-item-hover)] text-[var(--text-chat-item)]"
                }`}
              >
                <Avatar
                  // ✅ FIX 2: Use getSenderFull() to get the user object, then access its .pic property.
                  src={!chat.isGroupChat ? getSenderFull(user, chat.users)?.pic : chat.pic}
                  alt={!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                  sx={{ width: 36, height: 36 }}
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">
                    {!chat.isGroupChat && loggedUser && chat.users
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </span>
                  {chat.latestMessage && (
                    <span className="text-sm text-[var(--text-chat-item-latest)] truncate w-[180px]">
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
