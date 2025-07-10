import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <div
  onClick={handleFunction}
  className="px-2 py-1 m-1 mb-2 text-xs bg-purple-600 text-white rounded-lg cursor-pointer flex items-center gap-1"
>
  {user.name}
  
    <i className="fa-solid fa-xmark text-white text-sm"></i>
 
</div>

  )
}

export default UserBadgeItem
