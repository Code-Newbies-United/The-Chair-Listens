// lib/consentVersion.js
//
// BUMP CONSENT_VERSION whenever the consent wording changes in a meaningful way:
//   - the checkbox sentence in pages/index.jsx, or
//   - the full notice in pages/consent-terms.jsx
// e.g. "2026-10-v1" -> "2026-11-v2". Every session records the version the person
// actually agreed to, so you can always show who agreed to which wording.
export const CONSENT_VERSION = "2026-10-v1";

// A consent session stops being accepted this many hours after consent.
export const SESSION_MAX_AGE_HOURS = 6;

// Stops one session being used to flood the archive.
export const MAX_RESPONSES_PER_SESSION = 5;
