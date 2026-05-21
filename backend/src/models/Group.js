import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rooms: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["text", "voice", "board"],
          default: "text",
        },
        topic: {
          type: String,
          default: "",
        },
      },
    ],
    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

groupSchema.pre("save", async function (next) {
  if (!this.inviteCode) {
    const crypto = await import("crypto");
    this.inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  }
  next();
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
