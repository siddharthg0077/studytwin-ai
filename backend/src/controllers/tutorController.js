import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import { findRelevantNotes } from "../services/notesSearch.js";
import { buildTutorSystem, buildHistoryPrompt } from "../ai/promptBuilder.js";
import { generateText, friendlyAiError } from "../ai/aiService.js";

export const chat = async (req, res) => {
  try {
    const { conversationId, topic = "", mode = "beginner", message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    let convo;
    if (conversationId) {
      if (!mongoose.isValidObjectId(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation id" });
      }
      convo = await Conversation.findOne({ _id: conversationId, user: req.user._id });
      if (!convo) return res.status(404).json({ message: "Conversation not found" });
      convo.mode = mode;
    } else {
      convo = new Conversation({
        user: req.user._id,
        topic,
        mode,
        title: (topic || message).slice(0, 60),
      });
    }

    const notes = await findRelevantNotes(req.user._id, `${topic} ${message}`);
    const system = buildTutorSystem({ mode, topic: convo.topic || topic, notes });
    const prompt = buildHistoryPrompt(convo.messages, message.trim());

    const reply = await generateText({ system, prompt, temperature: 0.5 });

    convo.messages.push({ role: "user", content: message.trim() });
    convo.messages.push({ role: "assistant", content: reply });
    await convo.save();

    res.json({
      conversationId: convo._id,
      reply,
      sources: [...new Set(notes.map((n) => n.source))],
    });
  } catch (error) {
    console.error("Tutor failed:", error.details || error.message);
    res.status(500).json({ message: friendlyAiError(error) });
  }
};

export const listConversations = async (req, res) => {
  const convos = await Conversation.find({ user: req.user._id })
    .select("title topic mode updatedAt")
    .sort({ updatedAt: -1 })
    .limit(30);
  res.json(convos);
};

export const getConversation = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid conversation id" });
  }
  const convo = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!convo) return res.status(404).json({ message: "Conversation not found" });
  res.json(convo);
};