// pages/api/session-reflection.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { script, answers } = req.body;

  const systemPrompt = `You are "The Chair Listens", an empathetic, grounded AI listener for a community initiative in South Africa.
Analyze all provided participant answers and create a JSON object containing:
1. "overallReflection": A warm, validating 2-3 sentence summary of their session journey.
2. "takeaways": An array of 2-3 concise, key takeaways or insights derived from their answers.

Your response MUST be a valid JSON object matching this schema:
{
  "overallReflection": "string",
  "takeaways": ["string", "string"]
}`;

  const userPrompt = `
Pathway: ${script || "men_mental_health"}
Session Answers:
${JSON.stringify(answers || [], null, 2)}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(content);

    return res.status(200).json({
      overallReflection: parsedData.overallReflection || "Thank you for taking the time to pause and share your thoughts today.",
      takeaways: parsedData.takeaways || [
        "Your experiences and feelings are valid.",
        "Taking time for self-reflection is an important step forward.",
      ],
    });
  } catch (error) {
    console.error("Session Reflection API Error:", error);
    return res.status(500).json({
      overallReflection: "Thank you for taking the time to pause and share your thoughts today.",
      takeaways: [
        "Your experiences and feelings are valid.",
        "Taking time for self-reflection is an important step forward.",
      ],
    });
  }
}