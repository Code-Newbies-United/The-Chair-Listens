// lib/limits.js
//
// Size limits shared by the browser and the server (FIX-11).
// This file must stay free of imports, so pages can use it without
// pulling zod into the browser bundle.

// A single session never legitimately has more questions than this.
export const MAX_ANSWERS = 15;

// Per-answer limits. The answer box in pages/questions.jsx uses MAX_ANSWER_CHARS
// as its maxLength, so honest visitors can never hit the server limit.
export const MAX_ANSWER_CHARS = 4000;
export const MAX_QUESTION_CHARS = 500;
export const MAX_TITLE_CHARS = 200;
export const MAX_ID_CHARS = 64;

export const MAX_CONSENT_VERSION_CHARS = 50;

// Community message left on the reflection page.
export const MAX_MESSAGE_CHARS = 1000;

// Voice answers: the browser records, /api/transcribe sends the audio to Whisper.
//   * MAX_RECORDING_SECONDS: the recorder stops by itself after this long.
//   * AUDIO_BITS_PER_SECOND: 32 kbps is plenty for speech. 90 s is about 360 KB.
//   * MAX_AUDIO_BYTES: hard ceiling on one upload. Vercel rejects any request
//     body over 4.5 MB before our code runs, so this stays safely below that.
//     The recorder settings above keep honest recordings far under it.
export const MAX_RECORDING_SECONDS = 90;
export const AUDIO_BITS_PER_SECOND = 32000;
export const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

// Whole-request limits live in each API route as
//   export const config = { api: { bodyParser: { sizeLimit: "..." } } };
// Next.js only accepts literal values there, so they cannot be imported.
// Keep them in step with the numbers above:
//   answers routes: 256kb  (15 x (4000 + 500) chars, even at 2 bytes per char)
//   groq route:     32kb   (one answer + one question)
//   consent route:  4kb
//   messages route: 8kb
