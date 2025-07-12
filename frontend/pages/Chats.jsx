import SideDrawer from "../src/miscalleneous/SideDrawer";
import MyChats from "../src/miscalleneous/MyChats";
import ChatBox from "../src/miscalleneous/ChatBox";
import { ChatState } from "../src/context/ChatProvider";
import Drawer from "../src/miscalleneous/Drawer";
import { useState } from "react";

export default function Chats() {
  const { user } = ChatState();

  const [fetchAgain,setFetchAgain]=useState();

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      {user && <Drawer />}

      <div className="flex w-full h-[91vh] p-4 gap-4">
        
        {user && <div className="w-1/3"><MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /></div>}
        {user && <div className="w-2/3"><ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /></div>}
      </div>
    </div>
  );
}
