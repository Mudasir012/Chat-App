import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const { selectedUser, selectedGroup, selectedRoom } = useChatStore();
  const isChatting = !!selectedUser || (!!selectedGroup && !!selectedRoom);

  return (
    <div className="h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col overflow-hidden">
      <Navbar isCompact={isChatting} />
      <div className={`flex-1 flex overflow-hidden transition-all duration-500 ${isChatting ? "p-0" : "p-0 md:p-4 md:pt-2"}`}>
        <div className={`flex h-full w-full overflow-hidden shadow-2xl shadow-black/5 ${isChatting ? "rounded-none border-0" : "card-curvy"}`}>
          {/* Sidebar Area: Visible on desktop, hidden on mobile when actively chatting */}
          <div className={`${isChatting ? "hidden md:flex" : "flex w-full md:w-auto"} h-full`}>
            <Sidebar />
          </div>
          
          {/* Chat Container Area: Visible on desktop, full width on mobile when chatting, hidden on mobile when not chatting */}
          <div className={`${isChatting ? "flex" : "hidden md:flex"} flex-1 h-full`}>
            {!isChatting ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
