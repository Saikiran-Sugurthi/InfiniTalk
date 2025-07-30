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
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
    <div className="bg-[#23272a] text-white rounded-xl shadow-xl p-6 w-[90%] max-w-md relative">

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
      >
        <i className="fa-solid fa-xmark" />
      </button>

      {/* Header */}
      <h2 className="text-xl font-semibold text-center mb-4">Update Group</h2>

      {/* Selected Users */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedChat.users.map((u) => (
          <UserBadgeItem
            key={u._id}
            handleFunction={() => handleRemove(u)}
            user={u}
          />
        ))}
      </div>

      {/* Rename Group */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRename();
        }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Rename group"
          className="flex-1 bg-[#2c2f33] border border-gray-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-[#5865f2]"
        />
        <button
          type="submit"
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm px-4 py-2 rounded"
        >
          Update
        </button>
      </form>

      {/* Search Users */}
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add users"
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 bg-[#2c2f33] border border-gray-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-400"
        />
      </form>

      {/* Search Results */}
      {loading ? (
        <div className="text-sm text-gray-300">Loading...</div>
      ) : (
        searchResults.slice(0, 4).map((u) => (
          <UserListItem
            key={u._id}
            user={u}
            handleFunction={() => handleGroupAdd(u)}
          />
        ))
      )}

      {/* Leave Group Button */}
      <button
        type="button"
        onClick={() => handleRemove(user)}
        className="mt-5 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded w-full"
      >
        Leave Group
      </button>
    </div>
  </div>
)}

    </div>
  );
}
