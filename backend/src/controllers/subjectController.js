import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";

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