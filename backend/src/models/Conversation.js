import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New chat" },
    topic: { type: String, default: "" },
    mode: { type: String, enum: ["beginner", "intermediate", "exam"], default: "beginner" },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);