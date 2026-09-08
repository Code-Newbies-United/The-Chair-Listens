// pages/api/groq.js

const SYSTEM_PROMPTS = {
  men_mental_health:
    "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. Respond in 3-5 full sentences, speaking directly to the man who just answered. Do not give medical advice or diagnoses.",
  ally_support:
    "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. This response is from someone supporting a man in their life. Respond in 3-5 full sentences, acknowledging their care and perspective. Do not give medical advice or diagnoses.",
  fast_track_activations:
    "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens, responding at a live event. Keep your response to 2-3 full short sentences. Do not give medical advice or diagnoses.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { script, question, answer } = req.body;

  if (typeof answer !== "string" || !answer.trim()) {
    return res.status(400).json({ message: "answer must be a non-empty string" });
  }

  const systemPrompt = SYSTEM_PROMPTS[script] || SYSTEM_PROMPTS.men_mental_health;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b", 
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Question asked: "${question}"\n\nTheir answer: "${answer}"\n\nOffer a short, supportive reflection.`,
          },
        ],
        max_tokens: 150,
      }),
    });

    if (!groqRes.ok) {
      const errorBody = await groqRes.text();
      console.error("Groq API error:", groqRes.status, errorBody);
      return res.status(502).json({ message: "Groq API request failed", detail: errorBody });
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Unexpected error calling Groq:", err);
    return res.status(500).json({ message: "Unexpected server error" });
  }
}