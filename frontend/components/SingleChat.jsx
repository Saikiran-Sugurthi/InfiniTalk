import React, { useEffect, useState, useRef } from "react";
import { ChatState } from "../src/context/ChatProvider";
import { getSender, getSenderFull } from "../src/config/ChatLogics";
import ProfileModal from "../src/miscalleneous/ProfileModal";
import GroupUpdateModal from "../src/miscalleneous/GroupUpdateModal";
import CircularProgress from "@mui/material/CircularProgress";
import ScrollableChat from "../components/ScrollableChat";
import { io } from "socket.io-client";
import axios from "axios";
import { useToast } from "./ToastContext";
import { Avatar } from "@mui/material";
const ENDPOINT = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const showToast = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      setNotifications(
        notifications.filter((n) => n.chat._id !== selectedChat._id)
      );
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.some((n) => n._id === newMessageRecieved._id)) {
          setNotifications((prev) => [newMessageRecieved, ...prev]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    };

    socket.on("message recieved", handleMessageReceived);

    return () => {
      socket.off("message recieved", handleMessageReceived);
    };
  }, [notifications, fetchAgain, setFetchAgain, setNotifications]);

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
         `${import.meta.env.VITE_API_URL}/api/message/`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        showToast(error.message, "error");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        // ✅ FIX 1: Added a space between text-[var(--text-primary)] and rounded-lg
        <div className="flex flex-col h-full w-full bg-[var(--background-chat-window)] text-[var(--text-primary)] rounded-lg shadow-inner transition-colors duration-300">
          {/* Chat Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--border-color)] bg-[var(--background-header)] transition-colors duration-300">
            <div className="text-lg font-semibold tracking-wide flex justify-center items-center gap-3">
              {/* ✅ FIX 2: Replaced hardcoded text-white with CSS variable */}
              <button
                onClick={() => setSelectedChat(null)}
                className="cursor-pointer text-[var(--text-primary)] py-1 rounded"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>

              {!selectedChat.isGroupChat ? (
                <>
                  <Avatar src={getSenderFull(user, selectedChat.users)?.pic} />
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <GroupUpdateModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-[var(--background-chat-body)] transition-colors duration-300">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress size={50} sx={{ color: "var(--accent-send-button)" }} />
              </div>
            ) : (
              <>
                <ScrollableChat messages={messages} isTyping={isTyping} />
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-2 bg-[var(--background-header)] border-t border-[var(--border-color)] transition-colors duration-300">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                onKeyDown={sendMessage}
                value={newMessage}
                onChange={typingHandler}
                className="flex-1 px-4 py-2 text-sm rounded-full bg-[var(--background-input)] text-[var(--text-primary)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus-ring)] placeholder-[var(--text-placeholder)] transition-colors duration-300"
              />
              <button
                className="bg-[var(--accent-send-button)] hover:bg-[var(--accent-send-button-hover)] text-white px-4 py-2 rounded-full transition-colors duration-300"
                onClick={sendMessage}
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full text-[var(--text-muted)] bg-[var(--background-main)] transition-colors duration-300">
          <p className="text-2xl">
            Click on any user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
