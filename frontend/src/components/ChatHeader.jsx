import { X, ArrowLeft, MoreVertical, Phone, Video, Hash, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import { useNavigate } from "react-router-dom";
import UserProfilePopup from "./UserProfilePopup";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat, selectedGroup, selectedRoom, setSelectedGroup, setSelectedRoom } = useChatStore();
  const { onlineUsers, blockUser, reportUser } = useAuthStore();
  const { initCall } = useCallStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePopupUserId, setProfilePopupUserId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const isGroupChat = !!selectedGroup && !!selectedRoom;

  const handleBack = () => {
    if (isGroupChat) {
      setSelectedGroup(null);
      setSelectedRoom(null);
    } else {
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && (selectedUser || (selectedGroup && selectedRoom))) {
        handleBack();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUser, selectedGroup, selectedRoom]);

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

  if (!selectedUser && !isGroupChat) return null;

  if (isGroupChat) {
    return (
      <div className="py-1.5 px-3 md:px-6 border-b border-[var(--border)] bg-[var(--bg)]/30 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={handleBack}
              className="md:hidden p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-lg transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="size-8 rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--secondary-accent)]/10 flex items-center justify-center ring-2 ring-[var(--accent)]/10 flex-shrink-0">
              <Hash className="size-4 text-[var(--accent)]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs tracking-tight truncate">
                {selectedGroup.name} / {selectedRoom.name}
              </h3>
              <p className="text-[9px] font-semibold text-[var(--text-muted)]">
                {selectedRoom.topic || `${selectedGroup.members?.length || 0} members`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-px h-6 bg-[var(--border)] mx-1" />
            <button
              onClick={handleBack}
              className="hidden md:block p-2 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-1.5 px-3 md:px-6 border-b border-[var(--border)] bg-[var(--bg)]/30 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button
            onClick={handleBack}
            className="md:hidden p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-lg transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button onClick={() => setProfilePopupUserId(selectedUser._id)} className="flex items-center gap-2 md:gap-4 min-w-0 text-left">
            <div className="relative flex-shrink-0">
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

            <div className="min-w-0">
              <h3 className="font-bold text-xs tracking-tight truncate">{selectedUser.fullName}</h3>
              <p className={`text-[9px] font-semibold ${onlineUsers.includes(selectedUser._id) ? "text-green-500" : "text-[var(--text-muted)]"}`}>
                {onlineUsers.includes(selectedUser._id) ? "Online now" : "Offline"}
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => initCall(selectedUser, "voice")}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--green)] hover:bg-[var(--green-bg)] rounded-xl transition-all active:scale-90"
            title="Voice Call"
          >
            <Phone className="size-4" />
          </button>
          <button
            onClick={() => initCall(selectedUser, "video")}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-xl transition-all active:scale-90"
            title="Video Call"
          >
            <Video className="size-4" />
          </button>

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
                    onClick={() => { handleReportUser(); setIsMenuOpen(false); }}
                    className="hover:bg-[var(--secondary-bg)] py-2 flex items-center gap-2"
                  >
                    Report User
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleClearChat(); setIsMenuOpen(false); }}
                    className="hover:bg-[var(--secondary-bg)] py-2 flex items-center gap-2"
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

          <button
            onClick={handleBack}
            className="hidden md:block p-2 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <UserProfilePopup userId={profilePopupUserId} onClose={() => setProfilePopupUserId(null)} />
    </div>
  );
};

export default ChatHeader;
