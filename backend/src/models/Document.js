import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number },
    text: { type: String, required: true, select: false },
    charCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;