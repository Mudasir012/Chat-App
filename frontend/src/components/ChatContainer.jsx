import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import GroupMessageInput from "./GroupMessageInput";
import BoardContainer from "./BoardContainer";
import { useAuthStore } from "../store/useAuthStore";
import { format } from "date-fns";
import { axiosInstance } from "../lib/axios";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    addReaction,
    selectedGroup,
    selectedRoom,
    groupMessages,
    setGroupMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useChatStore();
  const { authUser, pusher } = useAuthStore();
  const messageEndRef = useRef(null);
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  const isGroupChat = !!selectedGroup && !!selectedRoom;
  const isBoardRoom = isGroupChat && selectedRoom.type === "board";

  useEffect(() => {
    if (!isGroupChat && selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser?._id, isGroupChat]);

  useEffect(() => {
    if (isGroupChat && selectedGroup && selectedRoom) {
      fetchGroupMessages();
      subscribeToGroupMessages();
      return () => unsubscribeFromGroupMessages();
    }
  }, [selectedGroup?._id, selectedRoom?.name, isGroupChat]);

  const fetchGroupMessages = async () => {
    if (!selectedGroup || !selectedRoom) return;
    setIsGroupLoading(true);
    try {
      const res = await axiosInstance.get(
        `/groups/${selectedGroup._id}/rooms/${selectedRoom.name}/messages`
      );
      setGroupMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch group messages:", err);
    } finally {
      setIsGroupLoading(false);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, groupMessages, isTyping]);

  const displayMessages = isGroupChat ? groupMessages : messages;
  const loading = isGroupChat ? isGroupLoading : isMessagesLoading;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-transparent">
        <ChatHeader />
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className={`${i % 2 === 0 ? "w-56" : "w-72"} h-14 rounded-2xl shimmer border border-[var(--border)]`} />
            </div>
          ))}
        </div>
        {isGroupChat ? <GroupMessageInput /> : <MessageInput />}
      </div>
    );
  }

  if (!selectedUser && !isGroupChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="size-20 bg-[var(--surface)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-40">
            <Check className="size-10 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Welcome to Plavox</h3>
          <p className="text-sm text-[var(--text-muted)]">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  if (isBoardRoom) {
    return (
      <div className="flex-1 flex flex-col bg-transparent">
        <ChatHeader />
        <BoardContainer />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar relative">
        {displayMessages.map((message, idx) => {
          const senderId = message.senderId?._id || message.senderId;
          const isOwn = senderId === authUser._id;
          const showAvatar = !isOwn && isGroupChat;
          const prevMsg = idx > 0 ? displayMessages[idx - 1] : null;
          const prevSender = prevMsg ? (prevMsg.senderId?._id || prevMsg.senderId) : null;
          const isFirstFromSender = !prevMsg || prevSender !== senderId;

          return (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} ${isFirstFromSender ? "mt-4" : "mt-0.5"}`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                {showAvatar && isFirstFromSender && (
                  <div className="flex-shrink-0 size-7 rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                    <img
                      src={message.senderId?.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${message.senderId?.fullName || "?"}`}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                )}
                {showAvatar && !isFirstFromSender && <div className="w-7 flex-shrink-0" />}
                <div className="flex flex-col gap-1 min-w-0">
                  {showAvatar && isFirstFromSender && (
                    <span className="text-[10px] font-bold text-[var(--text-muted)] ml-1">
                      {message.senderId?.fullName || "Unknown"}
                    </span>
                  )}
                  <div
                    className={`px-4 py-3 shadow-sm transition-all relative ${
                      isOwn
                        ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-[var(--accent-content)] rounded-2xl rounded-br-sm"
                        : "bg-[var(--surface)] text-[var(--text)] rounded-2xl rounded-bl-sm border border-[var(--border)]"
                    }`}
                    onDoubleClick={() => !isGroupChat && addReaction(message._id, "❤️")}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-full rounded-xl border border-white/5 mb-2 block shadow-sm"
                      />
                    )}
                    {message.text && (
                      <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                    )}

                    <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${message.text ? "opacity-70" : "opacity-60"}`}>
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {format(new Date(message.createdAt), "HH:mm")}
                      </span>
                      {isOwn && !isGroupChat && (
                        message.isRead ? (
                          <CheckCheck className="size-2.5 text-blue-400" />
                        ) : (
                          <Check className="size-2.5" />
                        )
                      )}
                    </div>

                    {!isGroupChat && message.reactions?.length > 0 && (
                      <div className={`absolute -bottom-3 ${isOwn ? "right-3" : "left-3"} flex gap-1`}>
                        {message.reactions.map((r, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[var(--surface)] shadow-lg rounded-full px-2 py-0.5 border border-[var(--border)]"
                          >
                            {r.emoji}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {isTyping && !isGroupChat && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-[var(--surface)] p-4 rounded-2xl rounded-bl-sm border border-[var(--border)]">
              <div className="flex gap-1.5">
                <span className="size-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="size-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="size-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messageEndRef} />
      </div>

      {isGroupChat ? <GroupMessageInput /> : <MessageInput />}
    </div>
  );
};

export default ChatContainer;
