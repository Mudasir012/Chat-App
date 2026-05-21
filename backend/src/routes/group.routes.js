import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  inviteToGroup,
  joinByInviteCode,
  leaveGroup,
  createRoom,
  deleteRoom,
  getGroupMessages,
  sendGroupMessage,
  getGroupInvites,
  getGroupTasks,
  createGroupTask,
  updateGroupTask,
  deleteGroupTask,
} from "../controllers/group.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/invites", getGroupInvites);
router.get("/:groupId", getGroupById);
router.post("/:groupId/invite", inviteToGroup);
router.post("/join", joinByInviteCode);
router.post("/:groupId/leave", leaveGroup);
router.post("/:groupId/rooms", createRoom);
router.delete("/:groupId/rooms/:roomName", deleteRoom);
router.get("/:groupId/rooms/:roomName/messages", getGroupMessages);
router.post("/:groupId/rooms/:roomName/messages", sendGroupMessage);

// Task Board Routes
router.get("/:groupId/rooms/:roomName/tasks", getGroupTasks);
router.post("/:groupId/rooms/:roomName/tasks", createGroupTask);
router.put("/:groupId/tasks/:taskId", updateGroupTask);
router.delete("/:groupId/tasks/:taskId", deleteGroupTask);

export default router;
