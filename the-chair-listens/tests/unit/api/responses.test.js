import handler from '@/pages/api/responses';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { MAX_ANSWERS, MAX_ANSWER_CHARS } from '@/lib/limits';
import { MAX_RESPONSES_PER_SESSION } from '@/lib/consentVersion';
import {
  mockReq,
  mockRes,
  validResponseBody,
  SESSION_ID,
  TEST_IP,
} from '../helpers/http';

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));
jest.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: { from: jest.fn() },
}));

const CHAIR_ID = '7a6b5c4d-3e2f-4a1b-8c9d-0e1f2a3b4c5d';

let sessionRow;
let existingResponses;
let sessionsTable;
let responsesTable;

beforeEach(() => {
  jest.clearAllMocks();
  rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });

  sessionRow = {
    id: SESSION_ID,
    chair_location_id: CHAIR_ID,
    location_id: 'Chair 1',
    consented_at: new Date().toISOString(),
  };
  existingResponses = 0;

  sessionsTable = {
    select: jest.fn(() => sessionsTable),
    eq: jest.fn(() => sessionsTable),
    maybeSingle: jest.fn(async () => ({ data: sessionRow, error: null })),
  };
  responsesTable = {
    select: jest.fn(() => ({
      eq: jest.fn(async () => ({ count: existingResponses, error: null })),
    })),
    insert: jest.fn(async () => ({ error: null })),
  };
  supabaseAdmin.from.mockImplementation((table) =>
    table === 'sessions' ? sessionsTable : responsesTable,
  );
});

const answer = (overrides = {}) => ({
  questionId: 'q-1',
  title: 'Check-in',
  question: 'How are you?',
  answer: 'Fine.',
  ...overrides,
});

const post = async (body, options = {}) => {
  const res = mockRes();
  await handler(mockReq({ body, ...options }), res);
  return res;
};

describe('/api/responses: method and rate limits', () => {
  test('rejects anything but POST with 405 and an Allow header', async () => {
    const res = await post(undefined, { method: 'GET' });
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
    expect(res.body.error).toBe('Method Not Allowed');
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test('counts the IP and the session against their limits', async () => {
    await post(validResponseBody());
    const { perIp, perSession, windowSeconds } = RATE_LIMITS.responses;
    expect(rateLimit).toHaveBeenCalledWith(
      'responses',
      TEST_IP,
      perIp,
      windowSeconds,
    );
    expect(rateLimit).toHaveBeenCalledWith(
      'responses-session',
      SESSION_ID,
      perSession,
      windowSeconds,
    );
  });

  test('returns 429 and never reads or writes the database when the IP is over its limit', async () => {
    rateLimit.mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      count: 61,
    });
    const res = await post(validResponseBody());

    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Too Many Requests');
    expect(res.headers['Retry-After']).toBeDefined();
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test('returns 429 when one session is over its limit', async () => {
    rateLimit
      .mockResolvedValueOnce({ allowed: true, remaining: 5, count: 1 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0, count: 11 });
    const res = await post(validResponseBody());

    expect(res.statusCode).toBe(429);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });
});

describe('/api/responses: consent session', () => {
  test.each([
    ['missing', undefined],
    ['not a string', 12345],
    ['not a UUID', 'not-a-uuid'],
  ])(
    'returns 403 when session_id is %s, without touching the database',
    async (_l, session_id) => {
      const res = await post(validResponseBody({ session_id }));
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Consent required');
      expect(supabaseAdmin.from).not.toHaveBeenCalled();
    },
  );

  test('returns 403 when no such session exists', async () => {
    sessionsTable.maybeSingle.mockResolvedValue({ data: null, error: null });
    const res = await post(validResponseBody());
    expect(res.statusCode).toBe(403);
    expect(responsesTable.insert).not.toHaveBeenCalled();
  });

  test('returns 403 when the session has expired', async () => {
    sessionRow.consented_at = new Date(
      Date.now() - 7 * 60 * 60 * 1000,
    ).toISOString();
    const res = await post(validResponseBody());
    expect(res.statusCode).toBe(403);
    expect(responsesTable.insert).not.toHaveBeenCalled();
  });

  test('returns 429 once a session has used up its responses', async () => {
    existingResponses = MAX_RESPONSES_PER_SESSION;
    const res = await post(validResponseBody());
    expect(res.statusCode).toBe(429);
    expect(responsesTable.insert).not.toHaveBeenCalled();
  });
});

describe('/api/responses: payload validation (no database access on a bad payload)', () => {
  test.each([
    ['answers missing', validResponseBody({ answers: undefined })],
    ['answers empty', validResponseBody({ answers: [] })],
    ['answers not an array', validResponseBody({ answers: 'text' })],
    [
      'too many answers',
      validResponseBody({
        answers: Array.from({ length: MAX_ANSWERS + 1 }, () => answer()),
      }),
    ],
    [
      'an answer that is too long',
      validResponseBody({
        answers: [answer({ answer: 'a'.repeat(MAX_ANSWER_CHARS + 1) })],
      }),
    ],
    [
      'a blank answer',
      validResponseBody({ answers: [answer({ answer: '  ' })] }),
    ],
    [
      'an answer that is not text',
      validResponseBody({ answers: [answer({ answer: { a: 1 } })] }),
    ],
    [
      'an unknown key inside an answer',
      validResponseBody({ answers: [answer({ hack: 1 })] }),
    ],
    ['script missing', validResponseBody({ script: undefined })],
    ['an unknown script', validResponseBody({ script: 'made_up' })],
  ])('returns 400 for %s', async (_label, body) => {
    const res = await post(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(res.body.message).toEqual(expect.any(String));
    expect(Array.isArray(res.body.issues)).toBe(true);
    // Nothing read, nothing written.
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
    expect(responsesTable.insert).not.toHaveBeenCalled();
  });

  test('a 400 never repeats what the visitor typed', async () => {
    const secret = 'MY-PRIVATE-DISCLOSURE';
    const res = await post(
      validResponseBody({
        answers: [answer({ answer: secret + 'x'.repeat(MAX_ANSWER_CHARS) })],
      }),
    );
    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.body)).not.toContain(secret);
  });
});

describe('/api/responses: saving', () => {
  test('saves a valid response and returns 200', async () => {
    const body = validResponseBody();
    const res = await post(body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(responsesTable.insert).toHaveBeenCalledWith({
      answers: body.answers,
      script: 'men_mental_health',
      session_id: SESSION_ID,
      chair_location_id: CHAIR_ID,
      location: 'Chair 1',
    });
  });

  test('saves only the validated fields, dropping unknown top-level keys', async () => {
    await post(
      validResponseBody({ is_admin: true, location_id: 'attacker-chosen' }),
    );
    const [row] = responsesTable.insert.mock.calls[0];
    expect(row).not.toHaveProperty('is_admin');
    expect(row.location).toBe('Chair 1');
  });

  test('accepts an answer at exactly the length limit', async () => {
    const res = await post(
      validResponseBody({
        answers: [answer({ answer: 'a'.repeat(MAX_ANSWER_CHARS) })],
      }),
    );
    expect(res.statusCode).toBe(200);
  });
});
