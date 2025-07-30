import React from 'react'
import { ChatState } from '../context/ChatProvider'
import SingleChat from '../../components/SingleChat';
const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const {selectedChat}=ChatState();

  return (
    <div  className={`${
    selectedChat ? 'flex' : 'hidden'
  } md:flex items-center flex-col p-3 bg-[#1E1F22] w-full h-full  rounded-lg border border-gray-300`}>
      
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default ChatBox
