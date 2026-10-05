const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function generate({ system, prompt, json = false, temperature = 0.3 }) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  if (json) body.generationConfig.responseMimeType = "application/json";

  const res = await fetch(`${BASE}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(`Gemini error ${res.status}`);
    err.status = res.status;
    err.details = await res.text();
    throw err;
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  if (!text) throw new Error("AI returned an empty response");
  return text;
}