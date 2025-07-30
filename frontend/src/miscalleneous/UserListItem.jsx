import React from 'react';
import Avatar from '@mui/material/Avatar';

const UserListItem = ({ handleFunction, user }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-4 bg-[#F3F4F6] p-3 rounded-lg mb-2 hover:bg-[#BFDBFE] transition-all duration-200 cursor-pointer shadow-sm"
    >
      <Avatar
        alt={user.name}
        src={user.pic}
        sx={{ width: 40, height: 40 }}
      />

      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">{user.name}</span>
        <span className="text-xs text-gray-600">Email: {user.email}</span>
      </div>
    </div>
  );
};

export default UserListItem;
