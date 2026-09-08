import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { script, answers } = req.body;

  // System prompt tailored for empathetic listening and support
  const systemPrompt = `You are "The Chair Listens", a compassionate, 
  non-judgmental AI listener for a community mental health initiative in South Africa. 
Your tone is warm, grounded, validating, and empathetic. 
Avoid sounding like a clinical diagnosis or offering toxic positivity. 
Acknowledge what the participant shared and offer gentle encouragement.
Keep your response concise (2-3 short paragraphs maximum).`;

  // Format user answers into readable text
  const formattedAnswers = Object.entries(answers || {})
    .map(([qId, response]) => `- ${qId}: "${response}"`)
    .join("\n");

  const userPrompt = `
Pathway: ${script}
Participant's Responses:
${formattedAnswers}

Provide a thoughtful, validating response addressing what they shared.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "Thank you for sharing your heart today.";
    return res.status(200).json({ text: reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({ message: "Failed to generate AI response" });
  }
}