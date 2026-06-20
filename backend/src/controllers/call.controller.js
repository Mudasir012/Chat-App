import { pusher } from "../lib/pusher.js";
import { generateKitTokenForTest } from "../lib/zego.js";

export const getCallToken = async (req, res) => {
  try {
    const { roomId } = req.body;
    const user = req.user;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
      return res.status(500).json({ message: "Zego credentials not configured" });
    }

    const token = generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user._id.toString(),
      user.fullName || "Guest"
    );

    res.status(200).json({ token, appID });
  } catch (error) {
    console.error("Error generating call token:", error.message);
    res.status(500).json({ message: "Failed to generate call token" });
  }
};

export const inviteCall = async (req, res) => {
  try {
    const { to, from, type, roomId } = req.body;
    pusher.trigger(`private-user-${to}`, "call:invite", { from, type, roomId });
    res.status(200).json({ message: "Call invited" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptCall = async (req, res) => {
  try {
    const { to } = req.body;
    pusher.trigger(`private-user-${to}`, "call:accepted", {});
    res.status(200).json({ message: "Call accepted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const declineCall = async (req, res) => {
  try {
    const { to } = req.body;
    pusher.trigger(`private-user-${to}`, "call:declined", {});
    res.status(200).json({ message: "Call declined" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const endCall = async (req, res) => {
  try {
    const { to } = req.body;
    pusher.trigger(`private-user-${to}`, "call:ended", {});
    res.status(200).json({ message: "Call ended" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
