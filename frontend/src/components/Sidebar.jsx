import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users } from "lucide-react";

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

  if (isUsersLoading) return <div className="h-full w-20 lg:w-72 border-r-2 border-[var(--border)] bg-[var(--bg)]" />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r-2 border-[var(--border)] flex flex-col transition-all duration-200 bg-[var(--bg)]">
      <div className="border-b-2 border-[var(--border)] w-full p-4 bg-[var(--bg)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-[var(--accent)]" />
            <span className="font-black uppercase tracking-tighter hidden lg:block text-sm">Active Contacts</span>
          </div>
          <span className="text-[10px] font-black bg-[var(--text)] text-[var(--bg)] px-1.5 py-0.5 hidden lg:block">
            {onlineUsers.length - 1} ONLINE
          </span>
        </div>
        
        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs border-2 border-[var(--border)] rounded-none checked:bg-[var(--accent)]"
            />
            <span className="text-[10px] uppercase font-bold opacity-50 group-hover:opacity-100 transition-opacity">Show online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-[var(--text)] hover:text-[var(--bg)] transition-all
              ${selectedUser?._id === user._id ? "bg-[var(--text)] text-[var(--bg)] shadow-[4px_0px_0px_0px_var(--accent)_inset]" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover border-2 border-current"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  border-2 border-[var(--bg)] rounded-full"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-black truncate uppercase tracking-tighter text-sm">{user.fullName}</div>
              <div className="text-[10px] font-bold opacity-60 uppercase">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-[var(--text)] opacity-50 py-10 uppercase font-black text-xs">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
