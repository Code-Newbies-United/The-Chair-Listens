// lib/safety.js
//
// ONE crisis-detection check, used by the browser (TextResponse, questions page),
// by the community-message moderation, and by the server (/api/groq and
// /api/session-reflection), so the AI never replies cheerfully to a disclosure.
//
// How it matches:
//   * The text is normalised first: lowercase, accents removed, punctuation and
//     apostrophes removed, spaces collapsed. "I DON'T want to live!!" becomes
//     "i dont want to live".
//   * A phrase only matches as WHOLE WORDS. The old check used .includes(), so
//     the keyword "gun" fired on "I've begun to feel better".
//
// IMPORTANT: the non-English phrases below are a best-effort starting list.
// Have a clinician and native speakers of each language review and extend them
// before launch. Languages not covered yet: Xitsonga, Tshivenda, siSwati,
// isiNdebele. A missed phrase is a missed person, so keep this list growing.
//
// Write every phrase in plain lowercase WITHOUT accents or apostrophes.

export const EMERGENCY_PHRASES = {
  en: [
    'suicide',
    'suicidal',
    'kill myself',
    'killing myself',
    'kill my self',
    'end my life',
    'ending my life',
    'end it all',
    'ending it all',
    'take my own life',
    'taking my own life',
    'want to die',
    'wanna die',
    'wish i was dead',
    'wish i were dead',
    'better off dead',
    'better off without me',
    'no reason to live',
    'nothing to live for',
    'dont want to live',
    'dont want to be alive',
    'self harm',
    'selfharm',
    'harm myself',
    'hurt myself',
    'hurting myself',
    'cut myself',
    'cutting myself',
    'overdose',
    'overdosed',
    'overdosing',
    'shoot myself',
    'hang myself',
    'hanging myself',
    'gun to my head',
    'gun in my mouth',
    'kill someone',
    'shoot someone',
  ],
  // Afrikaans
  af: [
    'selfmoord',
    'myself doodmaak',
    'myself dood maak',
    'myself van kant maak',
    'wil doodgaan',
    'wil dood wees',
    'wil nie meer lewe nie',
    'wil nie meer leef nie',
    'einde aan my lewe',
    'myself seermaak',
    'myself beseer',
  ],
  // isiZulu (ukuzibulala is shared with isiXhosa)
  zu: [
    'ukuzibulala',
    'ngizibulala',
    'ngizibulale',
    'ngifuna ukufa',
    'angifuni ukuphila',
    'angisafuni ukuphila',
    'ngizilimaze',
    'ukuzilimaza',
  ],
  // isiXhosa
  xh: [
    'ndifuna ukufa',
    'andifuni kuphila',
    'andisafuni kuphila',
    'ndizibulale',
    'ndizibulala',
    'ndizenzakalise',
    'ukuzenzakalisa',
  ],
  // Sesotho
  st: [
    'ke batla ho shoa',
    'ho ipolaea',
    'ke batla ho ipolaea',
    'ha ke batle ho phela',
    'ha ke sa batle ho phela',
  ],
  // Setswana
  tn: [
    'ke batla go swa',
    'go ipolaya',
    'ke batla go ipolaya',
    'ga ke batle go tshela',
    'ga ke sa batle go tshela',
  ],
  // Sepedi
  nso: [
    'ke nyaka go hwa',
    'ga ke nyake go phela',
    'ga ke sa nyake go phela',
  ],
};

// Kept so older imports of EMERGENCY_KEYWORDS keep working.
export const EMERGENCY_KEYWORDS = Object.values(EMERGENCY_PHRASES).flat();

// Shown in the alert on the questions page before the person is sent to /emergency.
export const CRISIS_MESSAGE =
  "It sounds like you may be carrying something very heavy, and you don't have to face it alone. Please reach out to someone you trust, or use the support options on the next page right away.";

// What the SERVER answers with instead of an AI reflection when a crisis is
// detected. It is fixed text on purpose: nothing generated, nothing to go wrong.
export const CRISIS_REFLECTION =
  "What you've shared matters, and you don't have to carry it alone. Please reach out to someone you trust right now, or use the emergency support options on our Emergency page. If you are in immediate danger, contact emergency services.";

export const CRISIS_TAKEAWAYS = [
  'You deserve support from a real person, not just an app.',
  'If you are in immediate danger, contact emergency services now.',
];

/** Lowercase, strip accents, drop punctuation and apostrophes, collapse spaces. */
export function normaliseForSafety(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['\u2019\u2018`\u00b4]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const MATCHERS = Object.entries(EMERGENCY_PHRASES).flatMap(
  ([language, phrases]) =>
    phrases.map((phrase) => ({ language, needle: ` ${phrase} ` })),
);

/**
 * Returns false when nothing worrying was found, or
 *   { matched: true, language, message }
 * when a crisis phrase was found. The result is truthy, so existing
 * `if (checkForSafetyTrigger(text))` callers keep working.
 */
export function checkForSafetyTrigger(text) {
  if (!text || typeof text !== 'string') return false;

  // Padding both ends with a space lets every phrase match as whole words.
  const padded = ` ${normaliseForSafety(text)} `;

  const hit = MATCHERS.find(({ needle }) => padded.includes(needle));
  if (!hit) return false;

  return { matched: true, language: hit.language, message: CRISIS_MESSAGE };
}

/** True if ANY of the given strings triggers the safety check. */
export function anyTextTriggersSafety(texts) {
  return (Array.isArray(texts) ? texts : []).some((t) =>
    Boolean(checkForSafetyTrigger(t)),
  );
}

// Kept from the old file so nothing that imported the default export breaks.
export default function SafetyPage() {
  return null;
}
