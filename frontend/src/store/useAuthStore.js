import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
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
      get().connectSocket();
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

      get().connectSocket();
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
      get().disconnectSocket();
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
      await axiosInstance.post(`/users/block/${userId}`);
      toast.success("User blocked");
      // Update local state if needed
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  unblockUser: async (userId) => {
    try {
      await axiosInstance.post(`/users/unblock/${userId}`);
      toast.success("User unblocked");
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

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("call:invite", (data) => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().receiveCall(data));
    });

    socket.on("call:accepted", (data) => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().set({ status: "connected" }));
    });

    socket.on("call:declined", () => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().endCall());
    });

    socket.on("call:ended", () => {
      import("./useCallStore").then((mod) => mod.useCallStore.getState().endCall());
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
