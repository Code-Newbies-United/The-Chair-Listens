import { checkForSafetyTrigger } from "./safety.js";

// Edit these lists freely. Move a rule between tiers to tune strictness.
const BLOCKED = [
    { term: "crazy", re: /\bcrazy\b/i, suggestion: "overwhelming, intense, or hard to make sense of" },
    { term: "insane", re: /\binsane\b/i, suggestion: "extreme or unbelievable" },
    { term: "psycho", re: /\bpsycho(s|path)?\b/i, suggestion: "describe the behaviour instead of labelling the person" },
    { term: "unhinged", re: /\bunhinged\b/i, suggestion: "describe what happened instead" },
    { term: "nuts", re: /\bnuts\b/i, suggestion: "hectic or chaotic" },
    { term: "loony", re: /\bloon(y|ies)\b/i, suggestion: "describe the behaviour instead of labelling the person" },
    {
        term: "schizophrenic (as a label)",
        re: /\b(a|an|the|he|she|they|you|is|was)\s+schizo(phrenic)?\b|\bschizo\b/i,
        suggestion: "a person living with schizophrenia",
    },
    {
        term: "casual use of a diagnosis",
        re: /\b(so|totally|such an?|a bit|kinda|sooo+)\s+(ocd|bipolar|schizo(phrenic)?|autistic|ptsd)\b/i,
        suggestion: "describe the feeling itself, for example 'particular', 'moody' or 'unpredictable'",
    },
    { term: "happy pills", re: /\bhappy\s+pills?\b/i, suggestion: "medication" },
    { term: "committed suicide", re: /\bcommitted\s+suicide\b/i, suggestion: "died by suicide" },
    { term: "afflicted with", re: /\bafflicted\s+(with|by)\b/i, suggestion: "living with" },
    {
        term: "victim (of mental illness)",
        re: /\bvictims?\s+of\s+(mental|depress|anxiet|ptsd|bipolar|schizo)/i,
        suggestion: "a person living with a mental health condition",
    },
];

const NUDGE = [
    { term: "disturbed", re: /\bdisturbed\b/i, suggestion: "describe how it felt, for example 'unsettled' or 'upset'" },
    { term: "suffering from", re: /\bsuffer(ing|s|ed)?\s+from\b/i, suggestion: "living with" },
    { term: "struggling with", re: /\bstruggl(ing|es|ed)?\s+with\b/i, suggestion: "dealing with, or finding it hard to manage" },
    {
        term: "I'm so depressed",
        re: /\b(i'?m|im|i am|so)\s+(so|really|totally)?\s*depressed\b/i,
        suggestion: "if you mean sad or bored, say that. If you mean depression, you're welcome to say so",
    },
];

// Anything that could be genuine self-harm: care first, never "rephrase".
const CRISIS = /\b(kill(ing)?\s+myself|end(ing)?\s+my\s+life|want\s+to\s+die|take\s+my\s+own\s+life|suicid(e|al))\b/i;

// Light normalisation so "cr@zy" and "p s y c h o" don't slip through.
function normalise(text) {
    return text
        .toLowerCase()
        .replace(/@/g, "a")
        .replace(/0/g, "o")
        .replace(/[1!|]/g, "i")
        .replace(/3/g, "e")
        .replace(/\$/g, "s")
        .replace(/\b(\w)(?:[\s.\-_*]+(?=\w\b))/g, "$1");
}

function scan(rules, text) {
    return rules.filter((r) => r.re.test(text)).map(({ term, suggestion }) => ({ term, suggestion }));
}

function unique(matches) {
    return matches.filter((m, i) => matches.findIndex((x) => x.term === m.term) === i);
}

/**
 * Returns { status: "ok" | "nudge" | "blocked" | "crisis", matches: [{ term, suggestion }] }
 * Safe to call on both the client and the server.
 */
export function moderateMessage(raw) {
    const text = String(raw || "");
    const normalised = normalise(text);

    const blockedUnique = unique([...scan(BLOCKED, text), ...scan(BLOCKED, normalised)]);
    const isWordingOnlySuicide = blockedUnique.some((m) => m.term === "committed suicide");

    const crisisHit =
        CRISIS.test(text) || CRISIS.test(normalised) || checkForSafetyTrigger(text) || checkForSafetyTrigger(normalised);

    // "committed suicide" alone is a wording issue, not a crisis.
    if (crisisHit && !(isWordingOnlySuicide && !/\b(kill|end|die|take)\b/i.test(text))) {
        return { status: "crisis", matches: [] };
    }
    if (blockedUnique.length) return { status: "blocked", matches: blockedUnique };

    const nudgeUnique = unique([...scan(NUDGE, text), ...scan(NUDGE, normalised)]);
    if (nudgeUnique.length) return { status: "nudge", matches: nudgeUnique };

    return { status: "ok", matches: [] };
}