import { generateJSON } from "./aiService.js";

const SYSTEM = `You are a fair examiner grading a student's short answer.
Respond with JSON only: {"score": number between 0 and 1, "feedback": "string"}.
Score 1 = fully correct, 0.5 = partially correct, 0 = wrong or empty.
Feedback is 1 to 2 sentences: say what was right and what key idea was missing.`;

export async function gradeShortAnswer({ question, modelAnswer, studentAnswer }) {
  if (!studentAnswer || !studentAnswer.trim()) {
    return { score: 0, feedback: "No answer given." };
  }
  const prompt = `Question: ${question}
Model answer: ${modelAnswer}
Student answer: ${studentAnswer}`;

  const r = await generateJSON({ system: SYSTEM, prompt, temperature: 0.1 });
  const score = Math.min(1, Math.max(0, Number(r.score) || 0));
  return { score, feedback: String(r.feedback || "") };
}