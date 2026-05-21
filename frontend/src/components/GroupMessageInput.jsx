import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send, Image, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const GroupMessageInput = () => {
  const { selectedGroup, selectedRoom, setGroupMessages, groupMessages } = useChatStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image must be less than 5MB");
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    if (!selectedGroup || !selectedRoom) return;

    setIsSending(true);
    try {
      let imageUrl = null;

      if (image) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      const res = await axiosInstance.post(
        `/groups/${selectedGroup._id}/rooms/${selectedRoom.name}/messages`,
        {
          text: text.trim(),
          image: imageUrl,
        }
      );

      setGroupMessages((prev) => [...prev, res.data]);
      setText("");
      removeImage();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth";
      } else if (error.response?.status === 403) {
        toast.error("You are not a member of this group");
      } else if (error.response?.status === 404) {
        toast.error("Room not found");
      } else if (!error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.response?.data?.message || "Failed to send message");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--secondary-bg)]/50 p-4">
      {imagePreview && (
        <div className="relative mb-3 inline-block">
          <img src={imagePreview} alt="Preview" className="h-20 rounded-xl border border-[var(--border)]" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 size-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
        >
          <Image className="size-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />

        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message #${selectedRoom?.name || "general"}`}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
            disabled={isSending}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <Smile className="size-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={isSending || (!text.trim() && !image)}
          className="p-3 rounded-xl bg-[var(--accent)] text-[var(--accent-content)] hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default GroupMessageInput;
