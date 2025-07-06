import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: '#fff',
  borderRadius: '8px',
  boxShadow: 24,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

export default function ProfileModal({ user, children }) {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      
      {children ? (
        React.cloneElement(children, {
          onClick: handleOpen,
          style: { cursor: 'pointer' },
        })
      ) : (
        <i
          className="fa-solid fa-eye"
          onClick={handleOpen}
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            color: 'gray',
            display: 'inline-block',
          }}
        ></i>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Avatar
            src={user.image}
            alt={user.name}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h6" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Email: {user.email}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
