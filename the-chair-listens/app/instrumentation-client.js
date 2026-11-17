// instrumentation-client.js (project root, next to package.json)
//
// Browser-side error monitoring. Switched off unless NEXT_PUBLIC_SENTRY_DSN is set.
//
// PRIVACY: this app handles mental-health disclosures. So, on purpose:
//   * NO Session Replay (it would record what people type and say),
//   * NO request bodies, cookies, user info or console output (see lib/sentryScrub.js).
import * as Sentry from '@sentry/nextjs';
import { SHARED_SENTRY_OPTIONS } from './lib/sentryScrub';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  ...SHARED_SENTRY_OPTIONS,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});

// Lets Sentry follow page navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
