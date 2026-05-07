import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const MOCK_USERS = [
  { _id: "mock-1", fullName: "Sarah Miller", profilePic: "", email: "sarah@example.com", isMock: true },
  { _id: "mock-2", fullName: "Alex (Dev Squad)", profilePic: "", email: "alex@example.com", isMock: true },
  { _id: "mock-3", fullName: "Security Bot", profilePic: "", email: "bot@example.com", isMock: true },
];

const MOCK_MESSAGES = {
  "mock-1": [
    { _id: "m1", text: "Hey! Did you see the new design?", senderId: "mock-1", createdAt: new Date().toISOString() },
    { _id: "m2", text: "Just now! The brutalist look is bold.", senderId: "me", createdAt: new Date().toISOString() },
  ],
  "mock-2": [
    { _id: "m3", text: "Backend is deployed to main.", senderId: "mock-2", createdAt: new Date().toISOString() },
    { _id: "m4", text: "Sweet. Testing the socket connections now.", senderId: "me", createdAt: new Date().toISOString() },
  ],
  "mock-3": [
    { _id: "m5", text: "New login detected from Tokyo, JP.", senderId: "mock-3", createdAt: new Date().toISOString() },
    { _id: "m6", text: "That's my VPN, we're good.", senderId: "me", createdAt: new Date().toISOString() },
  ],
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: [...res.data, ...MOCK_USERS] });
    } catch (err) {
      console.error("Failed to fetch users:", err);
      set({ users: MOCK_USERS }); // Fallback to mock only if server fails
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (userId.startsWith("mock-")) {
      set({ messages: MOCK_MESSAGES[userId] || [], isMessagesLoading: false });
      return;
    }
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  markAsRead: async (messageId) => {
    try {
      await axiosInstance.post(`/messages/mark-read/${messageId}`);
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? { ...m, isRead: true } : m
        ),
      });
    } catch (error) {
      console.log("Error in markAsRead:", error);
    }
  },

  addReaction: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.post(`/messages/react/${messageId}`, { emoji });
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? res.data : m
        ),
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sendTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.emit("typing", { to: receiverId });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    socket.on("messageReaction", ({ messageId, userId, emoji }) => {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId
            ? {
                ...m,
                reactions: [
                  ...m.reactions.filter((r) => r.userId !== userId),
                  { userId, emoji },
                ],
              }
            : m
        ),
      });
    });

    socket.on("userTyping", ({ from }) => {
      if (selectedUser._id === from) {
        set({ isTyping: true });
        setTimeout(() => set({ isTyping: false }), 3000);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageReaction");
    socket.off("userTyping");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, isTyping: false }),
  setMessages: (messages) => set({ messages }),
  isTyping: false,
}));
