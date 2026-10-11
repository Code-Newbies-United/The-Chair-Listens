import handler from '@/pages/api/groq';
import { rateLimit } from '@/lib/rateLimit';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { MAX_ANSWER_CHARS } from '@/lib/limits';
import { mockReq, mockRes, SESSION_ID, TEST_IP } from '../helpers/http';

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));

const body = (overrides = {}) => ({
  script: 'men_mental_health',
  question: 'How are you?',
  answer: 'Tired, honestly.',
  ...overrides,
});

describe('/api/groq', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 9, count: 1 });
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Thank you.' } }] }),
    }));
  });

  test('rejects anything but POST with 405 and an Allow header', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
    expect(res.body.error).toBe('Method Not Allowed');
  });

  test('allows the request when the rate limit has not been exceeded', async () => {
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    const { perIp, windowSeconds } = RATE_LIMITS.groq;
    expect(rateLimit).toHaveBeenCalledWith(
      'groq',
      TEST_IP,
      perIp,
      windowSeconds,
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ text: 'Thank you.' });
  });

  test('also limits per session when the browser sends its session ID', async () => {
    const res = mockRes();
    await handler(
      mockReq({ body: body(), headers: { 'x-session-id': SESSION_ID } }),
      res,
    );

    const { perSession, windowSeconds } = RATE_LIMITS.groq;
    expect(rateLimit).toHaveBeenCalledWith(
      'groq-session',
      SESSION_ID,
      perSession,
      windowSeconds,
    );
  });

  test('returns 429 in the standard shape, without calling Groq, when over the limit', async () => {
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 61 });
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Too Many Requests');
    expect(res.body.message).toEqual(expect.any(String));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test.each([
    ['no body', undefined],
    ['a missing answer', { question: 'Q?' }],
    ['a blank answer', body({ answer: '   ' })],
    [
      'an answer that is too long',
      body({ answer: 'a'.repeat(MAX_ANSWER_CHARS + 1) }),
    ],
    ['an unknown script', body({ script: 'made_up' })],
  ])('returns 400 for %s, without calling Groq', async (_label, payload) => {
    const res = mockRes();
    await handler(mockReq({ body: payload }), res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
