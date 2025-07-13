import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import { getAppBarUtilityClass } from '@mui/material/AppBar';
import Chats from '../../pages/Chats';
import { useToast } from '../../components/ToastContext';
import axios from 'axios';
import { shouldSkipGeneratingVar } from '@mui/material/styles';
import UserListItem from './UserListItem';

export default function GroupUpdateModal({fetchAgain,setFetchAgain}) {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [search,setSearch]=useState('');
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [searchResults,setSearchResults]=useState([]);

  const {user, selectedChat,setSelectedChat} = ChatState();

    const {showToast}=useToast();

  const handleOpen = () => {setOpen(true)
    setGroupName(selectedChat.chatName);
  };
  const handleClose = () => setOpen(false);

  const handleRemove = async(user1) => {

    if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
        showToast("Only Admins Can Remove Users !!!","error");
        return;
    }


    try {
    setLoading(true);
    const config={
        headers:{
            Authorization:`Bearer ${user.token}`
        }
    }

    const {data}=await axios.put("http://localhost:3000/api/chat/groupremove",{
        chatId:selectedChat._id,
        userId:user1._id
    },config)


    user1._id === user._id?setSelectedChat():setSelectedChat(data);

    setFetchAgain(!fetchAgain);
    setLoading(false);





    } catch (error) {
        setLoading(false)
        showToast(error.message,"error");

    }





    
  };

  const handleSearch=async (query)=>{

        if(!query){
            return
        }

        setSearch(query)

        try {

              const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        };


            setLoading(true)
            const {data}=await axios.get(`http://localhost:3000/api/user/?search=${search}`,config);
            console.log(data);
            setSearchResults(data);
            setLoading(false);
 
        } catch (error) {
            console.log(error);
            setLoading(false);
            showToast(error.message,"error");
        }

  }

  const handleGroupAdd=async (user1)=>{

        if(selectedChat.users.find((u)=>u._id===user1._id)){
            showToast("User Already Exists in the Group !!!","error");
            return;
        }

       if(selectedChat.groupAdmin._id!==user._id){
        showToast("Only Admin Can Add Users !!!","error");
        return;
       }

       try {
        setLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        };

        const {data}= await axios.put("http://localhost:3000/api/chat/groupadd",{
            chatId:selectedChat._id,
            userId:user1._id
        },config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
        showToast("Member Added Successfully !!!","success");

       } catch (error) {
        setLoading(false)
        showToast(error.message,"error");
       }


  }



  const handleRename = async () => {
    
    if(!groupName) return;

    try {
        setRenameLoading(true);

        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }

        const {data}=await axios.put("http://localhost:3000/api/chat/rename",{
            chatId:selectedChat._id,
            chatName:groupName,
        },config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
        

        showToast("Rename Successfull !!!","success");

        


        
    } catch (error) {
        setRenameLoading(false);
        showToast(error.message,"error")

    }


  }

       

  return (
    <div>
      
      <i
        className="fa-solid fa-eye text-[20px] text-gray-400 hover:text-gray-600 cursor-pointer"
        onClick={handleOpen}
      />

      
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-100/50">
          <div className="bg-white rounded-md shadow-md p-4 w-[90%] max-w-sm relative">

            
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-xmark" />
            </button>

           
            <h2 className="text-lg font-medium text-center mb-3">Update Group</h2>

            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  handleFunction={() => handleRemove(u)}
                  user={u}
                />
              ))}
            </div>

          
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRename();
              }}
              className="flex gap-2 mb-3"
            >
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Rename group"
                className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </form>

           
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add users"
                onChange={(e)=>handleSearch(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-green-200"
              />
              {/* <button
                type="submit"
                
                className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
              >
                Add
              </button> */}
            </form>

            {loading?(<div className='text-xs'>Loading...</div>):searchResults.slice(0,4).map((u)=>(
                <UserListItem key={u._id} user={u} handleFunction={()=>handleGroupAdd(u)} />
            ))}
                <button
                type="submit" onClick={()=>handleRemove(user)}
                
                className="mt-4 bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
              >
                Leave Group
              </button>
            

          </div>
        </div>
      )}
    </div>
  );
}
