export const EMERGENCY_KEYWORDS = [
    'suicide',
    'kill myself',
    'end my life',
    'want to die',
    'self harm',
    'cutting myself',
    'overdose',
    'hurt myself',
    'no reason to live',
    'kill someone',
    'shoot myself',
    'I want to die',
    'gun',
    'end my life'
];

export function checkForSafetyTrigger(text) {
    if (!text || typeof text !== 'string') return false;

    const normalizedText = text.toLowerCase().trim();

    return EMERGENCY_KEYWORDS.some((keyword) =>
        normalizedText.includes(keyword)
    );
}