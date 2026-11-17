import handler from '@/pages/api/session-reflection';
import { rateLimit } from '@/lib/rateLimit';
import { getPathway } from '@/lib/pathways';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { MAX_ANSWERS, MAX_ANSWER_CHARS } from '@/lib/limits';
import { CRISIS_REFLECTION, CRISIS_TAKEAWAYS } from '@/lib/safety';
import {
  mockReq,
  mockRes,
  validResponseBody,
  SESSION_ID,
  TEST_IP,
} from '../helpers/http';

const mockCreate = jest.fn();

jest.mock('groq-sdk', () =>
  jest.fn(() => ({
    chat: { completions: { create: (...args) => mockCreate(...args) } },
  })),
);
jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));
// Pathways live in the database (FIX-16): never hit it from a unit test.
jest.mock('@/lib/pathways', () => ({ getPathway: jest.fn() }));

const KNOWN_PATHWAY = {
  key: 'men_mental_health',
  label: 'For Men',
  description: 'Reflections for men',
  active: true,
};

// This route only needs script + answers.
const body = (overrides = {}) => {
  const { script, answers } = validResponseBody();
  return { script, answers, ...overrides };
};

describe('/api/session-reflection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });
    getPathway.mockImplementation(async (key) =>
      key === KNOWN_PATHWAY.key ? KNOWN_PATHWAY : null,
    );
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              overallReflection: 'You showed up.',
              takeaways: ['One', 'Two'],
            }),
          },
        },
      ],
    });
  });

  test('rejects anything but POST with 405 and an Allow header', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
  });

  test('limits per IP and per session, and the IP allowance is above the old 5/min', async () => {
    const res = mockRes();
    await handler(
      mockReq({ body: body(), headers: { 'x-session-id': SESSION_ID } }),
      res,
    );

    const { perIp, perSession, windowSeconds } = RATE_LIMITS.sessionReflection;
    expect(perIp).toBeGreaterThan(5);
    expect(rateLimit).toHaveBeenCalledWith(
      'sessionReflection',
      TEST_IP,
      perIp,
      windowSeconds,
    );
    expect(rateLimit).toHaveBeenCalledWith(
      'sessionReflection-session',
      SESSION_ID,
      perSession,
      windowSeconds,
    );
  });

  test('returns 429 in the standard shape, without calling Groq, when over the limit', async () => {
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 121 });
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Too Many Requests');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test.each([
    ['no body', undefined],
    ['empty answers', body({ answers: [] })],
    [
      'too many answers',
      body({
        answers: Array.from({ length: MAX_ANSWERS + 1 }, () => ({
          answer: 'x',
        })),
      }),
    ],
    [
      'an answer that is too long',
      body({ answers: [{ answer: 'a'.repeat(MAX_ANSWER_CHARS + 1) }] }),
    ],
    // A well-formed key passes the validator; the route then asks the
    // database, finds no such pathway, and answers 400.
    ['a pathway that does not exist', body({ script: 'made_up' })],
    ['a malformed script key', body({ script: 'Not A Key!' })],
  ])('returns 400 for %s, without calling Groq', async (_label, payload) => {
    const res = mockRes();
    await handler(mockReq({ body: payload }), res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('returns the reflection for a valid request', async () => {
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      overallReflection: 'You showed up.',
      takeaways: ['One', 'Two'],
    });
  });

  test('falls back to a kind generic reflection (HTTP 500) if the AI call fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreate.mockRejectedValue(new Error('Groq is down'));
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    expect(res.statusCode).toBe(500);
    expect(res.body.overallReflection).toEqual(expect.any(String));
    expect(res.body.takeaways.length).toBeGreaterThan(0);
    console.error.mockRestore();
  });
});

describe('/api/session-reflection: safety backstop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });
    getPathway.mockResolvedValue(KNOWN_PATHWAY);
  });

  test.each([
    'I want to end it all',
    'ngifuna ukufa',
    'selfmoord',
  ])('any crisis answer (%s) gets fixed human text, never an AI summary', async (crisisAnswer) => {
    const res = mockRes();
    await handler(
      mockReq({
        body: body({
          answers: [
            { question: 'Q1', answer: 'Work has been heavy.' },
            { question: 'Q2', answer: crisisAnswer },
          ],
        }),
      }),
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      overallReflection: CRISIS_REFLECTION,
      takeaways: CRISIS_TAKEAWAYS,
      crisis: true,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
