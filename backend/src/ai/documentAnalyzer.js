import { generateJSON } from "./aiService.js";

const MAX_CHARS = 30000;

const SYSTEM = `You are an expert academic content analyzer.
You read student study material and extract its structure.
Rules:
- Respond with JSON only, exactly in the requested format.
- "subject" is a short course name (for example "DBMS", "Operating Systems").
- "topics" are 4 to 12 specific topics that actually appear in the text, ordered as they appear.
- Topic names are short (1 to 4 words) and never repeat.
- Never invent topics that are not in the material.
- Topics must be real, learnable concepts. Never include headings like "Introduction", "Summary", "Quick Comparison", "Exam Tips", "Overview", "What is ..." or "Other ...".
- Prefer concise names, for example "BCNF" instead of "Boyce-Codd Normal Form (BCNF)".`;

export async function analyzeDocument(text) {
  const material = text.slice(0, MAX_CHARS);

  const prompt = `Analyze this study material.

Return JSON in exactly this format:
{
  "subject": "string",
  "topics": ["string"],
  "difficulty": "Easy" | "Medium" | "Hard",
  "keyConcepts": ["string"]
}

"keyConcepts" has 5 to 10 important terms or definitions from the text.

MATERIAL:
"""
${material}
"""`;

  const result = await generateJSON({ system: SYSTEM, prompt, temperature: 0.2 });

  const topics = [...new Set((result.topics || []).map((t) => String(t).trim()))]
    .filter(Boolean)
    .slice(0, 12);

  if (!result.subject || topics.length === 0) {
    throw new Error("Could not find a subject or topics in this document");
  }

  return {
    subject: String(result.subject).trim(),
    topics,
    difficulty: ["Easy", "Medium", "Hard"].includes(result.difficulty)
      ? result.difficulty
      : "Medium",
    keyConcepts: (result.keyConcepts || []).map(String).slice(0, 10),
  };
}