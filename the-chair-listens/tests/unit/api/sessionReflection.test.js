import handler from '@/pages/api/session-reflection';
import { rateLimit } from '@/lib/rateLimit';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { MAX_ANSWERS, MAX_ANSWER_CHARS } from '@/lib/limits';
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

// This route only needs script + answers.
const body = (overrides = {}) => {
  const { script, answers } = validResponseBody();
  return { script, answers, ...overrides };
};

describe('/api/session-reflection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });
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
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 31 });
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
    ['an unknown script', body({ script: 'made_up' })],
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
});
