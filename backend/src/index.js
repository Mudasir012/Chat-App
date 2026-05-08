import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import callRoutes from "./routes/call.routes.js";
import { pusher } from "./lib/pusher.js";
import { protectRoute } from "./middleware/auth.middleware.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' })); // support larger image uploads
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/calls", callRoutes);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


app.post("/api/pusher/auth", protectRoute, (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: req.user._id.toString(),
    user_info: {
      fullName: req.user.fullName,
      profilePic: req.user.profilePic,
    },
  };
  
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.send(authResponse);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
  });
} else {
  // Connect to DB for Vercel serverless functions
  connectDB();
}

export default app;
