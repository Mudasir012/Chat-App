import { X, MoreVertical, Phone, Video } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat } = useChatStore();
  const { onlineUsers, blockUser, reportUser } = useAuthStore();
  const { initCall } = useCallStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBlock = async () => {
    if (window.confirm(`Are you sure you want to block ${selectedUser.fullName}?`)) {
      await blockUser(selectedUser._id);
      setSelectedUser(null);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm("Are you sure you want to clear this chat? This action cannot be undone.")) {
      await clearChat(selectedUser._id);
    }
  };

  const handleReportUser = async () => {
    const reason = window.prompt(`Please provide a reason for reporting ${selectedUser.fullName}:`);
    if (reason) {
      await reportUser(selectedUser._id, reason);
    }
  };

  const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/fun-emoji/svg?seed=";

  return (
    <div className="py-1.5 px-6 border-b border-[var(--border)] bg-[var(--bg)]/50 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="size-8 rounded-xl overflow-hidden ring-2 ring-[var(--accent)]/10 shadow-sm">
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
            <h3 className="font-bold text-xs tracking-tight">{selectedUser.fullName}</h3>
            <p className={`text-[9px] font-semibold ${onlineUsers.includes(selectedUser._id) ? "text-green-500" : "text-[var(--text-muted)]"}`}>
              {onlineUsers.includes(selectedUser._id) ? "Online now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-all ${isMenuOpen ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-muted)] hover:bg-[var(--secondary-bg)] hover:text-[var(--text)]"}`}
            >
              <MoreVertical className="size-4" />
            </button>
            
            {isMenuOpen && (
              <ul className="absolute right-0 top-full z-[50] menu p-1.5 shadow-2xl bg-[var(--surface)] border border-[var(--border)] rounded-xl w-44 mt-2 font-bold uppercase text-[10px] tracking-widest animate-in fade-in zoom-in duration-200">
                <li>
                  <button 
                    onClick={() => { initCall(selectedUser, "voice"); setIsMenuOpen(false); }} 
                    className="hover:bg-[var(--secondary-bg)] py-2 flex items-center gap-2"
                  >
                    <Phone className="size-3.5" />
                    Voice Call
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { initCall(selectedUser, "video"); setIsMenuOpen(false); }} 
                    className="hover:bg-[var(--secondary-bg)] py-2 flex items-center gap-2"
                  >
                    <Video className="size-3.5" />
                    Video Call
                  </button>
                </li>
                <div className="h-px bg-[var(--border)] my-1 mx-2" />
                <li>
                  <button 
                    onClick={() => { handleReportUser(); setIsMenuOpen(false); }} 
                    className="hover:bg-[var(--secondary-bg)] py-2"
                  >
                    Report User
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { handleClearChat(); setIsMenuOpen(false); }} 
                    className="hover:bg-[var(--secondary-bg)] py-2"
                  >
                    Clear Chat
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { handleBlock(); setIsMenuOpen(false); }} 
                    className="text-red-500 hover:bg-red-500/10 py-2 flex items-center gap-2"
                  >
                    Block User
                  </button>
                </li>
              </ul>
            )}
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
