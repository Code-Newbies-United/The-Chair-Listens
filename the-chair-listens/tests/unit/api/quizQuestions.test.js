import handler from '@/pages/api/quiz-questions';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { mockReq, mockRes, TEST_IP } from '../helpers/http';

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));
jest.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: { from: jest.fn() },
}));

let table;

beforeEach(() => {
  jest.clearAllMocks();
  rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });

  table = {
    select: jest.fn(() => table),
    order: jest.fn(async () => ({ data: [{ id: 'qq1' }], error: null })),
  };
  supabaseAdmin.from.mockReturnValue(table);
});

const get = async (options = {}) => {
  const res = mockRes();
  await handler(mockReq({ method: 'GET', ...options }), res);
  return res;
};

describe('/api/quiz-questions', () => {
  test('rejects anything but GET with 405 and an Allow header', async () => {
    const res = await get({ method: 'POST' });
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('GET');
  });

  test('rate limits by IP', async () => {
    await get();
    const { perIp, windowSeconds } = RATE_LIMITS.quizQuestions;
    expect(rateLimit).toHaveBeenCalledWith(
      'quizQuestions',
      TEST_IP,
      perIp,
      windowSeconds,
    );
  });

  test('returns 429 without querying the database when over the limit', async () => {
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 121 });
    const res = await get();

    expect(res.statusCode).toBe(429);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test('returns the quiz questions', async () => {
    const res = await get();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ questions: [{ id: 'qq1' }] });
  });

  test('returns 500 in the standard error shape when the database fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    table.order.mockResolvedValue({ data: null, error: new Error('boom') });
    const res = await get();

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Connection failed');
    console.error.mockRestore();
  });
});
