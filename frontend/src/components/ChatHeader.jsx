import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b-2 border-[var(--border)] bg-[var(--bg)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="size-10 border-2 border-[var(--border)] overflow-hidden">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="object-cover size-full" />
          </div>

          {/* User info */}
          <div>
            <h3 className="font-black uppercase tracking-tighter text-sm">{selectedUser.fullName}</h3>
            <p className="text-[10px] font-bold uppercase opacity-50">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-1 hover:bg-[var(--text)] hover:text-[var(--bg)] border-2 border-transparent hover:border-[var(--border)] transition-all"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
