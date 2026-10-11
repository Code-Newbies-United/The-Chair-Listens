import handler from '@/pages/api/consent';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { CONSENT_VERSION } from '@/lib/consentVersion';
import { MAX_CONSENT_VERSION_CHARS } from '@/lib/limits';
import { mockReq, mockRes, TEST_IP } from '../helpers/http';

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));
jest.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: { from: jest.fn() },
}));

let locationsTable;
let sessionsTable;
let location;

beforeEach(() => {
  jest.clearAllMocks();
  rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });

  location = { id: '7a6b5c4d-3e2f-4a1b-8c9d-0e1f2a3b4c5d', name: 'Chair 1' };
  locationsTable = {
    select: jest.fn(() => locationsTable),
    eq: jest.fn(() => locationsTable),
    maybeSingle: jest.fn(async () => ({ data: location, error: null })),
  };
  sessionsTable = {
    insert: jest.fn(() => sessionsTable),
    select: jest.fn(() => sessionsTable),
    single: jest.fn(async () => ({
      data: { id: 'new-session-id' },
      error: null,
    })),
  };
  supabaseAdmin.from.mockImplementation((table) =>
    table === 'locations' ? locationsTable : sessionsTable,
  );
});

const post = async (body, options = {}) => {
  const res = mockRes();
  await handler(mockReq({ body, ...options }), res);
  return res;
};

describe('/api/consent', () => {
  test('rejects anything but POST with 405 and an Allow header', async () => {
    const res = await post(undefined, { method: 'GET' });
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
    expect(res.body.error).toBe('Method Not Allowed');
  });

  test('rate limits by IP only (there is no session yet)', async () => {
    await post({ consent_version: CONSENT_VERSION });
    const { perIp, windowSeconds } = RATE_LIMITS.consent;
    expect(rateLimit).toHaveBeenCalledTimes(1);
    expect(rateLimit).toHaveBeenCalledWith(
      'consent',
      TEST_IP,
      perIp,
      windowSeconds,
    );
  });

  test('returns 429 and creates nothing when the IP is over its limit', async () => {
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 31 });
    const res = await post({ consent_version: CONSENT_VERSION });

    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Too Many Requests');
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test.each([
    ['no body', undefined],
    ['a null body', null],
    ['an array body', []],
    ['a missing consent_version', {}],
    ['a consent_version that is not text', { consent_version: 1 }],
    ['an object instead of text', { consent_version: { $ne: '' } }],
    [
      'an oversized consent_version',
      { consent_version: 'v'.repeat(MAX_CONSENT_VERSION_CHARS + 1) },
    ],
  ])('returns 400 for %s, with no database access', async (_label, body) => {
    const res = await post(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(Array.isArray(res.body.issues)).toBe(true);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test('returns 409 when the consent wording is out of date', async () => {
    const res = await post({ consent_version: 'old-version' });
    expect(res.statusCode).toBe(409);
    expect(sessionsTable.insert).not.toHaveBeenCalled();
  });

  test('returns 503 when no chair location is active', async () => {
    location = null;
    const res = await post({ consent_version: CONSENT_VERSION });
    expect(res.statusCode).toBe(503);
    expect(sessionsTable.insert).not.toHaveBeenCalled();
  });

  test('creates a session and returns its ID', async () => {
    const res = await post({ consent_version: CONSENT_VERSION });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ sessionId: 'new-session-id' });
    expect(sessionsTable.insert).toHaveBeenCalledWith({
      chair_location_id: location.id,
      location_id: 'Chair 1',
      consent_version: CONSENT_VERSION,
    });
  });
});
