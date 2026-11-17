// lib/monitor.js
//
// One place to report a server error to Sentry.
//
//   * Does NOTHING unless SENTRY_DSN is set, so local development and the unit
//     tests never touch Sentry.
//   * Loads @sentry/nextjs lazily, so a missing or broken Sentry install can
//     never stop an API route from answering.
//   * Never throws and never blocks the response.
//   * Send only an Error or a short label. Never pass what a visitor typed,
//     answers, transcripts or messages: they are sensitive.

export function reportServerError(error, tags = {}) {
  if (!process.env.SENTRY_DSN) return;

  const err = error instanceof Error ? error : new Error(String(error));

  import('@sentry/nextjs')
    .then((Sentry) => Sentry.captureException(err, { tags }))
    .catch(() => {
      // Monitoring must never break the app.
    });
}
