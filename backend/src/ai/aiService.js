import * as gemini from "./providers/gemini.js";

const providers = { gemini };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stripFences = (s) =>
  s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

export async function generateText(options) {
  const provider = providers[process.env.AI_PROVIDER || "gemini"];
  if (!provider) throw new Error("Unknown AI_PROVIDER");

  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await provider.generate(options);
    } catch (error) {
      lastError = error;
      const temporary = error.status === 503 || error.status === 500;
      if (!temporary) throw error;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastError;
}

export async function generateJSON(options) {
  const raw = await generateText({ ...options, json: true });
  try {
    return JSON.parse(stripFences(raw));
  } catch {
    throw new Error("AI returned invalid JSON");
  }
}

export function friendlyAiError(error) {
  if (error.status === 404)
    return "AI model not found. Change GEMINI_MODEL in .env to a model your key supports.";
  if (error.status === 429) return "AI rate limit reached. Wait a minute and try again.";
  if (error.status === 400 || error.status === 403)
    return "AI request rejected. Check GEMINI_API_KEY and GEMINI_MODEL in .env.";
  if (error.status === 503 || error.status === 500)
    return "The AI service is busy right now. Please try again in a moment.";
  return error.message || "AI request failed";
}