import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
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

  return (
    <div className="h-screen pt-20 bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="border-4 border-[var(--border)] p-10 bg-[var(--bg)] shadow-[12px_12px_0px_0px_var(--border)] space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Profile</h1>
            <p className="mt-2 text-xs font-mono uppercase opacity-50">Your account information</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 object-cover border-4 border-[var(--border)]"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-[var(--text)] p-2 border-2 border-[var(--bg)]
                  cursor-pointer transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-105"}
                `}
              >
                <Camera className="w-5 h-5 text-[var(--bg)]" />
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
            <p className="text-[10px] font-black uppercase opacity-40">
              {isUpdatingProfile ? "Uploading..." : "Click the camera to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-[var(--text)] text-[var(--bg)] border-2 border-[var(--border)] font-bold uppercase">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 border-2 border-[var(--border)] font-mono text-sm">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t-2 border-[var(--border)] pt-6">
            <h2 className="text-lg font-black uppercase tracking-tighter mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b-2 border-[var(--border)] border-opacity-10">
                <span className="font-bold opacity-50 uppercase text-[10px]">Member Since</span>
                <span className="font-mono">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold opacity-50 uppercase text-[10px]">Account Status</span>
                <span className="text-green-500 font-black uppercase">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
