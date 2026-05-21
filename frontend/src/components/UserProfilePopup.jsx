import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Code2, Mail, User, Quote } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const UserProfilePopup = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axiosInstance.get(`/users/profile/${userId}`)
      .then((res) => setUserData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/fun-emoji/svg?seed=";

  return (
    <AnimatePresence>
      {userId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 size-8 rounded-xl bg-[var(--bg)] hover:bg-red-500/10 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition-all"
            >
              <X className="size-3.5" />
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <span className="size-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : userData ? (
              <div className="space-y-4">
                {/* Avatar + Name */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src={userData.profilePic || (DEFAULT_AVATAR + encodeURIComponent(userData.fullName))}
                    alt={userData.fullName}
                    className="size-20 rounded-[1.25rem] object-cover border-2 border-[var(--border)] shadow-lg"
                  />
                  <h3 className="mt-3 text-lg font-bold">{userData.fullName}</h3>
                  {userData.username && (
                    <p className="text-xs text-[var(--text-muted)]">@{userData.username}</p>
                  )}
                </div>

                {/* Bio */}
                {userData.bio && (
                  <div className="bg-[var(--bg)] rounded-xl p-3.5 border border-[var(--border)]">
                    <div className="flex items-start gap-2">
                      <Quote className="size-3.5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed text-[var(--text-muted)]">{userData.bio}</p>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(userData.instagram || userData.github || userData.contactEmail) && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Connect</p>
                    <div className="space-y-1.5">
                      {userData.instagram && (
                        <a
                          href={`https://instagram.com/${userData.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all group"
                        >
                          <div className="size-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <Camera className="size-3.5 text-pink-400" />
                          </div>
                          <span className="text-xs font-medium truncate">@{userData.instagram}</span>
                        </a>
                      )}
                      {userData.github && (
                        <a
                          href={`https://github.com/${userData.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all group"
                        >
                          <div className="size-7 rounded-lg bg-[var(--surface)] flex items-center justify-center border border-[var(--border)]">
                            <Code2 className="size-3.5 text-[var(--text)]" />
                          </div>
                          <span className="text-xs font-medium truncate">{userData.github}</span>
                        </a>
                      )}
                      {userData.contactEmail && (
                        <a
                          href={`mailto:${userData.contactEmail}`}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all group"
                        >
                          <div className="size-7 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                            <Mail className="size-3.5 text-[var(--accent)]" />
                          </div>
                          <span className="text-xs font-medium truncate">{userData.contactEmail}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {!userData.bio && !userData.instagram && !userData.github && !userData.contactEmail && (
                  <p className="text-xs text-center text-[var(--text-muted)] py-4">No bio or links yet</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-center text-[var(--text-muted)] py-8">Could not load profile</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfilePopup;