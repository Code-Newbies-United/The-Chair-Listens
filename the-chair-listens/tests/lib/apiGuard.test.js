import { rateLimit } from '@/lib/rateLimit';
import {
  RATE_LIMITS,
  checkRateLimit,
  getSessionIdFromHeader,
} from '@/lib/apiGuard';
import { mockReq, mockRes, SESSION_ID, TEST_IP } from '../unit/helpers/http';

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));

const allowed = { allowed: true, remaining: 5, count: 1 };
const blocked = { allowed: false, remaining: 0, count: 99 };

beforeEach(() => {
  jest.clearAllMocks();
  rateLimit.mockResolvedValue(allowed);
});

describe('checkRateLimit', () => {
  test('lets a request through and sends nothing when under both limits', async () => {
    const res = mockRes();
    const ok = await checkRateLimit(mockReq(), res, 'responses', {
      sessionId: SESSION_ID,
    });

    expect(ok).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('counts the IP and the session in separate buckets', async () => {
    await checkRateLimit(mockReq(), mockRes(), 'responses', {
      sessionId: SESSION_ID,
    });

    const { perIp, perSession, windowSeconds } = RATE_LIMITS.responses;
    expect(rateLimit).toHaveBeenCalledTimes(2);
    expect(rateLimit).toHaveBeenNthCalledWith(
      1,
      'responses',
      TEST_IP,
      perIp,
      windowSeconds,
    );
    expect(rateLimit).toHaveBeenNthCalledWith(
      2,
      'responses-session',
      SESSION_ID,
      perSession,
      windowSeconds,
    );
  });

  test('uses only the IP bucket when there is no session ID', async () => {
    await checkRateLimit(mockReq(), mockRes(), 'transcribe', {
      sessionId: null,
    });
    expect(rateLimit).toHaveBeenCalledTimes(1);
  });

  test('ignores the session for endpoints that have no per-session limit', async () => {
    await checkRateLimit(mockReq(), mockRes(), 'questions', {
      sessionId: SESSION_ID,
    });
    expect(rateLimit).toHaveBeenCalledTimes(1);
  });

  test('returns 429 with a Retry-After header when the IP limit is hit', async () => {
    rateLimit.mockResolvedValueOnce(blocked);
    const res = mockRes();

    const ok = await checkRateLimit(mockReq(), res, 'responses', {
      sessionId: SESSION_ID,
    });

    expect(ok).toBe(false);
    expect(res.statusCode).toBe(429);
    expect(res.headers['Retry-After']).toBe(
      String(RATE_LIMITS.responses.windowSeconds),
    );
    expect(res.body).toEqual({
      error: 'Too Many Requests',
      message: expect.any(String),
      retryAfterSeconds: RATE_LIMITS.responses.windowSeconds,
    });
    // No point spending a second Redis call once the IP is blocked.
    expect(rateLimit).toHaveBeenCalledTimes(1);
  });

  test('returns 429 when one session is over its own limit, even on a quiet IP', async () => {
    rateLimit.mockResolvedValueOnce(allowed).mockResolvedValueOnce(blocked);
    const res = mockRes();

    const ok = await checkRateLimit(mockReq(), res, 'sessionReflection', {
      sessionId: SESSION_ID,
    });

    expect(ok).toBe(false);
    expect(res.statusCode).toBe(429);
  });

  test('two people on the same IP do not share a session allowance', async () => {
    const otherSession = '11111111-2222-4333-8444-555555555555';
    await checkRateLimit(mockReq(), mockRes(), 'transcribe', {
      sessionId: SESSION_ID,
    });
    await checkRateLimit(mockReq(), mockRes(), 'transcribe', {
      sessionId: otherSession,
    });

    const sessionKeys = rateLimit.mock.calls
      .filter(([prefix]) => prefix === 'transcribe-session')
      .map(([, id]) => id);
    expect(sessionKeys).toEqual([SESSION_ID, otherSession]);
  });
});

describe('getSessionIdFromHeader', () => {
  test('returns a valid UUID from x-session-id', () => {
    const req = mockReq({ headers: { 'x-session-id': SESSION_ID } });
    expect(getSessionIdFromHeader(req)).toBe(SESSION_ID);
  });

  test.each([
    undefined,
    '',
    'nope',
    `${SESSION_ID}, ${SESSION_ID}`,
    '1; DROP TABLE',
  ])('returns null for %p', (value) => {
    const req = mockReq({
      headers: value === undefined ? {} : { 'x-session-id': value },
    });
    expect(getSessionIdFromHeader(req)).toBeNull();
  });
});

describe('RATE_LIMITS configuration', () => {
  test.each(Object.entries(RATE_LIMITS))(
    '%s has sensible numbers',
    (_name, config) => {
      expect(config.windowSeconds).toBeGreaterThan(0);
      expect(config.perIp).toBeGreaterThan(0);
      if (config.perSession) {
        // The IP allowance must be bigger than one person's, or shared wifi breaks.
        expect(config.perIp).toBeGreaterThan(config.perSession);
      }
    },
  );

  test.each(['transcribe', 'sessionReflection', 'groq'])(
    '%s allows more than the old 5-per-minute-per-IP limit',
    (name) => {
      expect(RATE_LIMITS[name].perIp).toBeGreaterThan(5);
    },
  );
});
