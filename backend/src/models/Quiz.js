import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "truefalse", "short"], required: true },
  question: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
  explanation: { type: String, default: "" },
});

const attemptSchema = new mongoose.Schema(
  {
    answers: [String],
    results: [
      {
        correct: Boolean,
        points: Number,
        feedback: String,
      },
    ],
    percent: Number,
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    topicName: String,
    questions: [questionSchema],
    attempts: [attemptSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);