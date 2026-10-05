import Document from "../models/Document.js";

const STOP = new Set(["the", "a", "an", "is", "are", "of", "to", "and", "in", "what", "how", "why", "me", "teach", "explain", "about", "for", "on", "it", "this", "that"]);

const words = (s) =>
  s.toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => w.length > 1 && !STOP.has(w)) || [];

export async function findRelevantNotes(userId, query, limit = 4) {
  const docs = await Document.find({ user: userId }).select("+text originalName");
  const terms = new Set(words(query));
  if (terms.size === 0) return [];

  const scored = [];
  for (const doc of docs) {
    const paragraphs = doc.text.split(/\n{1,}/).filter((p) => p.trim().length > 30);
    for (const p of paragraphs) {
      const pw = words(p);
      let score = 0;
      for (const w of pw) if (terms.has(w)) score++;
      if (score > 0) scored.push({ score, text: p.trim().slice(0, 800), source: doc.originalName });
    }
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}