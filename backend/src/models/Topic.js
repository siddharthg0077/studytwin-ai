import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Topic name is required"],
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["new", "weak", "medium", "strong"],
      default: "new",
    },
  },
  { timestamps: true }
);

topicSchema.index({ user: 1, subject: 1, name: 1 }, { unique: true });

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;