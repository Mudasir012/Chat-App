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

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);

    // Mark messages as read
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in markAsRead controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Remove existing reaction from this user if any
    message.reactions = message.reactions.filter((r) => r.userId.toString() !== userId.toString());

    message.reactions.push({ userId, emoji });
    await message.save();

    // Notify other user via Pusher
    const otherUserId = message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId;
    pusher.trigger(`private-user-${otherUserId}`, "messageReaction", { messageId, userId, emoji });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in addReaction controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check if blocked
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (sender.blockedUsers.includes(receiverId)) {
      return res.status(400).json({ message: "You have blocked this user" });
    }
    if (receiver.blockedUsers.includes(senderId)) {
      return res.status(400).json({ message: "This user has blocked you" });
    }

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Notify receiver via Pusher
    pusher.trigger(`private-user-${receiverId}`, "newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const clearMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.log("Error in clearMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendTyping = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    pusher.trigger(`private-user-${receiverId}`, "userTyping", { from: myId });
    res.status(200).json({ message: "Typing event sent" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
