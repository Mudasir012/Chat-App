import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


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
      set({ users: res.data });
    } catch (err) {
      console.error("Failed to fetch users:", err);
      set({ users: [] });
      toast.error("Unable to load users. Please refresh or try again later.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
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
      toast.error(error.response?.data?.message || "Failed to send message");
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
      toast.error(error.response?.data?.message || "Failed to add reaction");
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
    const userChannel = pusher.channel(`private-user-${authUser._id}`);
    if (!userChannel) return;
    userChannel.unbind("newMessage");
    userChannel.unbind("messageReaction");
    userChannel.unbind("userTyping");
  },

  clearChat: async (userId) => {
    try {
      await axiosInstance.post(`/messages/clear/${userId}`);
      set({ messages: [] });
      toast.success("Chat cleared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear chat");
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
      const res = await axiosInstance.post("/groups", { name, description });
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

  boardTasks: [],
  setBoardTasks: (tasks) => set({ boardTasks: tasks }),

  fetchBoardTasks: async () => {
    const { selectedGroup, selectedRoom } = get();
    if (!selectedGroup || !selectedRoom) return;
    try {
      const res = await axiosInstance.get(
        `/groups/${selectedGroup._id}/rooms/${selectedRoom.name}/tasks`
      );
      set({ boardTasks: res.data });
    } catch (err) {
      console.error("Failed to fetch board tasks:", err);
    }
  },

  createTask: async (taskData) => {
    const { selectedGroup, selectedRoom } = get();
    if (!selectedGroup || !selectedRoom) return;
    try {
      const res = await axiosInstance.post(
        `/groups/${selectedGroup._id}/rooms/${selectedRoom.name}/tasks`,
        taskData
      );
      set({ boardTasks: [...get().boardTasks, res.data] });
      toast.success("Task created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  },

  updateTask: async (taskId, taskData) => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;
    try {
      const res = await axiosInstance.put(
        `/groups/${selectedGroup._id}/tasks/${taskId}`,
        taskData
      );
      set({
        boardTasks: get().boardTasks.map((t) => (t._id === taskId ? res.data : t)),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  },

  deleteTask: async (taskId) => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;
    try {
      await axiosInstance.delete(`/groups/${selectedGroup._id}/tasks/${taskId}`);
      set({ boardTasks: get().boardTasks.filter((t) => t._id !== taskId) });
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup, selectedRoom } = get();
    if (!selectedGroup || !selectedRoom) return;

    const { pusher } = useAuthStore.getState();
    if (!pusher) return;

    const channel = pusher.subscribe(`private-group-${selectedGroup._id}`);
    channel.bind("room:newMessage", (data) => {
      if (data.roomId === selectedRoom.name) {
        set({
          groupMessages: [...get().groupMessages, data.message],
        });
      }
    });

    channel.bind("room:task-created", (data) => {
      if (data.roomName === selectedRoom.name) {
        set({ boardTasks: [...get().boardTasks, data.task] });
      }
    });

    channel.bind("room:task-updated", (data) => {
      if (data.roomName === selectedRoom.name) {
        set({
          boardTasks: get().boardTasks.map((t) =>
            t._id === data.task._id ? data.task : t
          ),
        });
      }
    });

    channel.bind("room:task-deleted", (data) => {
      if (data.roomName === selectedRoom.name) {
        set({
          boardTasks: get().boardTasks.filter((t) => t._id !== data.taskId),
        });
      }
    });
  },

  unsubscribeFromGroupMessages: () => {
    const { selectedGroup } = get();
    const { pusher } = useAuthStore.getState();
    if (!pusher || !selectedGroup) return;

    const channel = pusher.channel(`private-group-${selectedGroup._id}`);
    if (channel) {
      channel.unbind("room:newMessage");
      channel.unbind("room:task-created");
      channel.unbind("room:task-updated");
      channel.unbind("room:task-deleted");
    }
    pusher.unsubscribe(`private-group-${selectedGroup._id}`);
  },
    }),
    {
      name: "plavox-chat-storage",
      partialize: (state) => ({
        selectedGroup: state.selectedGroup,
        selectedRoom: state.selectedRoom,
        groups: state.groups,
      }),
    }
  )
);
