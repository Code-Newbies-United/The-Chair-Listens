import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { methodNotAllowed, sendError } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';

/**
 * GET /api/quiz-questions
 * Public, read-only. Returns all quiz questions, ordered.
 *
 * Uses the service-role client server-side, same reasoning as
 * pages/api/questions.js — no public SELECT policy exists on this
 * table, so the anon client would silently return zero rows.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, 'GET');
  }

  if (!(await checkRateLimit(req, res, 'quizQuestions'))) return;

  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, question_text, options, explanation, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Public quiz questions fetch error:', error);
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to load quiz questions',
    );
  }

  return res.status(200).json({ questions: data || [] });
}
