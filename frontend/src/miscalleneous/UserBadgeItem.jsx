import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="px-3 py-1.5 m-1 mb-2 text-sm bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full cursor-pointer flex items-center gap-2 transition duration-200 shadow-md"
    >
      <span className="font-medium">{user.name}</span>
      <i className="fa-solid fa-xmark text-white text-xs hover:scale-110 transition-transform duration-150"></i>
    </div>
  );
};

export default UserBadgeItem;
