import React, { useState } from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useDrawer } from '../context/DrawerContext';
import { useToast } from '../../components/ToastContext';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import axios from 'axios';
import UserListItem from './UserListItem';

export default function Drawer() {
  const { open, toggleDrawer } = useDrawer();
  const { user, chats, setChats, setSelectedChat } = ChatState();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      toggleDrawer(false);
      setLoadingChat(false);
    } catch (err) {
      showToast("Error Fetching The Chat", "warning");
    }
  };

  const handleSearch = async () => {
    if (!search) {
      showToast("Enter something to search", "warning");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/?search=${search}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const DrawerList = (
    <Box
      sx={{ width: 300 }}
      className="bg-[var(--background-modal-input)] h-full text-[var(--text-primary)] flex flex-col"
      role="presentation"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={search}
            placeholder="Search by name or email"
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-3 py-2 bg-[var(--background-chat-list)] text-[var(--text-primary)] border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus-ring)]"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[var(--accent-send-button)] hover:bg-[var(--accent-send-button-hover)] rounded-md text-sm font-semibold"
          >
            Go
          </button>
        </div>

        <Divider className="bg-gray-600 mb-4" />

        <div className="overflow-y-auto max-h-[calc(100vh-150px)] pr-2 custom-scrollbar">
          {loading ? (
            <ChatLoading />
          ) : (
            searchResults.map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
            ))
          )}
        </div>
      </div>
    </Box>
  );

  return (
    <MuiDrawer open={open} onClose={() => toggleDrawer(false)}>
      {DrawerList}
    </MuiDrawer>
  );
}
