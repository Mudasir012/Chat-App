import Group from "../models/Group.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import Task from "../models/Task.js";
import { pusher } from "../lib/pusher.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = new Group({
      name,
      description: description || "",
      createdBy: userId,
      members: [{ user: userId, role: "admin" }],
      rooms: [{ name: "general", type: "text", topic: "General discussion" }],
    });

    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate("members.user", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic");

    res.status(201).json({ group: populatedGroup });
  } catch (error) {
    console.log("Error in createGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ "members.user": userId })
      .populate("members.user", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getMyGroups:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId)
      .populate("members.user", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m.user._id.toString() === userId.toString());
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in getGroupById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const inviteToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const inviterId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const inviter = group.members.find((m) => m.user.toString() === inviterId.toString());
    if (!inviter || inviter.role !== "admin") {
      return res.status(403).json({ message: "Only admins can invite users" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyMember = group.members.some((m) => m.user.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    group.members.push({ user: userId, role: "member" });
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("members.user", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic");

    pusher.trigger(`private-user-${userId}`, "group:invite", {
      group: updatedGroup,
      invitedBy: req.user.fullName,
    });

    res.status(200).json({ message: "User invited successfully", group: updatedGroup });
  } catch (error) {
    console.log("Error in inviteToGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    const group = await Group.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!group) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const alreadyMember = group.members.some((m) => m.user.toString() === userId.toString());
    if (alreadyMember) {
      return res.status(400).json({ message: "You are already a member" });
    }

    group.members.push({ user: userId, role: "member" });
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("members.user", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic");

    pusher.trigger(`private-group-${group._id}`, "group:member-joined", {
      user: req.user,
    });

    res.status(200).json({ message: "Joined group successfully", group: updatedGroup });
  } catch (error) {
    console.log("Error in joinByInviteCode:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const memberIndex = group.members.findIndex((m) => m.user.toString() === userId.toString());
    if (memberIndex === -1) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    if (group.createdBy.toString() === userId.toString() && group.members.length === 1) {
      await Group.findByIdAndDelete(groupId);
      return res.status(200).json({ message: "Group deleted" });
    }

    group.members.splice(memberIndex, 1);
    await group.save();

    pusher.trigger(`private-group-${groupId}`, "group:member-left", {
      userId,
    });

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.log("Error in leaveGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, type, topic } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.members.some(
      (m) => m.user.toString() === userId.toString() && m.role === "admin"
    );
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can create rooms" });
    }

    const roomExists = group.rooms.some((r) => r.name.toLowerCase() === name.toLowerCase());
    if (roomExists) {
      return res.status(400).json({ message: "Room already exists" });
    }

    group.rooms.push({ name, type: type || "text", topic: topic || "" });
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("members.user", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic");

    pusher.trigger(`private-group-${groupId}`, "group:room-created", {
      room: group.rooms[group.rooms.length - 1],
    });

    res.status(201).json(updatedGroup);
  } catch (error) {
    console.log("Error in createRoom:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { groupId, roomName } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.members.some(
      (m) => m.user.toString() === userId.toString() && m.role === "admin"
    );
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can delete rooms" });
    }

    if (roomName.toLowerCase() === "general") {
      return res.status(400).json({ message: "Cannot delete the general room" });
    }

    group.rooms = group.rooms.filter((r) => r.name.toLowerCase() !== roomName.toLowerCase());
    await group.save();

    await Message.deleteMany({ groupId, roomId: roomName });

    pusher.trigger(`private-group-${groupId}`, "group:room-deleted", { roomName });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log("Error in deleteRoom:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId, roomName } = req.params;

    const messages = await Message.find({ groupId, roomId: roomName })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getGroupMessages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId, roomName } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m.user.toString() === senderId.toString());
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const roomExists = group.rooms.some((r) => r.name.toLowerCase() === roomName.toLowerCase());
    if (!roomExists) {
      return res.status(404).json({ message: "Room not found" });
    }

    const message = new Message({
      senderId,
      groupId,
      roomId: roomName,
      text,
      image,
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "fullName profilePic"
    );

    pusher.trigger(`private-group-${groupId}`, "room:newMessage", {
      message: populatedMessage,
      roomId: roomName,
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendGroupMessage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupInvites = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ "members.user": userId })
      .populate("members.user", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic")
      .sort({ updatedAt: -1 });

    const inviteData = groups.map((group) => ({
      _id: group._id,
      name: group.name,
      icon: group.icon,
      inviteCode: group.inviteCode,
      memberCount: group.members.length,
    }));

    res.status(200).json(inviteData);
  } catch (error) {
    console.log("Error in getGroupInvites:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupTasks = async (req, res) => {
  try {
    const { groupId, roomName } = req.params;
    const tasks = await Task.find({ groupId, roomName })
      .populate("assignedTo", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getGroupTasks:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createGroupTask = async (req, res) => {
  try {
    const { groupId, roomName } = req.params;
    const { title, description, status, assignedTo } = req.body;
    const createdBy = req.user._id;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = new Task({
      groupId,
      roomName,
      title,
      description: description || "",
      status: status || "todo",
      assignedTo: assignedTo || null,
      createdBy,
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic");

    pusher.trigger(`private-group-${groupId}`, "room:task-created", {
      task: populatedTask,
      roomName,
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    console.log("Error in createGroupTask:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateGroupTask = async (req, res) => {
  try {
    const { groupId, taskId } = req.params;
    const { title, description, status, assignedTo } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    await task.save();

    const populatedTask = await Task.findById(taskId)
      .populate("assignedTo", "fullName profilePic email")
      .populate("createdBy", "fullName profilePic");

    pusher.trigger(`private-group-${groupId}`, "room:task-updated", {
      task: populatedTask,
      roomName: task.roomName,
    });

    res.status(200).json(populatedTask);
  } catch (error) {
    console.log("Error in updateGroupTask:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteGroupTask = async (req, res) => {
  try {
    const { groupId, taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const roomName = task.roomName;
    await Task.findByIdAndDelete(taskId);

    pusher.trigger(`private-group-${groupId}`, "room:task-deleted", {
      taskId,
      roomName,
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error in deleteGroupTask:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
