import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser, sendTyping } = useChatStore();
  const { authUser } = useAuthStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (selectedUser && !selectedUser.isMock) {
      sendTyping(selectedUser._id);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (selectedUser?.isMock) {
      const newMessage = {
        _id: Date.now().toString(),
        text: text.trim(),
        image: imagePreview,
        senderId: authUser._id,
        createdAt: new Date().toISOString(),
      };
      useChatStore.getState().setMessages([...useChatStore.getState().messages, newMessage]);
      setText("");
      setImagePreview(null);
      return;
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 px-6 w-full bg-[var(--bg)]/50 backdrop-blur-md border-t border-[var(--border)]">
      {imagePreview && (
        <div className="mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-2xl border border-[var(--border)] shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 bg-red-500 text-white flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[var(--secondary-bg)] rounded-[1.5rem] px-4 py-2 border border-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20 focus-within:border-[var(--accent)] transition-all">
          <button
            type="button"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={handleTextChange}
          />

          <button
            type="button"
            className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors hidden sm:block"
          >
            <Smile size={20} />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="size-12 bg-[var(--accent)] text-[var(--accent-content)] rounded-full flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:shadow-none active:scale-90"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} className={text.trim() || imagePreview ? "translate-x-0.5 -translate-y-0.5" : ""} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
