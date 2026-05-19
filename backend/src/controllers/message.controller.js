import User from "../models/User.js";
import Message from "../models/Message.js";

import cloudinary from "../lib/cloudinary.js";
import { pusher } from "../lib/pusher.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blockedUsers = user.blockedUsers || [];

    const filteredUsers = await User.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        { _id: { $nin: blockedUsers } },
        { blockedUsers: { $nin: [loggedInUserId] } },
      ],
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!userToChatId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Mark messages as read first, then respond
    try {
      await Message.updateMany(
        { senderId: userToChatId, receiverId: myId, isRead: false },
        { $set: { isRead: true } }
      );
    } catch (updateError) {
      // Non-critical: log but don't fail the whole request
      console.error("Error marking messages as read: ", updateError.message);
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in markAsRead controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ message: "Emoji is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Remove existing reaction from this user if any, then add new one
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== userId.toString()
    );
    message.reactions.push({ userId, emoji });
    await message.save();

    // Notify the other user via Pusher
    const otherUserId =
      message.senderId.toString() === userId.toString()
        ? message.receiverId
        : message.senderId;

    try {
      pusher.trigger(`private-user-${otherUserId}`, "messageReaction", {
        messageId,
        userId,
        emoji,
      });
    } catch (pusherError) {
      console.error("Pusher trigger failed in addReaction: ", pusherError.message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in addReaction controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (!text && !image) {
      return res.status(400).json({ message: "Message must have text or an image" });
    }

    // Fetch both users and validate existence before anything else
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Block checks
    if (sender.blockedUsers.includes(receiverId)) {
      return res.status(400).json({ message: "You have blocked this user" });
    }
    if (receiver.blockedUsers.includes(senderId.toString())) {
      return res.status(400).json({ message: "This user has blocked you" });
    }

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed: ", uploadError.message);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Notify receiver via Pusher (non-critical, don't fail the request if it errors)
    try {
      pusher.trigger(`private-user-${receiverId}`, "newMessage", newMessage);
    } catch (pusherError) {
      console.error("Pusher trigger failed in sendMessage: ", pusherError.message);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const clearMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!userToChatId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.error("Error in clearMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendTyping = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    try {
      pusher.trigger(`private-user-${receiverId}`, "userTyping", { from: myId });
    } catch (pusherError) {
      console.error("Pusher trigger failed in sendTyping: ", pusherError.message);
    }

    res.status(200).json({ message: "Typing event sent" });
  } catch (error) {
    console.error("Error in sendTyping controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};