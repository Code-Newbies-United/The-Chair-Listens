// lib/validators.js
//
// Every public endpoint checks its input here BEFORE touching the database
// or a paid API (FIX-11). Each parse function returns either
//   { ok: true, data }     -> use `data` (unknown keys are stripped), or
//   { ok: false, issues }  -> send a 400 with `issues`.
//
// Issue messages describe the rule that failed. They never contain what the
// visitor typed, because answers are sensitive and must not end up in logs.
import { z } from 'zod';
import {
  MAX_ANSWERS,
  MAX_ANSWER_CHARS,
  MAX_QUESTION_CHARS,
  MAX_TITLE_CHARS,
  MAX_ID_CHARS,
  MAX_CONSENT_VERSION_CHARS,
  MAX_MESSAGE_CHARS,
} from '@/lib/limits';

// FIX-16: pathways live in the database (see lib/pathways.js), so the list of
// valid keys is not hardcoded here. This only checks that a key is well-formed;
// whether the pathway actually exists is checked in the route (lib/pathwayGuard.js).
// Keep this pattern in sync with the CHECK constraint on pathways.key.
export const PATHWAY_KEY_PATTERN = /^[a-z0-9_]{1,64}$/;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

const scriptSchema = z
  .string({ error: 'script must be a pathway key' })
  .regex(PATHWAY_KEY_PATTERN, 'script must be a valid pathway key');

const answerTextSchema = z
  .string()
  .max(
    MAX_ANSWER_CHARS,
    `answer must be at most ${MAX_ANSWER_CHARS} characters`,
  )
  .refine((text) => text.trim().length > 0, 'answer must not be empty');

// One saved answer. .strict() rejects unknown keys, because this object is
// stored as-is in the database and must not become a place to hide junk.
const answerItemSchema = z
  .object({
    questionId: z.string().max(MAX_ID_CHARS).optional(),
    title: z.string().max(MAX_TITLE_CHARS).optional(),
    question: z.string().max(MAX_QUESTION_CHARS).optional(),
    answer: answerTextSchema,
  })
  .strict();

const answersSchema = z.array(answerItemSchema).min(1).max(MAX_ANSWERS);

// Used by /api/responses and /api/session-reflection.
const responseBodySchema = z.object({
  script: scriptSchema,
  answers: answersSchema,
});

const consentBodySchema = z.object({
  consent_version: z.string().max(MAX_CONSENT_VERSION_CHARS),
});

// Used by /api/groq (one answer at a time).
const groqBodySchema = z.object({
  script: scriptSchema.optional(),
  question: z.string().max(MAX_QUESTION_CHARS).optional(),
  answer: answerTextSchema,
});

// Used by /api/messages (community message on the reflection page).
const messageBodySchema = z.object({
  message: z
    .string()
    .max(
      MAX_MESSAGE_CHARS,
      `message must be at most ${MAX_MESSAGE_CHARS} characters`,
    )
    .refine((text) => text.trim().length > 0, 'message must not be empty'),
});

function run(schema, input) {
  const result = schema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return {
    ok: false,
    issues: result.error.issues.slice(0, 5).map((issue) => ({
      field: issue.path.map(String).join('.'),
      message: issue.message,
    })),
  };
}

export const parseResponseBody = (body) => run(responseBodySchema, body);
export const parseConsentBody = (body) => run(consentBodySchema, body);
export const parseMessageBody = (body) => run(messageBodySchema, body);
export const parseGroqBody = (body) => run(groqBodySchema, body);
export const parseScriptKey = (value) => run(scriptSchema, value);
