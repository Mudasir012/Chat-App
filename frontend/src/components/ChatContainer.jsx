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
      <div className="flex-1 flex flex-col overflow-auto bg-[var(--bg)]">
        <ChatHeader />
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className="w-48 h-12 bg-[var(--text)] opacity-10 animate-pulse border-2 border-[var(--border)]" />
            </div>
          ))}
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-[var(--bg)]">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--text)]">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
            ref={messageEndRef}
          >
            <div className="flex flex-col max-w-[80%] sm:max-w-[70%] gap-1">
              <div
                className={`
                  p-3 border-2 border-[var(--border)] relative transition-all
                  ${message.senderId === authUser._id 
                    ? "bg-[var(--text)] text-[var(--bg)] shadow-[6px_6px_0px_0px_var(--accent)]" 
                    : "bg-[var(--secondary-bg)] text-[var(--text)] shadow-[6px_6px_0px_0px_var(--border)] border-l-4 border-l-[var(--accent)]"}
                `}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-[200px] border-2 border-current mb-2 block"
                  />
                )}
                {message.text && <p className="text-sm font-bold leading-relaxed">{message.text}</p>}
                
                <span className="text-[8px] uppercase font-black opacity-40 mt-1 block text-right">
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
