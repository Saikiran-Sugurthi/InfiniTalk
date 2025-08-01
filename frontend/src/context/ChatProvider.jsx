import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export default function ChatProvider({ children }) {  

  const [user, setUser] = useState();
  const [selectedChat,setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
  const [notifications,setNotifications]=useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notifications,setNotifications }}>
      {children} 
    </ChatContext.Provider>
  );
}

export const ChatState = () => {
  return useContext(ChatContext);
};
