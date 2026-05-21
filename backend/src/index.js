import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB, ensureDbConnected } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import callRoutes from "./routes/call.routes.js";
import groupRoutes from "./routes/group.routes.js";
import { pusher } from "./lib/pusher.js";
import { protectRoute } from "./middleware/auth.middleware.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: '10mb' })); // support larger image uploads
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));

app.use("/api/auth", ensureDbConnected, authRoutes);
app.use("/api/messages", ensureDbConnected, messageRoutes);
app.use("/api/users", ensureDbConnected, userRoutes);
app.use("/api/calls", ensureDbConnected, callRoutes);
app.use("/api/groups", ensureDbConnected, groupRoutes);
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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
  });
} else {
  connectDB().catch(() => {});
}

export default app;
