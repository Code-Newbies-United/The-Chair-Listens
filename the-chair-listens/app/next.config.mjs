import { withSentryConfig } from "@sentry/nextjs/config";

// Basic browser security headers. A Content-Security-Policy is deliberately NOT
// included yet: it needs to be tested against the map tiles, fonts and the
// voice recorder, and a wrong one would break the site on launch day.
//
// Permissions-Policy: the microphone is needed for voice answers and the
// location button is needed on the admin "Set location" page. Everything else
// is switched off.
const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(self), geolocation=(self)',
    },
];

const nextConfig = {
    allowedDevOrigins: ['192.168.0.221'],
    poweredByHeader: false,
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }];
    },
};

// Sentry wrapper. With no SENTRY_DSN set the app still builds and runs; the
// wrapper only adds the hooks, and nothing is sent anywhere.
export default withSentryConfig(nextConfig, {
    // Keep build logs quiet and send nothing about the build to Sentry.
    silent: true,
    telemetry: false,
    // Source maps (readable stack traces) are uploaded only when these are set:
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
});
