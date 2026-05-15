import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Users,
  Search,
  Plus,
  UserPlus,
  Hash,
  Inbox,
  MessageSquare,
  Settings,
  Copy,
  Check,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    selectedRoom,
    setSelectedRoom,
    fetchGroups,
    createGroup,
    joinGroup,
  } = useChatStore();
  const { onlineUsers, authUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [isFetchingGroups, setIsFetchingGroups] = useState(false);

  const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/fun-emoji/svg?seed=";

  useEffect(() => {
    if (authUser) {
      getUsers();
      loadGroups();
    }
  }, [authUser]);

  const loadGroups = async () => {
    setIsFetchingGroups(true);
    try {
      await fetchGroups();
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    } finally {
      setIsFetchingGroups(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setIsCreatingGroup(true);
    try {
      await createGroup(newGroupName);
      setNewGroupName("");
      setShowCreateGroup(false);
    } catch (err) {
      // Error handled in store
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleJoinByCode = async () => {
    const code = prompt("Enter invite code:");
    if (!code) return;
    setIsJoiningGroup(true);
    try {
      await joinGroup(code);
    } catch (err) {
      // Error handled in store
    } finally {
      setIsJoiningGroup(false);
    }
  };

  const copyInviteCode = async (group) => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopiedCode(group._id);
      setTimeout(() => setCopiedCode(null), 2000);
      toast.success("Invite code copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoomIcon = (room) => {
    if (room.name.toLowerCase() === "general") return <MessageSquare className="size-4" />;
    return <Hash className="size-4" />;
  };

  if (isUsersLoading && !users.length) {
    return (
      <aside className="h-full w-20 lg:w-72 bg-[var(--secondary-bg)] border-r border-[var(--border)]" />
    );
  }

  return (
    <aside className="h-full w-20 lg:w-72 bg-[var(--secondary-bg)] border-r border-[var(--border)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-lg hidden lg:block font-display">Plavox</span>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--bg)]/50 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "inbox"
                ? "bg-[var(--accent)] text-[var(--accent-content)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Inbox className="size-4" />
            <span className="hidden lg:inline">Inbox</span>
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "groups"
                ? "bg-[var(--accent)] text-[var(--accent-content)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Users className="size-4" />
            <span className="hidden lg:inline">Groups</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "inbox" ? (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-2"
            >
              {/* Search */}
              <div className="px-3 mb-3 hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full bg-[var(--bg)]/50 border border-[var(--border)] rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Online count */}
              <div className="px-4 mb-2 hidden lg:block">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Direct Messages ·{" "}
                  <span className="text-green-500">
                    {Math.max(0, onlineUsers.length - 1)} online
                  </span>
                </span>
              </div>

              {/* User list */}
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    setActiveTab("inbox");
                  }}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[var(--accent)]/5 transition-all ${
                    selectedUser?._id === user._id && activeTab === "inbox"
                      ? "bg-[var(--accent)]/10 border-r-2 border-[var(--accent)]"
                      : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.profilePic || DEFAULT_AVATAR + user.fullName}
                      alt={user.fullName}
                      className="size-9 object-cover rounded-full border border-[var(--border)]"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border-2 border-[var(--secondary-bg)]" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{user.fullName}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {onlineUsers.includes(user._id) ? "Active now" : "Offline"}
                    </div>
                  </div>
                </button>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 px-4">
                  <Inbox className="size-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[var(--text-muted)]">No users found</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-2"
            >
              {/* Group actions */}
              <div className="px-3 mb-3 hidden lg:flex gap-2">
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="flex-1 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] py-2 rounded-lg text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="size-3.5" />
                  New
                </button>
                <button
                  onClick={handleJoinByCode}
                  disabled={isJoiningGroup}
                  className="flex-1 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] py-2 rounded-lg text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isJoiningGroup ? (
                    <span className="size-3.5 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="size-3.5" />
                  )}
                  Join
                </button>
              </div>

              {/* Group list */}
              {groups.map((group) => (
                <div key={group._id} className="mb-1">
                  <button
                    onClick={() => {
                      setSelectedGroup(group);
                      setSelectedRoom(group.rooms?.[0] || null);
                    }}
                    className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[var(--accent)]/5 transition-all ${
                      selectedGroup?._id === group._id ? "bg-[var(--accent)]/10" : ""
                    }`}
                  >
                    <div className="size-9 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[var(--accent)]">
                        {group.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{group.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {group.members?.length || 0} members
                      </div>
                    </div>
                  </button>

                  {/* Rooms */}
                  <AnimatePresence>
                    {selectedGroup?._id === group._id && group.rooms && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 pl-3 border-l border-[var(--border)]">
                          {group.rooms.map((room) => (
                            <button
                              key={room.name}
                              onClick={() => setSelectedRoom(room)}
                              className={`w-full px-3 py-1.5 flex items-center gap-2 text-xs hover:bg-[var(--accent)]/5 transition-all rounded ${
                                selectedRoom?.name === room.name
                                  ? "text-[var(--accent)] bg-[var(--accent)]/10"
                                  : "text-[var(--text-muted)]"
                              }`}
                            >
                              {getRoomIcon(room)}
                              <span className="truncate">{room.name}</span>
                            </button>
                          ))}

                          {/* Invite code */}
                          <div className="px-3 py-2 mt-1">
                            <button
                              onClick={() => copyInviteCode(group)}
                              className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                            >
                              {copiedCode === group._id ? (
                                <Check className="size-3 text-green-500" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                              Code: {group.inviteCode}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {isFetchingGroups ? (
                <div className="text-center py-12 px-4">
                  <span className="size-8 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-muted)]">Loading groups...</p>
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Users className="size-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[var(--text-muted)]">No groups yet</p>
                  <button
                    onClick={() => setShowCreateGroup(true)}
                    className="mt-3 text-xs text-[var(--accent)] font-semibold hover:underline"
                  >
                    Create your first group
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--secondary-bg)] rounded-2xl p-6 w-full max-w-sm border border-[var(--border)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Create a Group</h3>
              <input
                type="text"
                placeholder="Group name"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] mb-4"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold hover:bg-[var(--bg)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || isCreatingGroup}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-content)] text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreatingGroup ? (
                    <>
                      <span className="size-4 border-2 border-[var(--accent-content)] border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default Sidebar;
