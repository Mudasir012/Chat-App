import mongoose from "mongoose";

let cachedDb = null;

export const connectDB = async () => {
  if (cachedDb) return cachedDb;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    cachedDb = conn;
    return conn;
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

export const ensureDbConnected = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
};
