import React from 'react'
import { ChatState } from '../src/context/ChatProvider'
import { getSender,getSenderFull } from '../src/config/ChatLogics';
import ProfileModal from '../src/miscalleneous/ProfileModal';
import GroupUpdateModal from '../src/miscalleneous/GroupUpdateModal'
const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const {user,selectedChat,setSelectedChat}=ChatState();

  return (
  <>
  
  {selectedChat?(<>
        <div className='flex justify-center gap-85 items-center pb-3 px-2 w-full text-[30px]'>

            <i className="fa-solid fa-arrow-left"></i>

           {!selectedChat.isGroupChat ? (<>
                <>{
                    getSender(user,selectedChat.users)
                   
                }
                 <ProfileModal user={getSenderFull(user,selectedChat.users)} />
                
                </>
           
           </>) : (<>
           
                {selectedChat.chatName.toUpperCase()}
                <GroupUpdateModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
           </>)}

        </div>

        <div className='flex flex-col flex-end p-3  bg-[#E8E8E8] w-full h-[calc(100%-60px)] rounded-lg overflow-y-auto'>

        </div>


  </>):(
    <div className='flex justify-center items-center h-full w-full'>


        <p className='text-3xl pb-3'>
            Click on Any user to start chatting 
        </p>

    </div>
  )}
  
  </>
  )
}

export default SingleChat
