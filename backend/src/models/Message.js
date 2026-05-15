import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    roomId: {
      type: String,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: String,
      },
    ],
  },
  { timestamps: true }
);

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
messageSchema.index({ groupId: 1, roomId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
