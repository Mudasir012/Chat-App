import { X, MoreVertical, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, blockUser } = useAuthStore();
  const { initCall } = useCallStore();

  const handleBlock = async () => {
    if (window.confirm(`Are you sure you want to block ${selectedUser.fullName}?`)) {
      await blockUser(selectedUser._id);
      setSelectedUser(null);
    }
  };

  const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=CED4DA&color=212529&name=";

  return (
    <div className="p-4 px-6 border-b border-[var(--border)] bg-[var(--bg)]/50 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="size-10 rounded-2xl overflow-hidden ring-2 ring-[var(--accent)]/10 shadow-sm">
              <img 
                src={selectedUser.profilePic || (DEFAULT_AVATAR + encodeURIComponent(selectedUser.fullName))} 
                alt={selectedUser.fullName} 
                className="object-cover size-full" 
              />
            </div>
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-[var(--bg)] rounded-full" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-bold text-sm tracking-tight">{selectedUser.fullName}</h3>
            <p className={`text-[10px] font-semibold ${onlineUsers.includes(selectedUser._id) ? "text-green-500" : "text-[var(--text-muted)]"}`}>
              {onlineUsers.includes(selectedUser._id) ? "Online now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => initCall(selectedUser, "voice")}
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--secondary-bg)] hover:text-[var(--text)] rounded-xl transition-all hidden sm:block"
          >
            <Phone className="size-4" />
          </button>
          <button 
            onClick={() => initCall(selectedUser, "video")}
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--secondary-bg)] hover:text-[var(--text)] rounded-xl transition-all hidden sm:block"
          >
            <Video className="size-4" />
          </button>
          
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="p-2 text-[var(--text-muted)] hover:bg-[var(--secondary-bg)] hover:text-[var(--text)] rounded-xl transition-all">
              <MoreVertical className="size-4" />
            </button>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 border-2 border-primary rounded-xl w-52 mt-2 font-bold uppercase text-xs">
              <li><button onClick={handleBlock} className="text-red-600">Block User</button></li>
              <li><button>Report User</button></li>
              <li><button>Clear Chat</button></li>
            </ul>
          </div>

          <div className="w-px h-6 bg-[var(--border)] mx-1" />
          <button 
            onClick={() => setSelectedUser(null)}
            className="p-2 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-xl transition-all"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
