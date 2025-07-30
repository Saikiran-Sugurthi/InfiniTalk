import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import { useDrawer } from '../context/DrawerContext';

const SideDrawer = () => {
  const { toggleDrawer } = useDrawer();

  return (
    <div className="flex justify-between items-center bg-[#2f3136] px-4 py-3 shadow-sm rounded-md border border-[#202225]">
      
      {/* Left: Search Button */}
      <Tooltip title="Search User" arrow>
        <button
          onClick={() => toggleDrawer(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#40444b] border border-[#202225] rounded-md hover:bg-[#4f545c] transition-colors duration-200"
        >
          <SearchOutlinedIcon fontSize="small" className="text-white" />
          Search
        </button>
      </Tooltip>

      {/* Center: App Name */}
      <h1 className="text-lg font-bold tracking-wide text-white">InfiniTalk</h1>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-4">
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default SideDrawer;
