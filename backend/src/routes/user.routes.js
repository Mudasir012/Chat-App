import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  searchUsers,
  blockUser,
  unblockUser,
  getBlockedUsers,
  reportUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.post("/block/:id", protectRoute, blockUser);
router.post("/unblock/:id", protectRoute, unblockUser);
router.get("/blocked", protectRoute, getBlockedUsers);
router.post("/report/:id", protectRoute, reportUser);
router.get("/profile/:id", protectRoute, getUserProfile);

export default router;
