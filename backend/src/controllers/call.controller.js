import { pusher } from "../lib/pusher.js";

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
