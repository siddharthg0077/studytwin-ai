import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Topic from "../models/Topic.js";
import Subject from "../models/Subject.js";
import { findRelevantNotes } from "../services/notesSearch.js";
import { generateQuiz } from "../ai/quizGenerator.js";
import { gradeShortAnswer } from "../ai/answerEvaluator.js";
import { friendlyAiError } from "../ai/aiService.js";
import { getStatus } from "../utils/topicStatus.js";

const stripAnswers = (quiz) => ({
  _id: quiz._id,
  topicName: quiz.topicName,
  questions: quiz.questions.map((q) => ({
    _id: q._id,
    type: q.type,
    question: q.question,
    options: q.options,
  })),
});

export const generate = async (req, res) => {
  try {
    const { topicId, count = 5 } = req.body;
    if (!mongoose.isValidObjectId(topicId)) {
      return res.status(400).json({ message: "Invalid topic id" });
    }
    const topic = await Topic.findOne({ _id: topicId, user: req.user._id });
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const subject = await Subject.findById(topic.subject);

    const n = Math.min(Math.max(Number(count) || 5, 3), 10);
    const notes = await findRelevantNotes(req.user._id, `${topic.name} ${subject?.name || ""}`, 5);
    const questions = await generateQuiz({
      topic: topic.name,
      subject: subject?.name || "",
      notes,
      count: n,
    });

    const quiz = await Quiz.create({
      user: req.user._id,
      topic: topic._id,
      topicName: topic.name,
      questions,
    });
    res.status(201).json(stripAnswers(quiz));
  } catch (error) {
    console.error("Quiz generate failed:", error.details || error.message);
    res.status(500).json({ message: friendlyAiError(error) });
  }
};

export const submit = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz id" });
    }
    const { answers } = req.body;
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Provide one answer per question" });
    }

    const results = [];
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      const given = String(answers[i] ?? "");
      let points = 0;
      let feedback = q.explanation;

      if (q.type === "short") {
        const g = await gradeShortAnswer({
          question: q.question,
          modelAnswer: q.answer,
          studentAnswer: given,
        });
        points = g.score;
        feedback = g.feedback;
      } else {
        points = given.trim().toLowerCase() === q.answer.trim().toLowerCase() ? 1 : 0;
      }

      results.push({
        question: q.question,
        type: q.type,
        yourAnswer: given,
        correctAnswer: q.answer,
        points,
        correct: points >= 0.99,
        feedback,
      });
    }

    const total = results.reduce((s, r) => s + r.points, 0);
    const percent = Math.round((total / results.length) * 100);

    quiz.attempts.push({
      answers: answers.map(String),
      results: results.map((r) => ({ correct: r.correct, points: r.points, feedback: r.feedback })),
      percent,
    });
    await quiz.save();

    // Update the StudyTwin: blend the new result into the topic score
    const topic = await Topic.findById(quiz.topic);
    if (topic) {
      const newScore =
        topic.status === "new" ? percent : Math.round(topic.score * 0.4 + percent * 0.6);
      topic.score = newScore;
      topic.status = getStatus(newScore);
      await topic.save();
    }

    res.json({ percent, results, topicScore: topic?.score, topicStatus: topic?.status });
  } catch (error) {
    console.error("Quiz submit failed:", error.details || error.message);
    res.status(500).json({ message: friendlyAiError(error) });
  }
};