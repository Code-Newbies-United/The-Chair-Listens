// pages/api/session-reflection.js
//
// POST /api/session-reflection : one warm summary of a whole session.
import Groq from 'groq-sdk';
import { methodNotAllowed, badRequest } from '@/lib/apiErrors';
import { checkRateLimit, getSessionIdFromHeader } from '@/lib/apiGuard';
import { parseResponseBody } from '@/lib/validators';

// Next.js rejects bigger bodies (413) before this code runs. Must be a literal.
export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const FALLBACK = {
  overallReflection:
    'Thank you for taking the time to pause and share your thoughts today.',
  takeaways: [
    'Your experiences and feelings are valid.',
    'Taking time for self-reflection is an important step forward.',
  ],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, 'POST');
  }

  // Rate limit INSIDE the handler: per IP (shared wifi) and per session (one person).
  const sessionId = getSessionIdFromHeader(req);
  if (!(await checkRateLimit(req, res, 'sessionReflection', { sessionId })))
    return;

  // Validate before spending a paid API call.
  const parsed = parseResponseBody(req.body);
  if (!parsed.ok) {
    return badRequest(res, parsed.issues);
  }
  const { script, answers } = parsed.data;

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
Pathway: ${script}
Session Answers:
${JSON.stringify(answers, null, 2)}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsedData = JSON.parse(content);

    return res.status(200).json({
      overallReflection:
        parsedData.overallReflection || FALLBACK.overallReflection,
      takeaways: parsedData.takeaways || FALLBACK.takeaways,
    });
  } catch (error) {
    // Don't log the answers; they are sensitive.
    console.error('Session Reflection API Error:', error?.message || error);
    // The reflection page can still show something kind if the AI is down.
    return res.status(500).json(FALLBACK);
  }
}
