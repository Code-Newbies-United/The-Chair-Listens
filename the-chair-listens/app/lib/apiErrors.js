// lib/apiErrors.js
//
// One JSON error shape for every API route (FIX-11):
//   { error: "Short title", message: "Sentence a person can read", ...extra }
// `extra` is `issues` for 400s and `retryAfterSeconds` for 429s.

export function sendError(res, status, error, message, extra = {}) {
  return res.status(status).json({ error, message, ...extra });
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed);
  return sendError(
    res,
    405,
    'Method Not Allowed',
    `Only ${allowed} requests are accepted on this endpoint`,
  );
}

export function badRequest(
  res,
  issues,
  message = 'The request was not valid.',
) {
  return sendError(res, 400, 'Bad Request', message, { issues });
}

export function tooManyRequests(res, retryAfterSeconds) {
  res.setHeader('Retry-After', String(retryAfterSeconds));
  return sendError(
    res,
    429,
    'Too Many Requests',
    'Too many requests. Please wait a moment and try again.',
    { retryAfterSeconds },
  );
}
