import {
  SCRIPT_KEYS,
  isUuid,
  parseResponseBody,
  parseConsentBody,
  parseGroqBody,
  parseScriptKey,
} from '@/lib/validators';
import {
  MAX_ANSWERS,
  MAX_ANSWER_CHARS,
  MAX_QUESTION_CHARS,
  MAX_CONSENT_VERSION_CHARS,
} from '@/lib/limits';
import { validResponseBody } from '../helpers/http';

const answer = (overrides = {}) => ({
  questionId: 'q-1',
  title: 'Check-in',
  question: 'How are you?',
  answer: 'Fine.',
  ...overrides,
});

describe('isUuid', () => {
  test.each([
    '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b',
    '3F2B8C1E-5A4D-4E6F-9B7A-1C2D3E4F5A6B',
  ])('accepts %s', (value) => {
    expect(isUuid(value)).toBe(true);
  });

  test.each([
    undefined,
    null,
    42,
    {},
    [],
    '',
    'not-a-uuid',
    '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6',
    '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6bX',
    "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b' OR 1=1",
  ])('rejects %p', (value) => {
    expect(isUuid(value)).toBe(false);
  });
});

describe('parseResponseBody', () => {
  test('accepts the payload the app really sends', () => {
    const result = parseResponseBody(validResponseBody());
    expect(result.ok).toBe(true);
    expect(result.data.script).toBe('men_mental_health');
    expect(result.data.answers).toHaveLength(1);
  });

  test.each(SCRIPT_KEYS)('accepts script %s', (script) => {
    expect(parseResponseBody(validResponseBody({ script })).ok).toBe(true);
  });

  test('strips unknown top-level keys (session_id, junk) from the result', () => {
    const result = parseResponseBody(validResponseBody({ junk: 'x' }));
    expect(result.data).not.toHaveProperty('junk');
    expect(result.data).not.toHaveProperty('session_id');
  });

  test('accepts an answer of exactly the maximum length', () => {
    const body = validResponseBody({
      answers: [answer({ answer: 'a'.repeat(MAX_ANSWER_CHARS) })],
    });
    expect(parseResponseBody(body).ok).toBe(true);
  });

  test('accepts exactly the maximum number of answers', () => {
    const body = validResponseBody({
      answers: Array.from({ length: MAX_ANSWERS }, () => answer()),
    });
    expect(parseResponseBody(body).ok).toBe(true);
  });

  const tooMany = Array.from({ length: MAX_ANSWERS + 1 }, () => answer());

  test.each([
    ['no body at all', undefined],
    ['null body', null],
    ['a string body', 'hello'],
    ['an array body', []],
    ['missing script', validResponseBody({ script: undefined })],
    ['unknown script', validResponseBody({ script: 'made_up' })],
    ['script of the wrong type', validResponseBody({ script: 7 })],
    ['missing answers', validResponseBody({ answers: undefined })],
    ['answers that are not an array', validResponseBody({ answers: 'yes' })],
    ['an empty answers array', validResponseBody({ answers: [] })],
    ['too many answers', validResponseBody({ answers: tooMany })],
    ['a null answer item', validResponseBody({ answers: [null] })],
    ['a string answer item', validResponseBody({ answers: ['hi'] })],
    [
      'an answer that is not text',
      validResponseBody({ answers: [answer({ answer: 5 })] }),
    ],
    [
      'an answer with no text field',
      validResponseBody({ answers: [{ question: 'Q?' }] }),
    ],
    [
      'a blank answer',
      validResponseBody({ answers: [answer({ answer: '   ' })] }),
    ],
    [
      'an answer that is too long',
      validResponseBody({
        answers: [answer({ answer: 'a'.repeat(MAX_ANSWER_CHARS + 1) })],
      }),
    ],
    [
      'a question that is too long',
      validResponseBody({
        answers: [answer({ question: 'q'.repeat(MAX_QUESTION_CHARS + 1) })],
      }),
    ],
    [
      'an unknown key inside an answer',
      validResponseBody({ answers: [answer({ isAdmin: true })] }),
    ],
  ])('rejects %s', (_label, body) => {
    const result = parseResponseBody(body);
    expect(result.ok).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues.length).toBeLessThanOrEqual(5);
    for (const issue of result.issues) {
      expect(typeof issue.field).toBe('string');
      expect(typeof issue.message).toBe('string');
    }
  });

  test('reports which field failed', () => {
    const result = parseResponseBody(
      validResponseBody({ answers: [answer(), answer({ answer: '' })] }),
    );
    expect(result.issues[0].field).toBe('answers.1.answer');
  });

  test('error messages never contain what the visitor typed', () => {
    const secret = 'MY-PRIVATE-DISCLOSURE';
    const body = validResponseBody({
      answers: [
        answer({ answer: secret + 'x'.repeat(MAX_ANSWER_CHARS) }),
        answer({ [secret]: 'extra key', answer: secret }),
      ],
    });
    const result = parseResponseBody(body);
    expect(result.ok).toBe(false);
    // Rejected for being too long: the text itself must not be echoed back.
    expect(
      JSON.stringify(
        result.issues.filter((i) => i.field === 'answers.0.answer'),
      ),
    ).not.toContain(secret);
  });
});

describe('parseConsentBody', () => {
  test('accepts a consent_version string', () => {
    const result = parseConsentBody({ consent_version: '2026-10-v1' });
    expect(result).toEqual({
      ok: true,
      data: { consent_version: '2026-10-v1' },
    });
  });

  test.each([
    ['no body', undefined],
    ['null body', null],
    ['missing field', {}],
    ['a number', { consent_version: 1 }],
    ['an object', { consent_version: { $ne: '' } }],
    [
      'an oversized string',
      { consent_version: 'v'.repeat(MAX_CONSENT_VERSION_CHARS + 1) },
    ],
  ])('rejects %s', (_label, body) => {
    expect(parseConsentBody(body).ok).toBe(false);
  });
});

describe('parseGroqBody', () => {
  test('accepts one answer with an optional script and question', () => {
    expect(
      parseGroqBody({ script: 'ally_support', question: 'Q?', answer: 'A' }).ok,
    ).toBe(true);
    expect(parseGroqBody({ answer: 'A' }).ok).toBe(true);
  });

  test.each([
    ['no body', undefined],
    ['a missing answer', { question: 'Q?' }],
    ['a blank answer', { answer: '  ' }],
    [
      'an answer that is too long',
      { answer: 'a'.repeat(MAX_ANSWER_CHARS + 1) },
    ],
    ['an unknown script', { script: 'nope', answer: 'A' }],
    [
      'a question that is too long',
      { question: 'q'.repeat(MAX_QUESTION_CHARS + 1), answer: 'A' },
    ],
  ])('rejects %s', (_label, body) => {
    expect(parseGroqBody(body).ok).toBe(false);
  });
});

describe('parseScriptKey', () => {
  test.each(SCRIPT_KEYS)('accepts %s', (key) => {
    expect(parseScriptKey(key)).toEqual({ ok: true, data: key });
  });

  test.each([
    undefined,
    null,
    '',
    'made_up',
    ['men_mental_health'],
    ['a', 'b'],
  ])('rejects %p', (value) => {
    expect(parseScriptKey(value).ok).toBe(false);
  });
});
