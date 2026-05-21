import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // don't silently continue
  }
};

export const ensureDbConnected = async (req, res, next) => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    next();
  } catch (error) {
    console.error("DB connection failed in middleware:", error.message);
    res.status(503).json({ message: "Database unavailable, try again later" });
  }
};  