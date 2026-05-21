import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";

export const useCallStore = create((set, get) => ({
  call: null, // { from, to, roomId, type: 'video' | 'voice', status: 'offering' | 'ringing' | 'connected' }

  initCall: async (to, type = "video") => {
    const { authUser } = useAuthStore.getState();

    try {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      set({ call: { to, type, roomId, status: "connected" } });

      await axiosInstance.post("/calls/invite", {
        to: to._id,
        from: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profilePic: authUser.profilePic,
        },
        type,
        roomId,
      });
    } catch (err) {
      console.error("Failed to init call", err);
    }
  },

  receiveCall: (data) => {
    set({ call: { ...data, status: "ringing" } });
  },

  acceptCall: async () => {
    const { call } = get();
    if (!call) return;

    try {
      set({ call: { ...call, status: "connected" } });
      await axiosInstance.post("/calls/accept", { to: call.from._id });
    } catch (err) {
      console.error("Failed to accept call", err);
    }
  },

  declineCall: () => {
    const { call } = get();
    if (call) {
      axiosInstance.post("/calls/decline", { to: call.from._id });
    }
    get().endCall();
  },

  endCall: () => {
    const { call } = get();
    if (call) {
      const targetId = call.from?._id || call.to?._id;
      if (targetId) axiosInstance.post("/calls/end", { to: targetId });
    }
    set({ call: null });
  },

  setCallStatus: (status) => {
    const { call } = get();
    if (call) {
      set({ call: { ...call, status } });
    }
  },
}));
