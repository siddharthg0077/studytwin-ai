import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import Document from "../models/Document.js";
import { extractText } from "../services/textExtractor.js";

const removeFile = (filePath) => fs.unlink(filePath).catch(() => {});

export const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const text = await extractText(req.file.path, ext);

    if (!text) {
      await removeFile(req.file.path);
      return res.status(422).json({
        message: "No readable text found. Scanned PDFs (images) are not supported yet.",
      });
    }

    const doc = await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      text,
      charCount: text.length,
    });

    res.status(201).json({
      _id: doc._id,
      originalName: doc.originalName,
      size: doc.size,
      charCount: doc.charCount,
      createdAt: doc.createdAt,
    });
  } catch (error) {
    await removeFile(req.file.path);
    res.status(500).json({ message: "Could not process file: " + error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user._id })
      .select("originalName size charCount createdAt")
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid document id" });
    }
    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    await removeFile(path.resolve("uploads", doc.storedName));
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};