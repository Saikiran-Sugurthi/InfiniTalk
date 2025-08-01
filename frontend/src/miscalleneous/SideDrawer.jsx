import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import { useDrawer } from '../context/DrawerContext';
import ThemeSwitcher from './ThemeSwitcher'; // 1. Import the new component

const SideDrawer = () => {
  const { toggleDrawer } = useDrawer();

  return (
    // Use CSS variables for theming
    <div className="flex justify-between items-center bg-[var(--background-header)] px-4 py-3 shadow-sm rounded-md border border-[var(--border-color)] transition-colors duration-300">
      
      {/* Left: Search Button */}
      <Tooltip title="Search User" arrow>
        <button
          onClick={() => toggleDrawer(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] bg-[var(--background-input)] border border-[var(--border-color)] rounded-md hover:bg-[var(--accent-hover)] transition-colors duration-200"
        >
          <SearchOutlinedIcon fontSize="small" className="text-[var(--text-primary)]" />
          Search
        </button>
      </Tooltip>

      {/* Center: App Name */}
      <h1 className="text-lg font-bold tracking-wide text-[var(--text-primary)]">InfiniTalk</h1>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher /> {/* 2. Add the ThemeSwitcher here */}
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default SideDrawer;
