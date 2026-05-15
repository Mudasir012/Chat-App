import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useChatStore = create(
  persist(
    (set, get) => ({
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
    // Skip API call for mock messages
    if (messageId.startsWith("m")) {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? { ...m, isRead: true } : m
        ),
      });
      return;
    }

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
    const { authUser } = useAuthStore.getState();

    // Handle mock messages
    if (messageId.startsWith("m")) {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId
            ? {
                ...m,
                reactions: [
                  ...(m.reactions || []).filter((r) => r.userId !== authUser._id),
                  { userId: authUser._id, emoji },
                ],
              }
            : m
        ),
      });
      return;
    }

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

  sendTyping: async (receiverId) => {
    try {
      await axiosInstance.post(`/messages/typing/${receiverId}`);
    } catch (error) {
      console.log("Error in sendTyping:", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const { authUser, pusher } = useAuthStore.getState();
    if (!pusher) return;

    const userChannel = pusher.subscribe(`private-user-${authUser._id}`);

    userChannel.bind("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    userChannel.bind("messageReaction", ({ messageId, userId, emoji }) => {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId
            ? {
                ...m,
                reactions: [
                  ...(m.reactions || []).filter((r) => r.userId !== userId),
                  { userId, emoji },
                ],
              }
            : m
        ),
      });
    });

    userChannel.bind("userTyping", ({ from }) => {
      if (selectedUser._id === from) {
        set({ isTyping: true });
        if (get().typingTimeout) clearTimeout(get().typingTimeout);
        const timeout = setTimeout(() => set({ isTyping: false }), 3000);
        set({ typingTimeout: timeout });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const { authUser, pusher } = useAuthStore.getState();
    if (!pusher) return;
    const userChannel = pusher.subscribe(`private-user-${authUser._id}`);
    userChannel.unbind("newMessage");
    userChannel.unbind("messageReaction");
    userChannel.unbind("userTyping");
  },

  clearChat: async (userId) => {
    if (userId.startsWith("mock-")) {
      set({ messages: [] });
      toast.success("Mock chat cleared locally");
      return;
    }
    try {
      await axiosInstance.post(`/messages/clear/${userId}`);
      set({ messages: [] });
      toast.success("Chat cleared");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, isTyping: false }),
  setMessages: (messages) => set({ messages }),
  isTyping: false,
  typingTimeout: null,
  selectedGroup: null,
  selectedRoom: null,
  groups: [],
  groupMessages: [],
  setSelectedGroup: (group) => set({ selectedGroup: group, selectedRoom: null, groupMessages: [] }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setGroups: (groups) => set({ groups }),
  setGroupMessages: (messages) => set({ groupMessages: messages }),

  fetchGroups: async () => {
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  },

  createGroup: async (name, description) => {
    try {
      const res = await axiosInstance.post("/groups/create", { name, description });
      set((state) => ({ groups: [...state.groups, res.data.group] }));
      toast.success(`Group "${name}" created!`);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
      throw err;
    }
  },

  joinGroup: async (inviteCode) => {
    try {
      const res = await axiosInstance.post("/groups/join", { inviteCode });
      set((state) => ({ groups: [...state.groups, res.data.group] }));
      toast.success(`Joined "${res.data.group.name}"!`);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid invite code");
      throw err;
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup, selectedRoom } = get();
    if (!selectedGroup || !selectedRoom) return;

    const { authUser, pusher } = useAuthStore.getState();
    if (!pusher) return;

    const channel = pusher.subscribe(`private-group-${selectedGroup._id}`);
    channel.bind("room:newMessage", (data) => {
      if (data.roomId === selectedRoom.name) {
        set({
          groupMessages: [...get().groupMessages, data.message],
        });
      }
    });
  },

  unsubscribeFromGroupMessages: () => {
    const { selectedGroup } = get();
    const { pusher } = useAuthStore.getState();
    if (!pusher || !selectedGroup) return;

    const channel = pusher.subscribe(`private-group-${selectedGroup._id}`);
    channel.unbind("room:newMessage");
    pusher.unsubscribe(`private-group-${selectedGroup._id}`);
  },
    }),
    {
      name: "plavox-chat-storage",
      partialize: (state) => ({
        selectedUser: state.selectedUser,
        users: state.users,
        selectedGroup: state.selectedGroup,
        selectedRoom: state.selectedRoom,
        groups: state.groups,
      }),
    }
  )
);
