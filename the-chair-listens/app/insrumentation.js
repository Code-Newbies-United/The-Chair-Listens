// instrumentation.js (project root, next to package.json)
//
// Next.js runs register() once when the server starts. It switches on Sentry
// error monitoring for server code. Without SENTRY_DSN nothing is sent.
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
}

// Reports errors thrown in API routes and pages that nothing else caught.
export const onRequestError = Sentry.captureRequestError;
