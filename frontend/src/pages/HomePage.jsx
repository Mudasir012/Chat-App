import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col overflow-hidden">
      <Navbar isCompact={!!selectedUser} />
      <div className={`flex-1 flex overflow-hidden transition-all duration-500 ${selectedUser ? "p-0" : "p-0 md:p-4 md:pt-2"}`}>
        <div className={`flex h-full w-full overflow-hidden shadow-2xl shadow-indigo-500/5 ${selectedUser ? "rounded-none border-0" : "card-curvy"}`}>
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
