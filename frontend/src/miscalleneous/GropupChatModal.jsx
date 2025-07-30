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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      showToast("Fill All The Fields !!!", "error");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(
        `http://localhost:3000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map(u => u._id))
        },
        config
      );

      setChats([data, ...chats]);
      handleClose();
      showToast("Group Chat Created Successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
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
      const { data } = await axios.get(`http://localhost:3000/api/user/?search=${query}`, config);
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
        <Box className="bg-[#313338] text-white w-[90%] max-w-md mx-auto mt-24 p-6 rounded-lg shadow-lg space-y-4 outline-none border border-gray-700">
          <Typography id="group-chat-modal" variant="h6" className="font-semibold text-white text-lg">
            Create Group Chat
          </Typography>

          <input
            className="w-full px-4 py-2 bg-[#2B2D31] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Group Name"
            type="text"
            onChange={(e) => setGroupChatName(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 bg-[#2B2D31] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Create Chat
          </button>
        </Box>
      </Modal>
    </div>
  );
}
