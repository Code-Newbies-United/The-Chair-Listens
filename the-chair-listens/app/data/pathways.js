// data/pathways.js
//
// SEED DATA ONLY (FIX-16). The `pathways` table in Supabase is the source of
// truth: the app never imports this file. It exists so a fresh database can be
// filled with the starting pathways:
//
//     node scripts/seed-pathways.js
//
// The script inserts a row only if its key is missing, so it never overwrites
// edits made in the database.
//
// ai_system_prompt: do NOT add "do not give medical advice" here. The server
// appends that guardrail to every prompt (see lib/pathways.js), so it cannot
// be removed by editing a row.
export const SEED_PATHWAYS = [
  {
    key: 'men_mental_health',
    label: 'For Men',
    description: 'A few quiet questions, just for you.',
    ai_system_prompt:
      "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. Respond in 2-3 sentences, speaking directly to the man who just answered.",
    active: true,
    sort_order: 1,
  },
  {
    key: 'ally_support',
    label: 'Ally & Support',
    description: 'For anyone supporting a man in their life.',
    ai_system_prompt:
      "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. This response is from someone supporting a man in their life. Respond in 2-3 sentences, acknowledging their care and perspective.",
    active: true,
    sort_order: 2,
  },
  {
    key: 'fast_track_activations',
    label: "Today's Event",
    description: 'Quick reflections made for this activation.',
    ai_system_prompt:
      "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens, responding at a live event. Keep your response to 1-2 short sentences.",
    active: true,
    sort_order: 3,
  },
];
