import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
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
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="min-h-screen pt-20 bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 py-12">
        <div className="card-curvy p-8 md:p-12 space-y-10 shadow-xl shadow-black/5">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
            <p className="text-sm text-[var(--text-muted)]">Manage your account information and preferences</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(authUser.fullName || "")}`}
                alt="Profile"
                className="size-36 object-cover rounded-[2.5rem] border-4 border-[var(--bg)] shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-[var(--accent)] p-3 rounded-2xl border-4 border-[var(--bg)]
                  cursor-pointer transition-all duration-300 shadow-lg
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-110 active:scale-95"}
                `}
              >
                <Camera className="size-5 text-[#212529]" />
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
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--accent)]">
                {isUpdatingProfile ? "Uploading..." : "Change Profile Photo"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">JPG or PNG. Max size of 10MB</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1 flex items-center gap-2 text-[var(--text-muted)]">
                  <User className="size-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm font-semibold"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1 flex items-center gap-2 text-[var(--text-muted)]">
                  <User className="size-4" />
                  Username
                </label>
                <input
                  type="text"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm font-semibold"
                  placeholder="@username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center gap-2 text-[var(--text-muted)]">
                <Mail className="size-4" />
                Email Address
              </label>
              <div className="px-5 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl font-medium text-[var(--text-muted)] truncate">
                {authUser?.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center gap-2 text-[var(--text-muted)]">
                <User className="size-4" />
                Bio
              </label>
              <textarea
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm font-semibold min-h-[100px]"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
            >
              {isUpdatingProfile ? "Updating..." : "Save Changes"}
            </button>
          </form>

          <div className="pt-10 border-t border-[var(--border)]">
            <h2 className="text-xl font-bold tracking-tight mb-6">Account Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center gap-4">
                <div className="size-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-semibold">{authUser.createdAt?.split("T")[0]}</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center gap-4">
                <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <Shield className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Status</p>
                  <p className="text-sm font-semibold text-green-500">Verified Account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
