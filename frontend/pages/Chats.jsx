import SideDrawer from "../src/miscalleneous/SideDrawer";
import MyChats from "../src/miscalleneous/MyChats";
import ChatBox from "../src/miscalleneous/ChatBox";
import { ChatState } from "../src/context/ChatProvider";
import Drawer from "../src/miscalleneous/Drawer";
import { useState } from "react";

export default function Chats() {
  const { user, selectedChat ,setSelectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      {user && <Drawer />}

      <div className="flex w-full h-screen p-4 gap-4">
        {user && (
          <>
            {/* MyChats - visible on large screens or when no chat selected on mobile */}
            <div
              className={`
                h-full overflow-hidden 
                w-full lg:w-1/3 
                ${selectedChat ? "hidden" : "block"} 
                lg:block
              `}
            >
              <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>

            {/* ChatBox - visible on large screens or if chat is selected on mobile */}
            <div
              className={`
                h-full overflow-hidden 
                w-full lg:w-2/3 
                ${selectedChat ? "block" : "hidden"} 
                lg:block
              `}
            >
               
           
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
