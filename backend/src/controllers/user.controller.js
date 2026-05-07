import User from "../models/User.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const loggedInUserId = req.user._id;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        {
          $or: [
            { fullName: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      ],
    }).select("-password").limit(10);

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

    if (userIdToBlock === loggedInUserId.toString()) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const user = await User.findById(loggedInUserId);
    if (!user.blockedUsers.includes(userIdToBlock)) {
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

    const user = await User.findById(loggedInUserId);
    user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== userIdToUnblock);
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error in unblockUser: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("blockedUsers", "-password");
    res.status(200).json(user.blockedUsers);
  } catch (error) {
    console.error("Error in getBlockedUsers: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
