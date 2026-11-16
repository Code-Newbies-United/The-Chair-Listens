// lib/moods.js
// Single source of truth for the moods. The ids must match the ids used on
// the check-in page (pages/check-in.jsx) and the CHECK constraint in the
// database.

export const MOODS = [
  { id: "heavy", label: "Carrying a Lot" },
  { id: "processing", label: "Processing" },
  { id: "grounded", label: "Grounded" },
  { id: "hopeful", label: "Hopeful" },
];

export const MOOD_IDS = MOODS.map((m) => m.id);

export function moodLabel(id) {
  return MOODS.find((m) => m.id === id)?.label ?? "Every mood";
}