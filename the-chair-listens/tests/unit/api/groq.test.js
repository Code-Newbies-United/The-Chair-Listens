import handler from '@/pages/api/groq';
import { rateLimit } from '@/lib/rateLimit';
import { getPathway } from '@/lib/pathways';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { MAX_ANSWER_CHARS } from '@/lib/limits';
import { CRISIS_REFLECTION } from '@/lib/safety';
import { mockReq, mockRes, SESSION_ID, TEST_IP } from '../helpers/http';

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
  ai_system_prompt: 'Be brief and warm.',
};

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
    getPathway.mockImplementation(async (key) =>
      key === KNOWN_PATHWAY.key ? KNOWN_PATHWAY : null,
    );
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
    // A well-formed key passes the validator; the route then asks the
    // database, finds no such pathway, and answers 400.
    ['a pathway that does not exist', body({ script: 'made_up' })],
    ['a malformed script key', body({ script: 'Not A Key!' })],
  ])('returns 400 for %s, without calling Groq', async (_label, payload) => {
    const res = mockRes();
    await handler(mockReq({ body: payload }), res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('works with no script at all (the default prompt is used)', async () => {
    const res = mockRes();
    await handler(mockReq({ body: { answer: 'Fine.' } }), res);
    expect(res.statusCode).toBe(200);
    expect(getPathway).not.toHaveBeenCalled();
  });
});

describe('/api/groq: safety backstop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 9, count: 1 });
    getPathway.mockResolvedValue(KNOWN_PATHWAY);
    global.fetch = jest.fn();
  });

  test.each([
    'I want to kill myself',
    "I don't want to live anymore",
    'ngifuna ukuzibulala',
    'ek wil myself doodmaak',
    'ke batla go swa',
  ])('a crisis answer (%s) gets fixed human text, never an AI reflection', async (answer) => {
    const res = mockRes();
    await handler(mockReq({ body: body({ answer }) }), res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ text: CRISIS_REFLECTION, crisis: true });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(getPathway).not.toHaveBeenCalled();
  });

  test('ordinary words that contain "gun" do not trigger the backstop', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Well done.' } }] }),
    }));
    const res = mockRes();
    await handler(
      mockReq({ body: body({ answer: "I've begun to feel better this week." }) }),
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ text: 'Well done.' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('/api/groq: when Groq is slow or busy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 9, count: 1 });
    getPathway.mockResolvedValue(KNOWN_PATHWAY);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('passes an abort signal to Groq, so the request can time out', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Hi.' } }] }),
    }));
    await handler(mockReq({ body: body() }), mockRes());

    const [, options] = global.fetch.mock.calls[0];
    expect(options.signal).toBeDefined();
  });

  test('answers 504 when Groq does not reply in time', async () => {
    global.fetch = jest.fn(async () => {
      const error = new Error('The operation was aborted');
      error.name = 'AbortError';
      throw error;
    });
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    expect(res.statusCode).toBe(504);
    expect(res.body.error).toBe('Gateway Timeout');
  });

  test("answers 503 with Retry-After when Groq says it is over its own limit", async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 429,
      text: async () => 'rate limited',
    }));
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    expect(res.statusCode).toBe(503);
    expect(res.headers['Retry-After']).toBe('10');
  });

  test('answers 502 for any other Groq failure', async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => 'boom',
    }));
    const res = mockRes();
    await handler(mockReq({ body: body() }), res);

    expect(res.statusCode).toBe(502);
  });
});
