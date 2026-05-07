import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useCallStore = create((set, get) => ({
  call: null, // { from, to, signal, type: 'video' | 'voice', status: 'offering' | 'ringing' | 'connected' }
  localStream: null,
  remoteStream: null,

  initCall: async (to, type = "video") => {
    const { socket, authUser } = useAuthStore.getState();
    if (!socket) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });

      set({ localStream: stream, call: { to, type, status: "offering" } });

      socket.emit("call:invite", {
        to: to._id,
        from: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profilePic: authUser.profilePic,
        },
        type,
      });
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  },

  receiveCall: (data) => {
    set({ call: { ...data, status: "ringing" } });
  },

  acceptCall: async () => {
    const { socket, call } = get();
    if (!socket || !call) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: call.type === "video",
        audio: true,
      });

      set({ localStream: stream, call: { ...call, status: "connected" } });
      socket.emit("call:accept", { to: call.from._id });
    } catch (err) {
      console.error("Failed to get local stream for answer", err);
    }
  },

  declineCall: () => {
    const { socket, call } = get();
    if (socket && call) {
      socket.emit("call:decline", { to: call.from._id });
    }
    get().endCall();
  },

  endCall: () => {
    const { localStream, socket, call } = get();
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (socket && call) {
      const targetId = call.from?._id || call.to?._id;
      if (targetId) socket.emit("call:end", { to: targetId });
    }
    set({ call: null, localStream: null, remoteStream: null });
  },

  setRemoteStream: (stream) => set({ remoteStream: stream }),
}));
