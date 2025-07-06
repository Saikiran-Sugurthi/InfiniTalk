import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import { useDrawer } from '../context/DrawerContext';

const SideDrawer = () => {
  const { toggleDrawer } = useDrawer();

  return (
    <div className="flex justify-between items-center bg-gray-100 px-4 py-2 shadow-sm rounded-md">
      
   <Tooltip title="Search User">
  <button
    onClick={() => toggleDrawer(true)}
    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-800 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors duration-200"
  >
    <SearchOutlinedIcon fontSize="small" />
    Search User
  </button>
</Tooltip>


      {/* Center: App Name */}
      <h1 className="text-lg font-bold tracking-wide text-gray-800">InfiniTalk</h1>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-3">
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default SideDrawer;
