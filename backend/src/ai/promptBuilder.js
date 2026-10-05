const MODES = {
  beginner: "Explain in very simple language with an everyday analogy and a tiny example. Avoid jargon, or define it immediately.",
  intermediate: "Give a clear technical explanation with correct terminology and one worked example.",
  exam: "Give an exam-ready answer: a precise definition, key points as a short list, and what examiners usually look for.",
};

export function buildTutorSystem({ mode, topic, notes }) {
  const notesBlock = notes.length
    ? notes.map((n, i) => `[${i + 1}] (${n.source}) ${n.text}`).join("\n\n")
    : "No relevant notes were found.";

  return `You are StudyTwin, a personal AI tutor.
Style: ${MODES[mode] || MODES.beginner}
Current topic: ${topic || "general"}

Rules:
- Prefer the student's own notes below. When you use them, mention it naturally (for example "your notes say...").
- If the notes do not cover the question, say so briefly, then answer from general knowledge.
- Be concise. Use short paragraphs. End with one short follow-up question to check understanding.

STUDENT NOTES:
${notesBlock}`;
}

export function buildHistoryPrompt(messages, newMessage) {
  const recent = messages.slice(-10);
  const history = recent
    .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
    .join("\n");
  return `${history ? `Conversation so far:\n${history}\n\n` : ""}Student: ${newMessage}\nTutor:`;
}