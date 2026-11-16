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
  "You are a brief, warm, informative voice for The Chair Listens, a men's prostate cancer awareness campaign. Respond in 2-3 sentences, reflecting what the person said and encouraging informed conversations with a healthcare professional.";

// Appended in code to EVERY prompt, so editing a database row can never remove it.
export const SYSTEM_PROMPT_GUARDRAILS =
  'Do not give medical advice or diagnoses.';

// Safety rules for disclosures of self-harm or danger. Appended in code to EVERY prompt.
export const SAFETY_INSTRUCTIONS = `
SAFETY PRIORITY:

If a participant expresses suicidal thoughts, self-harm,
immediate danger or an intention to hurt themselves or someone else:

- Respond with compassion and take the disclosure seriously.
- Do not treat it as an ordinary reflective exercise.
- Encourage them to reach out to a trusted person immediately
  and seek urgent professional or emergency support.
- Do not rely on motivational language or philosophical reflections.
- Do not shame, dismiss or minimise their disclosure.
- Never imply that an AI conversation is a substitute for
  immediate human support.
`;

export function buildSystemPrompt(pathway) {
  const own = pathway?.ai_system_prompt?.trim();
  return `${own || DEFAULT_SYSTEM_PROMPT}\n\n${SYSTEM_PROMPT_GUARDRAILS}\n\n${SAFETY_INSTRUCTIONS}`;
}
