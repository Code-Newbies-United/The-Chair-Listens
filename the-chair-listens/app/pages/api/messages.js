// pages/api/messages.js
//
// Community messages left on the reflection page.
//   GET  : the latest visible messages (public, read-only)
//   POST : leave a message; needs a valid consent session (x-session-id header)
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { MAX_MESSAGE_CHARS } from '@/lib/limits';
import {
  methodNotAllowed,
  badRequest,
  sendError,
} from '@/lib/apiErrors';
import { checkRateLimit, getSessionIdFromHeader } from '@/lib/apiGuard';
import { parseMessageBody } from '@/lib/validators';
import { verifyConsentSession } from '@/lib/consentSession';

// Next.js rejects bigger bodies (413) before this code runs. Must be a literal.
export const config = { api: { bodyParser: { sizeLimit: '8kb' } } };

const MAX_MESSAGES_TO_RETURN = 20;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!(await checkRateLimit(req, res, 'messages'))) return;

    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('id, message, created_at')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(MAX_MESSAGES_TO_RETURN);

    if (error) {
      console.error('Failed to fetch community messages:', error);
      return sendError(
        res,
        500,
        'Connection failed',
        'Failed to load messages.',
      );
    }

    return res.status(200).json({ messages: data ?? [] });
  }

  if (req.method === 'POST') {
    const sessionId = getSessionIdFromHeader(req);
    if (!(await checkRateLimit(req, res, 'messages', { sessionId }))) return;

    const parsed = parseMessageBody(req.body);
    if (!parsed.ok) {
      return badRequest(res, parsed.issues, 'Please enter a message of up to ' + MAX_MESSAGE_CHARS + ' characters.');
    }

    const consent = await verifyConsentSession(sessionId);
    if (!consent.ok) {
      if (consent.status === 500) {
        return sendError(
          res,
          500,
          'Connection failed',
          'Could not verify your consent session.',
        );
      }
      return sendError(
        res,
        403,
        'Consent required',
        'Please complete the consent step before leaving a message.',
      );
    }

    // The text stored is the trimmed text that was validated.
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        message: parsed.data.message.trim(),
        session_id: consent.session.id,
        is_visible: true,
      })
      .select('id, message, created_at')
      .single();

    if (error) {
      console.error('Failed to save community message:', error);
      return sendError(
        res,
        500,
        'Connection failed',
        'Failed to save your message. Please try again.',
      );
    }

    return res.status(201).json({ success: true, message: data });
  }

  return methodNotAllowed(res, 'GET, POST');
}
