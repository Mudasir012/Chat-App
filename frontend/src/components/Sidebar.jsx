import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Search, Plus, UserPlus, Hash } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=a78bfa&color=fff&name=";

  if (isUsersLoading) return <div className="h-full w-20 lg:w-80 bg-[var(--secondary-bg)] border-r border-[var(--border)]" />;

  return (
    <aside className="h-full w-20 lg:w-80 flex flex-col bg-[var(--secondary-bg)]/50 backdrop-blur-xl border-r border-[var(--border)] transition-all duration-300">
      <div className="p-6 border-b border-[var(--border)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[var(--accent)]/10 rounded-xl text-[var(--accent)]">
              <Users className="size-5" />
            </div>
            <span className="font-bold tracking-tight hidden lg:block">Messages</span>
          </div>
          <span className="text-[10px] font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-full hidden lg:block">
            {onlineUsers.length - 1} online
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all group" title="New Group">
            <Plus className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Group</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-pink-500/5 border border-pink-500/10 text-pink-500 hover:bg-pink-500/10 transition-all group" title="New Community">
            <Hash className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Community</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-green-500/5 border border-green-500/10 text-green-500 hover:bg-green-500/10 transition-all group" title="Add Contact">
            <UserPlus className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Contact</span>
          </button>
        </div>
        
        {/* Search Mockup & Filter */}
        <div className="hidden lg:block space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 group">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="size-4 rounded-lg border-2 border-[var(--border)] bg-transparent checked:bg-[var(--accent)] transition-all cursor-pointer accent-[var(--accent)]"
              />
              <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">Online only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3 rounded-2xl transition-all duration-200
              ${selectedUser?._id === user._id 
                ? "bg-white dark:bg-slate-800 shadow-md shadow-indigo-500/5 ring-1 ring-[var(--accent)]/10" 
                : "hover:bg-white/50 dark:hover:bg-slate-800/50"}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || (DEFAULT_AVATAR + encodeURIComponent(user.fullName))}
                alt={user.fullName}
                className="size-12 rounded-2xl object-cover ring-2 ring-transparent transition-all"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-500 
                  border-[3px] border-white dark:border-slate-900 rounded-full shadow-sm"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-semibold truncate text-sm">{user.fullName}</div>
              <div className={`text-[10px] font-medium ${onlineUsers.includes(user._id) ? "text-green-500" : "text-[var(--text-muted)]"}`}>
                {onlineUsers.includes(user._id) ? "Active now" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-[var(--text-muted)] py-20 text-sm italic">
            No contacts found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
