import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import Badge from '@mui/material/Badge';

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const {user,notifications,setNotifications,selectedChat,setSelectedChat}=ChatState();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
       
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={notifications.length} color="primary">
       <i className="fa-solid fa-bell" style={{ fontSize: "22px", color: "grey" }}></i>
    </Badge>
      </Button>
   
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >


        <MenuItem onClick={handleClose}>{!notifications.length && "No New Messages"}</MenuItem>

        {notifications.map((notif)=>(
          <MenuItem onClick={()=>{
            setSelectedChat(notif.chat)
            setNotifications(notifications.filter((n)=>n._id!==notif._id))
            
            }} key={notif._id}>{notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}</MenuItem>))}

        
      </Menu>
    </div>
  );
}
