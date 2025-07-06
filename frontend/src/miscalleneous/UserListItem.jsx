import React from 'react';
import Avatar from '@mui/material/Avatar';

const UserListItem = ({ handleFunction, user }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-3 bg-gray-200 p-3 mb-2 rounded-md hover:bg-blue-300 cursor-pointer transition"
    >
      <Avatar
        alt={user.name}
        src={user.image}
        className="w-10 h-10"
      />

      <div className="flex flex-col">
        <span className="font-medium text-sm text-gray-800">{user.name}</span>
        <span className="text-xs text-gray-600">E-mail: {user.email}</span>
      </div>
    </div>
  );
};

export default UserListItem;
