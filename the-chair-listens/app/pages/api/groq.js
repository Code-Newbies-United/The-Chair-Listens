// pages/api/groq.js
import { methodNotAllowed, badRequest, sendError } from '@/lib/apiErrors';
import { checkRateLimit, getSessionIdFromHeader } from '@/lib/apiGuard';
import { parseGroqBody } from '@/lib/validators';
import { resolvePathway } from '@/lib/pathwayGuard';
import { buildSystemPrompt } from '@/lib/pathwayShape';

// Next.js rejects bigger bodies (413) before this code runs. Must be a literal.
export const config = { api: { bodyParser: { sizeLimit: '32kb' } } };

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

  // The prompt comes from the `pathways` table (FIX-16). A visitor mid-session
  // still gets a reflection if an admin has just switched their pathway off.
  // No script at all is allowed: the default prompt is used.
  let pathway = null;
  if (script) {
    pathway = await resolvePathway(res, script, { includeInactive: true });
    if (!pathway) return;
  }
  const systemPrompt = buildSystemPrompt(pathway);

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
