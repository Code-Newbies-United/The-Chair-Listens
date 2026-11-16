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

describe('recentVisitorsByCity / GET /api/visitor-pins', () => {
  const rows = [
    { city: 'Pretoria', lat: -25.7, lng: 28.2, created_at: '2026-10-28T10:00:00Z' },
    { city: 'Pretoria', lat: -25.7, lng: 28.2, created_at: '2026-10-28T11:00:00Z' },
    { city: 'Durban', lat: -29.8, lng: 31.0, created_at: '2026-10-28T12:00:00Z' },
  ];

  function mockPinsQuery(result) {
    const query = {
      select: jest.fn(() => query),
      gte: jest.fn(() => query),
      order: jest.fn(async () => result),
    };
    supabaseAdmin.from.mockReturnValue(query);
  }

  test('groups pins by city with counts only', async () => {
    mockPinsQuery({ data: rows, error: null });
    const { visitors } = await recentVisitorsByCity();
    expect(visitors).toEqual([
      { location: 'Pretoria', visitor_count: 2, lat: -25.7, lng: 28.2 },
      { location: 'Durban', visitor_count: 1, lat: -29.8, lng: 31.0 },
    ]);
  });

  test('GET returns 200 with the grouped visitors', async () => {
    mockPinsQuery({ data: rows, error: null });
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.visitors).toHaveLength(2);
  });

  test('GET returns 500 in the standard shape if the query fails', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockPinsQuery({ data: null, error: new Error('boom') });
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Connection failed');
    spy.mockRestore();
  });

  test('there is no public way to write pins: POST is rejected', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'POST', body: { city: 'Fake' } }), res);
    expect(res.statusCode).toBe(405);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });
});
