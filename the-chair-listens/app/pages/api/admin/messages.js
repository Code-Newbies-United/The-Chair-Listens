// pages/api/admin/messages.js
//
// Admin moderation of the community messages shown on the reflection page.
//   GET    /api/admin/messages          -> every message, newest first
//   DELETE /api/admin/messages?id=<uuid> -> permanently delete one message
//
// Admin session required (signed cookie). Once a message is deleted it is gone
// from the public list immediately: /api/messages reads straight from the table.
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdminSession } from '@/lib/adminsession';
import { methodNotAllowed, sendError } from '@/lib/apiErrors';
import { isUuid } from '@/lib/validators';

const MAX_MESSAGES_FOR_ADMIN = 200;

export default async function handler(req, res) {
  if (!verifyAdminSession(req)) {
    return sendError(res, 401, 'Unauthorized', 'Admin login required.');
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('id, message, created_at')
      .order('created_at', { ascending: false })
      .limit(MAX_MESSAGES_FOR_ADMIN);

    if (error) {
      console.error('Admin messages fetch error:', error);
      return sendError(res, 500, 'Connection failed', 'Failed to load messages.');
    }

    return res.status(200).json({ messages: data ?? [] });
  }

  if (req.method === 'DELETE') {
    const id = req.query?.id;

    if (!isUuid(id)) {
      return sendError(res, 400, 'Bad Request', 'A valid message id is required.');
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      console.error('Admin message delete error:', error);
      return sendError(res, 500, 'Connection failed', 'Failed to delete the message.');
    }

    if (!data || data.length === 0) {
      return sendError(res, 404, 'Not Found', 'That message no longer exists.');
    }

    return res.status(200).json({ success: true, id });
  }

  return methodNotAllowed(res, 'GET, DELETE');
}
