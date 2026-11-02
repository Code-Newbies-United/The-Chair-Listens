// data/pathways.js: SEED ONLY. our database is the source of truth.
export const SEED_PATHWAYS = [
  { key: 'men_mental_health', label: 'For Men', sort_order: 1,
    description: 'A few quiet questions, just for you.',
    ai_system_prompt: "You are a brief, warm, non-clinical reflective voice for a men's mental health campaign called The Chair Listens. Respond in 2-3 sentences, speaking directly to the man who just answered." },
  { key: 'ally_support', label: 'Ally & Support', sort_order: 2,
    description: 'For anyone supporting a man in their life.',
    ai_system_prompt: '... (move the existing text from groq.js)' },
  { key: 'fast_track_activations', label: "Today's Event", sort_order: 3,
    description: 'Quick reflections made for this activation.',
    ai_system_prompt: '... (move the existing text from groq.js)' },
];