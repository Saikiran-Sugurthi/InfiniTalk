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

const ENDPOINT = "http://localhost:3000";
let socket, selectedChatCompare;

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

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 1000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/message/${selectedChat._id}`,
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
    fetchMessages();
    setNotifications(() =>
      notifications.filter((n) => n.chat._id !== selectedChat._id)
    );
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications((prev) => [newMessageRecieved, ...prev]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });
  }, []);

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
          "http://localhost:3000/api/message/",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (error) {
        showToast(error.message, "error");
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full w-full bg-[#2C2F33] text-white rounded-lg shadow-inner">
          {/* Chat Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#4F545C] bg-[#23272A]">
            <div className="text-lg font-semibold tracking-wide flex justify-center items-center gap-2">
              {!selectedChat.isGroupChat ? (
                <>
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="  md:hidden z-10  text-white  py-1 rounded"
                  >
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>

                  <Avatar src={getSenderFull(user, selectedChat.users)?.pic} />
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                                  <button
                    onClick={() => setSelectedChat(null)}
                    className="  md:hidden z-10  text-white  py-1 rounded"
                  >
                    <i class="fa-solid fa-arrow-left"></i>
                  </button>
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
          <div className="flex-1 p-4 overflow-y-auto bg-[#2C2F33]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress size={50} sx={{ color: "#7289DA" }} />
              </div>
            ) : (
              <>
                <ScrollableChat messages={messages} isTyping={isTyping} />
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-2 bg-[#23272A] border-t border-[#4F545C]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                onKeyDown={sendMessage}
                value={newMessage}
                onChange={typingHandler}
                className="flex-1 px-4 py-2 text-sm rounded-full bg-[#40444B] text-white border border-[#4F545C] focus:outline-none focus:ring-2 focus:ring-[#7289DA]"
              />
              <button
                className="bg-[#7289DA] hover:bg-[#5b6eae] text-white px-4 py-2 rounded-full transition"
                onClick={sendMessage}
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full text-white bg-[#2C2F33]">
          <p className="text-2xl opacity-60">
            Click on any user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
