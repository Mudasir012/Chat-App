import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck } from "lucide-react";
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
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className="w-64 h-16 bg-[var(--secondary-bg)] rounded-[var(--radius)] animate-pulse border border-[var(--border)]" />
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
          <div className="size-20 bg-[var(--surface)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
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

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
        {displayMessages.map((message) => {
          const senderId = message.senderId?._id || message.senderId;
          const isOwn = senderId === authUser._id;

          return (
            <div key={message._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col max-w-[85%] sm:max-w-[70%] gap-1.5 group relative">
                {!isOwn && isGroupChat && (
                  <span className="text-[10px] font-bold text-[var(--text-muted)] ml-2">
                    {message.senderId?.fullName || "Unknown"}
                  </span>
                )}
                <div
                  className={`p-5 rounded-[var(--radius)] shadow-sm transition-all relative ${
                    isOwn
                      ? "bg-[var(--accent)] text-[var(--accent-content)] rounded-tr-none shadow-[0_4px_20px_rgba(206,212,218,0.15)]"
                      : "bg-[var(--secondary-bg)] text-[var(--text)] rounded-tl-none border border-[var(--border)]"
                  }`}
                  onDoubleClick={() => !isGroupChat && addReaction(message._id, "❤️")}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-full rounded-[1.25rem] border border-white/10 mb-3 block shadow-sm"
                    />
                  )}
                  {message.text && (
                    <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                  )}

                  <div className="flex items-center justify-end gap-1.5 mt-2 opacity-60">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isOwn ? "text-[var(--accent-content)]" : "text-[var(--text-muted)]"
                      }`}
                    >
                      {format(new Date(message.createdAt), "HH:mm")}
                    </span>
                    {isOwn && !isGroupChat && (
                      message.isRead ? (
                        <CheckCheck className="size-3 text-blue-500" />
                      ) : (
                        <Check className="size-3" />
                      )
                    )}
                  </div>

                  {!isGroupChat && message.reactions?.length > 0 && (
                    <div className="absolute -bottom-3 left-3 flex gap-1">
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
          );
        })}

        {isTyping && !isGroupChat && (
          <div className="flex justify-start">
            <div className="bg-[var(--secondary-bg)] p-4 rounded-[var(--radius)] rounded-tl-none border border-[var(--border)]">
              <div className="flex gap-1.5">
                <span className="size-1.5 bg-[var(--text-muted)] rounded-full animate-bounce"></span>
                <span className="size-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="size-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {isGroupChat ? <GroupMessageInput /> : <MessageInput />}
    </div>
  );
};

export default ChatContainer;
