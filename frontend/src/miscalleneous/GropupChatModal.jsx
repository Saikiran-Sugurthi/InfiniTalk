import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ChatState } from "../context/ChatProvider";
import { useToast } from '../../components/ToastContext';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadgeItem from '../miscalleneous/UserBadgeItem';
import { io } from "socket.io-client";
import { useEffect } from 'react';
const ENDPOINT = import.meta.env.VITE_API_URL;
var socket;




export default function GroupChatModal({ children }) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setSelectedUsers([]);
    setSearchResults([]);
    setGroupChatName("");
  };

   useEffect(() => {
    // This logic is better placed in a higher-level component like ChatPage
    // to establish a single, persistent connection.
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    
    // Note: The lines for 'setSocketConnected' and 'setIsTyping' from your
    // original code will cause errors here because those states are not defined
    // in this component. This logic likely belongs in your main chat window.

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const groupReceivedHandler = (newChatReceived) => {
      // This function runs when another user adds you to a group.
      // It adds the new group chat to your state.
      setChats((prevChats) => [newChatReceived, ...prevChats]);
    };

    // Set up the listener
    socket.on("group received", groupReceivedHandler);

    // Cleanup: remove the listener when the component unmounts
    return () => {
      socket.off("group received", groupReceivedHandler);
    };
  }, [socket, setChats]);


 const handleSubmit = async () => {
  if (!groupChatName || !selectedUsers.length) {
    showToast("Please provide a group name and add users!", "error");
    return;
  }
  
  // FIX: Add a check for the minimum number of users
  if (selectedUsers.length < 2) {
    showToast("A group must have at least 2 other members.", "error");
    return;
  }

  
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/chat/group`,
      {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      },
      config
    );

    setChats([data, ...chats]);
    //sends signal so that the grp appears in chats immediately
        if (socket) {
      socket.emit("new group", data);
    }

    handleClose();
    showToast("Group Chat Created Successfully!", "success");
  } catch (err) {
    // Now this will catch the 400 error from the backend correctly
    showToast(err.response?.data?.message || "Failed to create group chat", "error");
  }
};

  const groupAdd = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      showToast("User Already Exists !!!", "error");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/?search=${query}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      showToast("Failed to Load Search Results", "error");
      setLoading(false);
    }
  };

  return (
    <div>
      <span onClick={handleOpen} className="cursor-pointer">
        {children}
      </span>

      <Modal open={open} onClose={handleClose} aria-labelledby="group-chat-modal">
        <Box className="bg-[var(--background-modal)] text-[var(--text-primary)] w-[90%] max-w-md mx-auto mt-24 p-6 rounded-lg shadow-lg space-y-4 outline-none border border-[var(--border-color)]">
          <Typography id="group-chat-modal" variant="h6" className="font-semibold text-white text-lg">
            Create Group Chat
          </Typography>

          <input
            className="w-full px-4 py-2 bg-[var(--background-modal-input)] border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-placeholder)]  focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Group Name"
            type="text"
            onChange={(e) => setGroupChatName(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 bg-[var(--background-modal-input)] border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-placeholder)]  focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select Users"
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Selected Users */}
          <div className="w-full flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
            ))}
          </div>

          {/* Search Results */}
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              searchResults?.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => groupAdd(user)} />
              ))
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[var(--accent-send-button)] hover:bg-[var(--accent-send-button-hover)] text-white font-medium py-2 rounded-md transition duration-200"
          >
            Create Chat
          </button>
        </Box>
      </Modal>
    </div>
  );
}
