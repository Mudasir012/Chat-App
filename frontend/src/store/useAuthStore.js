import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import Pusher from "pusher-js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://chat-app-git-main-mudasir012s-projects.vercel.app";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  pusher: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectPusher();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success(res.data.message);
      return { success: true, email: data.email };
    } catch (error) {
      toast.error(error.response.data.message);
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (code) => {
    try {
      const res = await axiosInstance.post("/auth/verify-email", { code });
      set({ authUser: res.data });
      toast.success("Email verified successfully");
      get().connectPusher();
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectPusher();
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        toast.error("Please verify your email");
        return { needsVerification: true, email: data.email };
      }
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectPusher();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  resetPassword: async (token, password) => {
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successfully");
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  },

  searchUsers: async (query) => {
    try {
      const res = await axiosInstance.get(`/users/search?query=${query}`);
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return [];
    }
  },

  blockUser: async (userId) => {
    try {
      const res = await axiosInstance.post(`/users/block/${userId}`);
      toast.success("User blocked");
      // Refresh authUser to get updated blockedUsers list
      const authRes = await axiosInstance.get("/auth/check");
      set({ authUser: authRes.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  reportUser: async (userId, reason) => {
    if (userId.startsWith("mock-")) {
      toast.success("Mock report submitted locally");
      return;
    }
    try {
      await axiosInstance.post(`/users/report/${userId}`, { reason });
      toast.success("Report submitted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  unblockUser: async (userId) => {
    try {
      await axiosInstance.post(`/users/unblock/${userId}`);
      toast.success("User unblocked");
      // Refresh authUser
      const authRes = await axiosInstance.get("/auth/check");
      set({ authUser: authRes.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getBlockedUsers: async () => {
    try {
      const res = await axiosInstance.get("/users/blocked");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return [];
    }
  },

  connectPusher: () => {
    const { authUser } = get();
    if (!authUser || get().pusher) return;

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      authEndpoint: `${BASE_URL}/api/pusher/auth`,
      auth: {
        withCredentials: true,
      },
    });

    set({ pusher });

    // Presence channel for online users
    const channel = pusher.subscribe("presence-online-users");

    channel.bind("pusher:subscription_succeeded", (members) => {
      const userIds = [];
      members.each((member) => userIds.push(member.id));
      set({ onlineUsers: userIds });
    });

    channel.bind("pusher:member_added", (member) => {
      set({ onlineUsers: [...get().onlineUsers, member.id] });
    });

    channel.bind("pusher:member_removed", (member) => {
      set({ onlineUsers: get().onlineUsers.filter((id) => id !== member.id) });
    });

    // Listen for personal notifications on a private channel
    const userChannel = pusher.subscribe(`private-user-${authUser._id}`);

    userChannel.bind("call:invite", (data) => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().receiveCall(data));
    });

    userChannel.bind("call:accepted", (data) => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().set({ status: "connected" }));
    });

    userChannel.bind("call:declined", () => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().endCall());
    });

    userChannel.bind("call:ended", () => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().endCall());
    });
  },

  disconnectPusher: () => {
    const { pusher } = get();
    if (pusher) {
      pusher.disconnect();
      set({ pusher: null });
    }
  },
}));
