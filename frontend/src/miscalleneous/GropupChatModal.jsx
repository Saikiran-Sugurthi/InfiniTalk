import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import { useState } from 'react';
import {ChatState} from "../context/ChatProvider"
import { useToast } from '../../components/ToastContext';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadgeItem from '../miscalleneous/UserBadgeItem'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function GroupChatModal({children}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const {showToast}=useToast();
  const [search,setSearch]=useState("");
  const [selectedUsers,setSelectedUsers]=useState([]);
  const [groupChatName,setGroupChatName]=useState();
  const [searchResults,setSearchResults]=useState([]);
  const [loading,setLoading]=useState(false);

  const {user,chats,setChats}=ChatState();

  const handleSubmit=async()=>{

    if(!groupChatName || !selectedUsers){
      showToast("Fill All The Fields !!!","error");
      return;
    }

    try{

        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }

        const {data}=await axios.post(`http://localhost:3000/api/chat/group`,{name:groupChatName,users:JSON.stringify(selectedUsers.map((u)=>u._id))},config);
        
        setChats([data,...chats]);
        handleClose();

        showToast("Group Chat Created Succesfully !!!","success");


    }
    catch(err){
      showToast(err.message,"error");
    }


  }

  const groupAdd=(userToAdd)=>{

      if(selectedUsers.includes(userToAdd)){
        showToast("User Already Exists !!!","error");
        return;
      }

      setSelectedUsers([...selectedUsers,userToAdd]);



  }

  const handleDelete=(delUser)=>{

      setSelectedUsers(selectedUsers.filter((user)=>(user._id !==delUser._id)));

  }

  const handleSearch=async (query)=>{

      setSearch(query);

      if(!query){
        return;
      }
      
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      };

      setLoading(true);


      const {data}=await axios.get(`http://localhost:3000/api/user/?search=${search}`,config);

      // console.log(data);

      setSearchResults(data);
      setLoading(false);
      

      

  }


  return (
     <div>
      <span onClick={handleOpen} className="cursor-pointer">{children}</span>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="group-chat-modal"
      >
        <Box
          className="bg-white w-[90%] max-w-md mx-auto mt-32 p-6 rounded-lg shadow-lg space-y-4 outline-none"
        >
          <Typography id="group-chat-modal" variant="h6" className="font-semibold text-gray-800">
            Create Group Chat
          </Typography>

          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Group Name"
            type="text"
            onChange={(e) => setGroupChatName(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select Users"
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
          />


          <div className='w-full flex'>
            {
            selectedUsers.map((user)=>(
              <UserBadgeItem user={user} key={user._id} handleFunction={()=>handleDelete(user)}/>
            ))
          }
          </div>
          

          {loading?<div>Loading...</div>:(
            searchResults?.slice(0,4).map((user)=>(
              <UserListItem key={user._id} user={user} handleFunction={()=>groupAdd(user)}/>
            ))
          )}

          <button onClick={()=>handleSubmit()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Create Chat
          </button>
        </Box>
      </Modal>
    </div>
  );
}
