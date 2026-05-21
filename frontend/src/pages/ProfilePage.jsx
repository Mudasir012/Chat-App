import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, Calendar, Loader2, X, Globe, Code2, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    bio: authUser?.bio || "",
    instagram: authUser?.instagram || "",
    github: authUser?.github || "",
    contactEmail: authUser?.contactEmail || "",
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar isCompact />
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden relative">
        <div className="grid-bg" />
        <div className="orb w-[400px] h-[400px] bg-[var(--orb-1)] top-[-100px] right-[-50px]" />
        <div className="orb w-[300px] h-[300px] bg-[var(--orb-2)] bottom-0 left-[-50px]" />

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-2xl max-h-full flex flex-col"
        >
          <div className="card-curvy p-6 md:p-8 flex flex-col overflow-hidden shadow-2xl shadow-black/10">
            {/* Close button */}
            <button
              onClick={() => navigate("/")}
              className="absolute top-4 right-4 size-9 rounded-xl bg-[var(--surface)] hover:bg-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-all z-10"
            >
              <X className="size-4" />
            </button>

            {/* Scrollable content area */}
            <div className="overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-5">
              {/* Header */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-xs text-[var(--text-muted)]">Manage your account information and preferences</p>
              </div>

              {/* Avatar + Form in a row on larger screens */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  <div className="relative group">
                    <img
                      src={selectedImg || authUser.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(authUser.fullName || "")}`}
                      alt="Profile"
                      className="size-28 md:size-32 object-cover rounded-[2rem] border-4 border-[var(--bg)] shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={`
                        absolute bottom-0 right-0
                        bg-gradient-to-br from-[var(--accent)] to-[var(--secondary-accent)] p-2.5 rounded-xl border-4 border-[var(--bg)]
                        cursor-pointer transition-all duration-300 shadow-lg
                        ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-110 active:scale-95"}
                      `}
                    >
                      <Camera className="size-4 text-white" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUpdatingProfile}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] font-semibold text-[var(--accent)]">
                    {isUpdatingProfile ? "Uploading..." : "Change photo"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdateProfile} className="flex-1 w-full space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold ml-1 flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider">
                        <User className="size-3" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="input-base text-sm"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold ml-1 flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider">
                        <User className="size-3" />
                        Username
                      </label>
                      <input
                        type="text"
                        className="input-base text-sm"
                        placeholder="@username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold ml-1 flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider">
                      <Mail className="size-3" />
                      Email Address
                    </label>
                    <div className="input-base text-sm font-medium text-[var(--text-muted)] truncate flex items-center opacity-80 cursor-not-allowed">
                      {authUser?.email}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold ml-1 flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider">
                      <User className="size-3" />
                      Bio
                    </label>
                    <textarea
                      className="input-base text-sm min-h-[60px] max-h-[80px] resize-none"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  {/* Social Links */}
                  <div className="pt-2 border-t border-[var(--border)]">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <LinkIcon className="size-3" />
                      Social Links
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold ml-1 flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider">
                          <Camera className="size-3" />
                          Instagram
                        </label>
                        <input
                          type="text"
                          className="input-base text-sm"
                          placeholder="your-username"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold ml-1 flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider">
                          <Code2 className="size-3" />
                          GitHub
                        </label>
                        <input
                          type="text"
                          className="input-base text-sm"
                          placeholder="your-username"
                          value={formData.github}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold ml-1 flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider">
                          <Mail className="size-3" />
                          Contact Email
                        </label>
                        <input
                          type="email"
                          className="input-base text-sm"
                          placeholder="contact@example.com"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="flex-1 py-3 text-sm font-bold rounded-xl border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="flex-1 btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Account Details */}
              <div className="pt-4 border-t border-[var(--border)]">
                <h2 className="text-sm font-bold tracking-tight mb-3">Account Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                      <Calendar className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Member Since</p>
                      <p className="text-xs font-semibold truncate">{authUser.createdAt?.split("T")[0] || "N/A"}</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-[var(--green-bg)] flex items-center justify-center text-[var(--green)] flex-shrink-0">
                      <Shield className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Status</p>
                      <p className="text-xs font-semibold text-[var(--green)] truncate">Verified Account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
