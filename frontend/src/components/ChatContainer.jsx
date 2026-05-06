import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

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
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--bg)]">
        <ChatHeader />
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className="w-64 h-16 bg-[var(--secondary-bg)] rounded-2xl animate-pulse border border-[var(--border)]" />
            </div>
          ))}
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)]">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
            ref={messageEndRef}
          >
            <div className="flex flex-col max-w-[85%] sm:max-w-[70%] gap-1.5">
              <div
                className={`
                  p-4 rounded-2xl shadow-sm transition-all relative
                  ${message.senderId === authUser._id 
                    ? "bg-[var(--accent)] text-white rounded-tr-sm shadow-indigo-500/10" 
                    : "bg-white dark:bg-slate-800 text-[var(--text)] rounded-tl-sm border border-[var(--border)]"}
                `}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full rounded-xl border border-white/20 mb-3 block shadow-sm"
                  />
                )}
                {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
                
                <span className={`text-[9px] font-medium mt-1.5 block text-right opacity-60 ${message.senderId === authUser._id ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                  {format(new Date(message.createdAt), "HH:mm")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
