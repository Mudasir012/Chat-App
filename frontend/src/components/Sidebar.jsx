import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Search, Plus, UserPlus, Hash } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, searchUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    // Debounce search
    const timeoutId = setTimeout(async () => {
      const results = await searchUsers(query);
      setSearchResults(results);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const displayUsers = searchResults || users;

  const filteredUsers = showOnlineOnly
    ? displayUsers.filter((user) => onlineUsers.includes(user._id))
    : displayUsers;

  const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/fun-emoji/svg?seed=";

  if (isUsersLoading) return <div className="h-full w-20 lg:w-80 bg-[var(--secondary-bg)] border-r border-[var(--border)]" />;

  return (
    <aside className="h-full w-20 lg:w-80 flex flex-col glass border-r border-[var(--border)] transition-all duration-300 relative z-20">
      <div className="p-6 border-b border-[var(--border)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[1rem] bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
              <Users className="size-5" />
            </div>
            <span className="font-bold tracking-tight hidden lg:block font-display text-lg">Messages</span>
          </div>
          <span className="text-[10px] font-bold bg-[var(--accent)] text-[var(--accent-content)] px-2.5 py-1 rounded-full hidden lg:block uppercase tracking-wider">
            {onlineUsers.length - 1} online
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-[var(--bg)]/50 border border-[var(--border)] rounded-[var(--radius)] py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all font-medium"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 hidden lg:flex">
          <button className="flex-1 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] p-2.5 rounded-[1rem] transition-all group flex items-center justify-center gap-2">
            <Plus className="size-4 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
            <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text)] uppercase tracking-wider">Group</span>
          </button>
          <button className="flex-1 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] p-2.5 rounded-[1rem] transition-all group flex items-center justify-center gap-2">
            <Hash className="size-4 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
            <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text)] uppercase tracking-wider">Room</span>
          </button>
          <button className="size-10 bg-[var(--accent)] text-[var(--accent-content)] rounded-[1rem] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-black/10">
            <UserPlus className="size-4" />
          </button>
        </div>

        {/* Online Filter Toggle */}
        <div className="hidden lg:flex items-center justify-between px-1">
          <label className="cursor-pointer flex items-center gap-3 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[var(--surface)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
            </div>
            <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors uppercase tracking-wider">Online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-4 scrollbar-hide">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-4 flex items-center gap-4
              hover:bg-[var(--accent)]/5 transition-all relative group
              ${selectedUser?._id === user._id ? "bg-[var(--accent)]/10 border-r-4 border-[var(--accent)]" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || DEFAULT_AVATAR + user.fullName}
                alt={user.name}
                className="size-12 object-cover rounded-[1rem] border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors shadow-sm"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-500 
                  rounded-full border-2 border-[var(--bg)] ring-2 ring-green-500/20"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-bold text-sm truncate tracking-tight">{user.fullName}</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate font-bold uppercase tracking-wider">
                {onlineUsers.includes(user._id) ? "Active now" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 px-4">
            <div className="size-16 bg-[var(--surface)] rounded-[var(--radius)] flex items-center justify-center mx-auto mb-4 opacity-50">
              <Users className="size-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">No users found</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
