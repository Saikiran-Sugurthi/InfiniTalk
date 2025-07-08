import React, { useState } from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useDrawer } from '../context/DrawerContext'; // adjust path
import { useToast } from '../../components/ToastContext';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import { spacing } from '@mui/system';
import axios from 'axios';

import UserListItem from './UserListItem';

export default function Drawer() {
  const { open, toggleDrawer } = useDrawer();
    const {user,chats,setChats,setSelectedChat,setChat}=ChatState();
  const {showToast}=useToast();
    const [search,setSearch]=useState("");
    const [loading,setLoading]=useState(false);
    const [searchResults,setSearchResults]=useState([]);
    const [loadingChat,setLoadingChat]=useState([]);

    const accessChat=async ({userId})=>{

        try{
            setLoadingChat(true);


            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }


            const {data}=await axios.post("http://localhost:3000/api/chat",{userId},config);

            if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);


            setSelectedChat(data);
            setLoadingChat(false);

        }
        catch(err){
                showToast("Error Fetching The Chat","warning");
        }



    }


   

    const handleSearch=async()=>{
        if(!search){
            showToast("Enter Something to search","warning");
        }
        else{

            try{
                 setLoading(true);

            const config={
                headers :{
                    Authorization:`Bearer ${user.token}`
                },
            }
            console.log("User from context:", user);
console.log("Token being sent:", user?.token);


            const {data}=await axios.get(`http://localhost:3000/api/user/?search=${search}`,config);
            console.log(data);
            setLoading(false);
            setSearchResults(data)
            }catch(err){
                showToast(err.message,"error");
            }
           

        }
    }


  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      
    >
      {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}

      <List>
        <ListItem style={{gap:"5px"}}>
            <input type='text'  style={{
            width: '90%%',
            padding: '8px',
            fontSize: '14px',
            borderRadius: '4px',
            color:"black",
            border: '1px solid #ccc',
          }} value={search} placeholder='Search by name or Email' onChange={(e)=>setSearch(e.target.value)} >
            
            </input>
            <button onClick={handleSearch} style={{
    padding: '8px 16px',
    backgroundColor: '#1976d2',      
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  }}>Go</button>
        </ListItem>
      </List>
      <Divider />
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}

        {
            loading?<ChatLoading/>:(
                searchResults.map((user)=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
                ))
            )
        }

    </Box>
  );

  return (
    <MuiDrawer open={open} onClose={() => toggleDrawer(false)}>
      {DrawerList}
    </MuiDrawer>
  );
}
