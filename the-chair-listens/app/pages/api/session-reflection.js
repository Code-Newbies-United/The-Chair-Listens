// pages/api/session-reflection.js
//
// POST /api/session-reflection : one warm summary of a whole session.
import Groq from 'groq-sdk';
import { methodNotAllowed, badRequest } from '@/lib/apiErrors';
import { checkRateLimit, getSessionIdFromHeader } from '@/lib/apiGuard';
import { parseResponseBody } from '@/lib/validators';
import { resolvePathway } from '@/lib/pathwayGuard';
import {
  anyTextTriggersSafety,
  CRISIS_REFLECTION,
  CRISIS_TAKEAWAYS,
} from '@/lib/safety';
import { reportServerError } from '@/lib/monitor';

// Next.js rejects bigger bodies (413) before this code runs. Must be a literal.
// maxDuration (seconds) stops a stuck request running for minutes on Vercel.
export const config = {
  api: { bodyParser: { sizeLimit: '256kb' } },
  maxDuration: 30,
};

// Without these, the SDK waits up to 60 s and retries twice (about 3 minutes).
// 15 s and one retry keeps a slow Groq from tying up the function.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 15_000,
  maxRetries: 1,
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

  // Safety backstop (see /api/groq): if ANY answer looks like a crisis
  // disclosure, do not ask the AI to summarise the session. Reply with fixed,
  // human-written text and flag it.
  if (anyTextTriggersSafety(answers.map((item) => item.answer))) {
    return res.status(200).json({
      overallReflection: CRISIS_REFLECTION,
      takeaways: CRISIS_TAKEAWAYS,
      crisis: true,
    });
  }

  // The pathway must exist (FIX-16). Inactive is fine: see /api/groq.
  const pathway = await resolvePathway(res, script, { includeInactive: true });
  if (!pathway) return;

  const systemPrompt = `You are \"The Chair Listens\", an empathetic, grounded AI listener for a community initiative in South Africa.
Analyze all provided participant answers and create a JSON object containing:
1. \"overallReflection\": A warm, validating 2-3 sentence summary of their session journey.
2. \"takeaways\": An array of 2-3 concise, key takeaways or insights derived from their answers.

Your response MUST be a valid JSON object matching this schema:
{
  \"overallReflection\": \"string\",
  \"takeaways\": [\"string\", \"string\"]
}`;

  // Label and description give the model context for ANY pathway, including
  // ones added after this code was deployed.
  const userPrompt = `
Pathway: ${pathway.label}${pathway.description ? ` (${pathway.description})` : ''}
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
    // Report only the error type and status: a model error body can echo
    // user text, so the message itself is deliberately NOT sent.
    reportServerError(
      new Error(`session-reflection failed: ${error?.name} ${error?.status ?? ''}`),
      { route: 'session-reflection' },
    );
    // The reflection page can still show something kind if the AI is down.
    return res.status(500).json(FALLBACK);
  }
}
