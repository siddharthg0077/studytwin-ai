import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";
import { getStatus } from "../utils/topicStatus.js";

export const createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const subject = await Subject.create({ user: req.user._id, name });
    res.status(201).json(subject);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Subject already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const subject = await Subject.findOne({ _id: req.params.subjectId, user: req.user._id });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const topic = await Topic.create({
      user: req.user._id,
      subject: subject._id,
      name,
    });
    res.status(201).json(topic);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Topic already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      user: req.user._id,
      subject: req.params.subjectId,
    }).sort({ createdAt: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOverview = async (req, res) => {
  try {
    const [subjects, topics] = await Promise.all([
      Subject.find({ user: req.user._id }).sort({ createdAt: -1 }).lean(),
      Topic.find({ user: req.user._id }).sort({ createdAt: 1 }).lean(),
    ]);

    const result = subjects.map((s) => ({
      ...s,
      topics: topics.filter((t) => String(t.subject) === String(s._id)),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTopicScore = async (req, res) => {
  try {
    const { score } = req.body;
    if (typeof score !== "number" || score < 0 || score > 100) {
      return res.status(400).json({ message: "Score must be a number from 0 to 100" });
    }

    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.topicId, user: req.user._id },
      { score, status: getStatus(score) },
      { new: true }
    );
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.topicId)) {
      return res.status(400).json({ message: "Invalid topic id" });
    }
    const topic = await Topic.findOneAndDelete({
      _id: req.params.topicId,
      user: req.user._id,
    });
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json({ message: "Topic deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};