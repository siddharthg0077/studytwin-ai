import { generateJSON } from "./aiService.js";

const SYSTEM = `You are an expert exam setter.
Create quiz questions about ONE topic, based mainly on the provided notes.
Rules:
- Respond with JSON only, in exactly the requested format.
- Questions must be clear, unambiguous and test understanding, not trivia.
- For "mcq": exactly 4 options, and "answer" is the exact text of the correct option.
- For "truefalse": "options" is ["True","False"] and "answer" is "True" or "False".
- For "short": "options" is [] and "answer" is a model answer of 1 to 3 sentences.
- Every question has a one-sentence "explanation".
- Do not repeat questions.`;

export async function generateQuiz({ topic, subject, notes, count = 5 }) {
  const notesText = notes.length ? notes.map((n) => n.text).join("\n\n") : "No notes available.";

  const prompt = `Subject: ${subject}
Topic: ${topic}
Number of questions: ${count}
Mix: mostly "mcq", at least one "truefalse", and one "short".

Return JSON in exactly this format:
{
  "questions": [
    {
      "type": "mcq" | "truefalse" | "short",
      "question": "string",
      "options": ["string"],
      "answer": "string",
      "explanation": "string"
    }
  ]
}

NOTES:
"""
${notesText}
"""`;

  const result = await generateJSON({ system: SYSTEM, prompt, temperature: 0.5 });

  const questions = (result.questions || [])
    .filter((q) => q && q.question && q.answer && ["mcq", "truefalse", "short"].includes(q.type))
    .map((q) => ({
      type: q.type,
      question: String(q.question),
      options: q.type === "short" ? [] : (q.options || []).map(String),
      answer: String(q.answer),
      explanation: String(q.explanation || ""),
    }))
    .filter((q) => q.type === "short" || (q.type === "truefalse" ? q.options.length === 2 : q.options.includes(q.answer)))
    .slice(0, count);

  if (questions.length === 0) throw new Error("AI did not return usable questions");
  return questions;
}