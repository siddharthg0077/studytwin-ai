import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

subjectSchema.index({ user: 1, name: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;