// lib/sentryScrub.js
//
// This app handles people's mental-health disclosures, so error reports must
// never carry them. These two hooks are used by BOTH Sentry configs
// (sentry.server.config.js and instrumentation-client.js).
//
// This file imports nothing, so it is easy to unit test.

/** Remove anything from an error event that could contain personal content. */
export function scrubEvent(event) {
  if (!event) return event;

  if (event.request) {
    // Request bodies hold answers, transcripts and messages.
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.query_string;
    // Keep only harmless headers (they can carry session IDs and tokens).
    const safeHeaders = {};
    for (const name of ['user-agent', 'content-type']) {
      if (event.request.headers?.[name]) {
        safeHeaders[name] = event.request.headers[name];
      }
    }
    event.request.headers = safeHeaders;
  }

  delete event.user;
  delete event.extra;
  return event;
}

/** Console output and form-field breadcrumbs can echo what someone typed. */
export function scrubBreadcrumb(breadcrumb) {
  if (!breadcrumb) return breadcrumb;
  if (breadcrumb.category === 'console') return null;
  if (breadcrumb.category?.startsWith('ui.')) return null;
  return breadcrumb;
}

// Shared Sentry options. Keep tracing low: it costs quota and adds little here.
export const SHARED_SENTRY_OPTIONS = {
  sendDefaultPii: false,
  tracesSampleRate: 0.05,
  beforeSend: scrubEvent,
  beforeBreadcrumb: scrubBreadcrumb,
};
