// lib/pathwayShape.js
//
// Pure helpers for pathway rows (FIX-16): no database access, so they are easy
// to test and safe to import anywhere on the server.

// Safe to send to browsers. NEVER add ai_system_prompt here.
export const toPublic = ({ key, label, description }) => ({
  key,
  label,
  description,
});

// What the admin screens may see. Still no prompt text.
export const toAdmin = ({ key, label, description, active, sort_order }) => ({
  key,
  label,
  description,
  active,
  sort_order,
});

// Used when a pathway has no prompt of its own (or no pathway was chosen).
export const DEFAULT_SYSTEM_PROMPT =
  "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. Respond in 2-3 sentences.";

// Appended in code to EVERY prompt, so editing a database row can never remove it.
export const SYSTEM_PROMPT_GUARDRAILS =
  'Do not give medical advice or diagnoses.';

export function buildSystemPrompt(pathway) {
  const own = pathway?.ai_system_prompt?.trim();
  return `${own || DEFAULT_SYSTEM_PROMPT}\n\n${SYSTEM_PROMPT_GUARDRAILS}`;
}
