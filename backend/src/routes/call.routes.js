import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { inviteCall, acceptCall, declineCall, endCall, getCallToken } from "../controllers/call.controller.js";

const router = express.Router();

router.post("/token", protectRoute, getCallToken);
router.post("/invite", protectRoute, inviteCall);
router.post("/accept", protectRoute, acceptCall);
router.post("/decline", protectRoute, declineCall);
router.post("/end", protectRoute, endCall);

export default router;
