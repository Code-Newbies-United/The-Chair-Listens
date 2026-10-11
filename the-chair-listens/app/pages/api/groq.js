// pages/api/groq.js
import { methodNotAllowed, badRequest, sendError } from '@/lib/apiErrors';
import { checkRateLimit, getSessionIdFromHeader } from '@/lib/apiGuard';
import { parseGroqBody } from '@/lib/validators';

// Next.js rejects bigger bodies (413) before this code runs. Must be a literal.
export const config = { api: { bodyParser: { sizeLimit: '32kb' } } };

const SYSTEM_PROMPTS = {
  men_mental_health:
    "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. Respond in 2-3 sentences, speaking directly to the man who just answered. Do not give medical advice or diagnoses.",
  ally_support:
    "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. This response is from someone supporting a man in their life. Respond in 2-3 sentences, acknowledging their care and perspective. Do not give medical advice or diagnoses.",
  fast_track_activations:
    "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens, responding at a live event. Keep your response to 1-2 short sentences. Do not give medical advice or diagnoses.",
};

export default async function handler(req, res) {
  // 1. Method check
  if (req.method !== 'POST') {
    return methodNotAllowed(res, 'POST');
  }

  // 2. Rate limit (INSIDE the handler, so req/res exist): per IP and per session
  const sessionId = getSessionIdFromHeader(req);
  if (!(await checkRateLimit(req, res, 'groq', { sessionId }))) return;

  // 3. Validate input
  const parsed = parseGroqBody(req.body);
  if (!parsed.ok) {
    return badRequest(res, parsed.issues);
  }
  const { script, question, answer } = parsed.data;

  const systemPrompt =
    SYSTEM_PROMPTS[script] || SYSTEM_PROMPTS.men_mental_health;

  // 4. Call Groq
  try {
    const groqRes = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b', // verify against Groq's current model list
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Question asked: "${question}"\n\nTheir answer: "${answer}"\n\nOffer a short, supportive reflection.`,
            },
          ],
          max_tokens: 150,
        }),
      },
    );

    if (!groqRes.ok) {
      const errorBody = await groqRes.text();
      console.error('Groq API error:', groqRes.status, errorBody);
      return sendError(res, 502, 'Bad Gateway', 'Groq API request failed');
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ text });
  } catch (err) {
    console.error('Unexpected error calling Groq:', err);
    return sendError(res, 500, 'Server error', 'Unexpected server error');
  }
}
