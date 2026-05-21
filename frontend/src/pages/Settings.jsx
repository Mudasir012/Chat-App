import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Trash2,
  Palette,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  UserX,
  Check,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const TABS = [
  { id: "appearance", label: "Appearance", icon: <Palette className="size-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="size-4" /> },
  { id: "privacy", label: "Privacy", icon: <Shield className="size-4" /> },
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, getBlockedUsers, unblockUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("appearance");
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);

  // Notification preferences (persisted in localStorage)
  const [notifPrefs, setNotifPrefs] = useState(() => {
    const saved = localStorage.getItem("plavox-notif-prefs");
    return saved ? JSON.parse(saved) : {
      messageNotifications: true,
      callNotifications: true,
      soundEnabled: true,
    };
  });

  // Privacy preferences
  const [privacyPrefs, setPrivacyPrefs] = useState(() => {
    const saved = localStorage.getItem("plavox-privacy-prefs");
    return saved ? JSON.parse(saved) : {
      readReceipts: true,
      typingIndicator: true,
    };
  });

  useEffect(() => {
    localStorage.setItem("plavox-notif-prefs", JSON.stringify(notifPrefs));
  }, [notifPrefs]);

  useEffect(() => {
    localStorage.setItem("plavox-privacy-prefs", JSON.stringify(privacyPrefs));
  }, [privacyPrefs]);

  useEffect(() => {
    if (activeTab === "privacy") {
      loadBlockedUsers();
    }
  }, [activeTab]);

  const loadBlockedUsers = async () => {
    setLoadingBlocked(true);
    try {
      const users = await getBlockedUsers();
      setBlockedUsers(users || []);
    } catch {
      setBlockedUsers([]);
    } finally {
      setLoadingBlocked(false);
    }
  };

  const handleUnblock = async (userId) => {
    await unblockUser(userId);
    setBlockedUsers((prev) => prev.filter((u) => u._id !== userId));
    toast.success("User unblocked");
  };

  const toggleNotif = (key) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacyPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const themes = [
    { id: "dark", name: "Deep Space", desc: "Dark first mode", icon: <Moon className="size-5" /> },
    { id: "light", name: "Pure Light", desc: "Clean light mode", icon: <Sun className="size-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-hidden flex flex-col">
      <div className="grid-bg" />
      <div className="orb w-[500px] h-[500px] bg-[var(--orb-1)] top-[-200px] right-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-[var(--orb-2)] bottom-0 left-[-100px]" />

      <Navbar isCompact />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 relative z-10 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all md:hidden">
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
          {/* Sidebar */}
          <div className="space-y-2 md:space-y-1">
            <div className="flex md:flex-col gap-1 md:gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 md:px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Appearance */}
                {activeTab === "appearance" && (
                  <>
                    <section className="bg-[var(--secondary-bg)] p-6 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-xl space-y-6">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Customization</p>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight font-display">Theme Selection</h3>
                        <p className="text-sm text-[var(--text-muted)] font-light">Choose a theme that fits your workspace vibe.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl transition-all border text-left cursor-pointer ${
                              theme === t.id
                                ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_8px_30px_rgba(59,130,246,0.1)]"
                                : "border-[var(--border)] hover:border-[var(--text-muted)]/30 hover:bg-[var(--bg)]/40"
                            }`}
                            onClick={() => setTheme(t.id)}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                                theme === t.id ? "bg-[var(--accent)] text-[var(--accent-content)]" : "bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]"
                              }`}>
                                {t.icon}
                              </div>
                              <div>
                                <span className="text-sm font-bold block">{t.name}</span>
                                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">{t.desc}</span>
                              </div>
                            </div>
                            {theme === t.id && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-2 rounded-full bg-[var(--accent)]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="bg-[var(--secondary-bg)] p-6 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-xl space-y-6">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Preview</p>
                        <h3 className="text-xl font-bold tracking-tight font-display">Interface Preview</h3>
                      </div>

                      <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg)] shadow-inner">
                        <div className="p-4 bg-[var(--secondary-bg)] border-b border-[var(--border)] flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-bold border border-[var(--accent)]/10">
                            S
                          </div>
                          <div>
                            <h3 className="font-bold text-xs tracking-tight">Sarah Jenkins</h3>
                            <p className="text-[9px] font-bold text-green-500 uppercase tracking-wider">Online Now</p>
                          </div>
                        </div>
                        <div className="p-6 space-y-5 min-h-[200px] overflow-y-auto">
                          <div className="flex justify-start">
                            <div className="max-w-[80%] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed font-medium shadow-sm">
                              Hey! How does the selected theme look on your end?
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="max-w-[80%] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-[var(--accent-content)] p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed font-bold shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
                              It looks absolutely stunning! 🚀
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                  <section className="bg-[var(--secondary-bg)] p-6 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-xl space-y-6">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Preferences</p>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight font-display">Notifications</h3>
                      <p className="text-sm text-[var(--text-muted)] font-light">Control how and when you get notified.</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "messageNotifications", icon: <MessageSquare className="size-4" />, label: "Message notifications", desc: "Get notified when you receive a new message" },
                        { key: "callNotifications", icon: <Bell className="size-4" />, label: "Call notifications", desc: "Get notified for incoming voice and video calls" },
                        { key: "soundEnabled", icon: notifPrefs.soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />, label: "Sound", desc: "Play a sound when you receive a new notification" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/20 transition-all cursor-pointer"
                          onClick={() => toggleNotif(item.key)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{item.label}</p>
                              <p className="text-[10px] text-[var(--text-muted)]">{item.desc}</p>
                            </div>
                          </div>
                          <div
                            className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${
                              notifPrefs[item.key] ? "bg-[var(--accent)]" : "bg-[var(--surface)]"
                            }`}
                          >
                            <motion.div
                              animate={{ x: notifPrefs[item.key] ? 22 : 2 }}
                              className="absolute top-1 size-4 rounded-full bg-white shadow-md"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Privacy */}
                {activeTab === "privacy" && (
                  <>
                    <section className="bg-[var(--secondary-bg)] p-6 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-xl space-y-6">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Privacy</p>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight font-display">Privacy Settings</h3>
                        <p className="text-sm text-[var(--text-muted)] font-light">Control your online presence and data sharing.</p>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: "readReceipts", icon: <Eye className="size-4" />, iconOff: <EyeOff className="size-4" />, label: "Read receipts", desc: "Let others know when you've read their messages" },
                          { key: "typingIndicator", icon: <MessageSquare className="size-4" />, label: "Typing indicator", desc: "Show when you're typing a message" },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/20 transition-all cursor-pointer"
                            onClick={() => togglePrivacy(item.key)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="size-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                                {privacyPrefs[item.key] ? item.icon : (item.iconOff || item.icon)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold">{item.label}</p>
                                <p className="text-[10px] text-[var(--text-muted)]">{item.desc}</p>
                              </div>
                            </div>
                            <div
                              className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${
                                privacyPrefs[item.key] ? "bg-[var(--accent)]" : "bg-[var(--surface)]"
                              }`}
                            >
                              <motion.div
                                animate={{ x: privacyPrefs[item.key] ? 22 : 2 }}
                                className="absolute top-1 size-4 rounded-full bg-white shadow-md"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Blocked Users */}
                    <section className="bg-[var(--secondary-bg)] p-6 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-xl space-y-6">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Blocking</p>
                        <h3 className="text-xl font-bold tracking-tight font-display">Blocked Users</h3>
                        <p className="text-sm text-[var(--text-muted)] font-light">Users you've blocked will not be able to message or call you.</p>
                      </div>

                      {loadingBlocked ? (
                        <div className="flex items-center justify-center py-8">
                          <span className="size-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : blockedUsers.length === 0 ? (
                        <div className="text-center py-8 bg-[var(--bg)] rounded-2xl border border-[var(--border)]">
                          <UserX className="size-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                          <p className="text-sm text-[var(--text-muted)]">No blocked users</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {blockedUsers.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={user.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.fullName}`}
                                  alt=""
                                  className="size-8 rounded-full"
                                />
                                <span className="text-sm font-semibold truncate">{user.fullName}</span>
                              </div>
                              <button
                                onClick={() => handleUnblock(user._id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                              >
                                <UserX className="size-3" />
                                Unblock
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
