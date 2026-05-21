import User from "../models/User.js";
import Report from "../models/Report.js";

export const reportUser = async (req, res) => {
  try {
    const { id: reportedUserId } = req.params;
    const { reason } = req.body;
    const reporterId = req.user._id;

    if (!reportedUserId) {
      return res.status(400).json({ message: "Reported user ID is required" });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    if (reportedUserId === reporterId.toString()) {
      return res.status(400).json({ message: "You cannot report yourself" });
    }

    // Make sure the reported user actually exists
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: "Reported user not found" });
    }

    const report = new Report({
      reporterId,
      reportedUserId,
      reason: reason.trim(),
    });

    await report.save();

    res.status(201).json({ message: "User reported successfully" });
  } catch (error) {
    console.error("Error in reportUser: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const loggedInUserId = req.user._id;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        {
          $or: [
            { fullName: { $regex: query.trim(), $options: "i" } },
            { username: { $regex: query.trim(), $options: "i" } },
            { email: { $regex: query.trim(), $options: "i" } },
          ],
        },
      ],
    })
      .select("-password")
      .limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id: userIdToBlock } = req.params;
    const loggedInUserId = req.user._id;

    if (!userIdToBlock) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (userIdToBlock === loggedInUserId.toString()) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    // Ensure the target user exists
    const targetUser = await User.findById(userIdToBlock);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "Logged-in user not found" });
    }

    const alreadyBlocked = user.blockedUsers.some(
      (id) => id.toString() === userIdToBlock
    );

    if (!alreadyBlocked) {
      user.blockedUsers.push(userIdToBlock);
      await user.save();
    }

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error in blockUser: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { id: userIdToUnblock } = req.params;
    const loggedInUserId = req.user._id;

    if (!userIdToUnblock) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (userIdToUnblock === loggedInUserId.toString()) {
      return res.status(400).json({ message: "You cannot unblock yourself" });
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== userIdToUnblock
    );
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error in unblockUser: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires -blockedUsers");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "blockedUsers",
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.blockedUsers);
  } catch (error) {
    console.error("Error in getBlockedUsers: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};