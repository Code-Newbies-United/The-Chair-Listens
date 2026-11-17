import handler from '@/pages/api/visitor-pins';
import { recordVisit, recentVisitorsByCity } from '@/lib/visitorPins';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { mockReq, mockRes } from '../helpers/http';

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));
jest.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: { from: jest.fn(), rpc: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
  rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });
});

describe('recordVisit (called by the server when someone consents)', () => {
  test('does nothing without a city', async () => {
    await recordVisit({ city: '' });
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test('inserts a pin and increments the city total', async () => {
    const insert = jest.fn().mockResolvedValue({ error: null });
    supabaseAdmin.from.mockReturnValue({ insert });
    supabaseAdmin.rpc.mockResolvedValue({ error: null });

    await recordVisit({ city: 'Pretoria', lat: -25.7, lng: 28.2 });

    expect(supabaseAdmin.from).toHaveBeenCalledWith('visitor_pins');
    expect(insert).toHaveBeenCalledWith({
      city: 'Pretoria',
      lat: -25.7,
      lng: 28.2,
    });
    expect(supabaseAdmin.rpc).toHaveBeenCalledWith('increment_city_visit', {
      p_city: 'Pretoria',
      p_lat: -25.7,
      p_lng: 28.2,
    });
  });

  test('never throws: a database failure must not block a session', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabaseAdmin.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: new Error('boom') }),
    });
    await expect(recordVisit({ city: 'Pretoria' })).resolves.toBeUndefined();
    expect(supabaseAdmin.rpc).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('recentVisitorsByCity (the database does the counting)', () => {
  const aggregated = [
    { city: 'Pretoria', lat: -25.7, lng: 28.2, visitor_count: 2 },
    { city: 'Durban', lat: -29.8, lng: 31.0, visitor_count: 1 },
  ];

  test('calls the SQL function for the last 24 hours and maps its rows', async () => {
    supabaseAdmin.rpc.mockResolvedValue({ data: aggregated, error: null });

    const { visitors } = await recentVisitorsByCity();

    expect(supabaseAdmin.rpc).toHaveBeenCalledWith('recent_visitors_by_city', {
      p_hours: 24,
    });
    // It must NOT download the individual pins any more.
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
    expect(visitors).toEqual([
      { location: 'Pretoria', visitor_count: 2, lat: -25.7, lng: 28.2 },
      { location: 'Durban', visitor_count: 1, lat: -29.8, lng: 31.0 },
    ]);
  });

  test('counts above 1,000 survive (Postgres bigint can arrive as a string)', async () => {
    supabaseAdmin.rpc.mockResolvedValue({
      data: [{ city: 'Pretoria', lat: -25.7, lng: 28.2, visitor_count: '5000' }],
      error: null,
    });

    const { visitors } = await recentVisitorsByCity();
    expect(visitors[0].visitor_count).toBe(5000);
  });

  test('returns an empty list when nobody visited', async () => {
    supabaseAdmin.rpc.mockResolvedValue({ data: [], error: null });
    expect(await recentVisitorsByCity()).toEqual({ visitors: [] });
  });

  test('returns the error for any other database failure', async () => {
    const failure = { message: 'boom', code: 'XX000' };
    supabaseAdmin.rpc.mockResolvedValue({ data: null, error: failure });
    expect(await recentVisitorsByCity()).toEqual({ error: failure });
  });

  test('before the SQL migration has been run, falls back to the old capped query instead of breaking the map', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabaseAdmin.rpc.mockResolvedValue({
      data: null,
      error: { code: 'PGRST202', message: 'function not found' },
    });
    const query = {
      select: jest.fn(() => query),
      gte: jest.fn(() => query),
      order: jest.fn(async () => ({
        data: [
          { city: 'Pretoria', lat: -25.7, lng: 28.2, created_at: '2026-10-28T10:00:00Z' },
          { city: 'Pretoria', lat: -25.7, lng: 28.2, created_at: '2026-10-28T11:00:00Z' },
          { city: 'Durban', lat: -29.8, lng: 31.0, created_at: '2026-10-28T12:00:00Z' },
        ],
        error: null,
      })),
    };
    supabaseAdmin.from.mockReturnValue(query);

    const { visitors } = await recentVisitorsByCity();

    expect(visitors).toEqual([
      { location: 'Pretoria', visitor_count: 2, lat: -25.7, lng: 28.2 },
      { location: 'Durban', visitor_count: 1, lat: -29.8, lng: 31.0 },
    ]);
    // The log tells whoever reads it exactly what to do.
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('fix-pins-aggregate.sql'));
    spy.mockRestore();
  });
});

describe('GET /api/visitor-pins', () => {
  test('returns 200 with the grouped visitors and lets the CDN cache it', async () => {
    supabaseAdmin.rpc.mockResolvedValue({
      data: [
        { city: 'Pretoria', lat: -25.7, lng: 28.2, visitor_count: 2 },
        { city: 'Durban', lat: -29.8, lng: 31.0, visitor_count: 1 },
      ],
      error: null,
    });
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);

    expect(res.statusCode).toBe(200);
    expect(res.body.visitors).toHaveLength(2);
    expect(res.headers['Cache-Control']).toMatch(/s-maxage=30/);
  });

  test('returns 500 in the standard shape if the query fails, and never caches the error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabaseAdmin.rpc.mockResolvedValue({
      data: null,
      error: { message: 'boom', code: 'XX000' },
    });
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Connection failed');
    expect(res.headers['Cache-Control']).toBeUndefined();
    spy.mockRestore();
  });

  test('is rate limited: returns 429 without touching the database', async () => {
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 601 });
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);

    expect(res.statusCode).toBe(429);
    expect(supabaseAdmin.rpc).not.toHaveBeenCalled();
  });

  test('there is no public way to write pins: POST is rejected', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'POST', body: { city: 'Fake' } }), res);
    expect(res.statusCode).toBe(405);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
    expect(supabaseAdmin.rpc).not.toHaveBeenCalled();
  });
});
