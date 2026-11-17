// sentry.server.config.js
//
// Server-side error monitoring. Switched off unless SENTRY_DSN is set.
// What gets stripped before sending is in lib/sentryScrub.js: request bodies,
// cookies, query strings, user info and console output never leave the server.
import * as Sentry from '@sentry/nextjs';
import { SHARED_SENTRY_OPTIONS } from './lib/sentryScrub';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  ...SHARED_SENTRY_OPTIONS,
});
