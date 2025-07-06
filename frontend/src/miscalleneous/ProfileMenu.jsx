import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ChatState } from '../context/ChatProvider';
import Avatar from '@mui/material/Avatar';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
export default function ProfileMenu() {
const {user}=ChatState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate=useNavigate();

  ///LOGOUT HANDLER ⭐⭐⭐⭐
  const logOutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
         <Avatar alt={user.name} src={user.image} />
         <i className="fa-solid fa-chevron-down"></i>
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
        <ProfileModal user={user} >
        <MenuItem >My Profile</MenuItem>
        </ProfileModal>
        <MenuItem onClick={logOutHandler}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
