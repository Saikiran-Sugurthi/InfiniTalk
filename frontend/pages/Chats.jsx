import SideDrawer from "../src/miscalleneous/SideDrawer";
import MyChats from "../src/miscalleneous/MyChats";
import ChatBox from "../src/miscalleneous/ChatBox";
import { ChatState } from "../src/context/ChatProvider";
import Drawer from "../src/miscalleneous/Drawer";

export default function Chats() {
  const { user } = ChatState();

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      {user && <Drawer />}

      <div className="flex w-full h-[91vh] p-4 gap-4">
        
        {user && <div className="w-1/2"><MyChats /></div>}
        {user && <div className="w-1/2"><ChatBox /></div>}
      </div>
    </div>
  );
}
