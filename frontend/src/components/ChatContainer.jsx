import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { format } from "date-fns";

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
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    // Mark unread messages as read
    const unreadMessages = messages.filter(m => m.senderId === selectedUser._id && !m.isRead);
    unreadMessages.forEach(m => {
      useChatStore.getState().markAsRead(m._id);
    });
  }, [messages, selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (isMessagesLoading) {
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
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            <div className="flex flex-col max-w-[85%] sm:max-w-[70%] gap-1.5 group relative">
              <div
                className={`
                  p-5 rounded-[var(--radius)] shadow-sm transition-all relative
                  ${message.senderId === authUser._id
                    ? "bg-[var(--accent)] text-[var(--accent-content)] rounded-tr-none shadow-[0_4px_20px_rgba(206,212,218,0.15)]"
                    : "bg-[var(--secondary-bg)] text-[var(--text)] rounded-tl-none border border-[var(--border)]"}
                `}
                onDoubleClick={() => addReaction(message._id, "❤️")}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full rounded-[1.25rem] border border-white/10 mb-3 block shadow-sm"
                  />
                )}
                {message.text && <p className="text-sm leading-relaxed font-medium">{message.text}</p>}

                <div className="flex items-center justify-end gap-1.5 mt-2 opacity-60">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${message.senderId === authUser._id ? "text-[var(--accent-content)]" : "text-[var(--text-muted)]"}`}>
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                  {message.senderId === authUser._id && (
                    message.isRead ? <CheckCheck className="size-3 text-blue-500" /> : <Check className="size-3" />
                  )}
                </div>

                {/* Reactions */}
                {message.reactions?.length > 0 && (
                  <div className="absolute -bottom-3 left-3 flex gap-1">
                    {message.reactions.map((r, i) => (
                      <span key={i} className="text-xs bg-[var(--surface)] shadow-lg rounded-full px-2 py-0.5 border border-[var(--border)]">{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
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

      <MessageInput />
    </div>
  );
};

export default ChatContainer;