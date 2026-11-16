import { rateLimit, getClientIp } from '@/lib/rateLimit';

const mockExec = jest.fn();
const mockMulti = {
  zremrangebyscore: jest.fn().mockReturnThis(),
  zadd: jest.fn().mockReturnThis(),
  zcard: jest.fn().mockReturnThis(),
  expire: jest.fn().mockReturnThis(),
  exec: mockExec,
};

jest.mock('@upstash/redis', () => ({
  Redis: { fromEnv: () => ({ multi: () => mockMulti }) },
}));

// exec() returns one result per queued command: [remove, add, count, expire]
const redisCount = (count) => [0, 1, count, 1];

const NOW = 1_000_000;

describe('rateLimit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('allows a request below the limit', async () => {
    mockExec.mockResolvedValue(redisCount(1));
    const result = await rateLimit('groq', '192.168.1.10', 10, 60);
    expect(result).toEqual({ allowed: true, remaining: 9, count: 1 });
  });

  test('allows the request that reaches the limit exactly', async () => {
    mockExec.mockResolvedValue(redisCount(10));
    const result = await rateLimit('groq', '192.168.1.10', 10, 60);
    expect(result).toEqual({ allowed: true, remaining: 0, count: 10 });
  });

  test('blocks the request after the limit', async () => {
    mockExec.mockResolvedValue(redisCount(11));
    const result = await rateLimit('groq', '192.168.1.10', 10, 60);
    expect(result).toEqual({ allowed: false, remaining: 0, count: 11 });
  });

  test('keeps a separate sliding window per endpoint and per caller', async () => {
    mockExec.mockResolvedValue(redisCount(1));
    await rateLimit('responses-session', 'abc', 10, 60);

    const key = 'rate-limit:responses-session:abc';
    expect(mockMulti.zremrangebyscore).toHaveBeenCalledWith(
      key,
      0,
      NOW - 60_000,
    );
    expect(mockMulti.zadd).toHaveBeenCalledWith(key, {
      score: NOW,
      member: expect.stringMatching(/^1000000-/),
    });
    expect(mockMulti.zcard).toHaveBeenCalledWith(key);
    expect(mockMulti.expire).toHaveBeenCalledWith(key, 60);
  });

  test('lets requests through when Redis is down (default: fail open)', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockExec.mockRejectedValue(new Error('connection refused'));

    const result = await rateLimit('groq', '192.168.1.10', 10, 60);
    expect(result).toEqual({ allowed: true, remaining: 10, count: 0 });
  });

  test('blocks requests when Redis is down and failOpen is false', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockExec.mockRejectedValue(new Error('connection refused'));

    const result = await rateLimit('admin-login', '192.168.1.10', 5, 60, {
      failOpen: false,
    });
    expect(result).toEqual({ allowed: false, remaining: 0, count: 0 });
  });
});

describe('getClientIp', () => {
  test('uses the first address in x-forwarded-for', () => {
    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
      socket: {},
    };
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  test('falls back to the socket address', () => {
    const req = { headers: {}, socket: { remoteAddress: '9.9.9.9' } };
    expect(getClientIp(req)).toBe('9.9.9.9');
  });

  test('returns "unknown" when nothing is available', () => {
    expect(getClientIp({ headers: {} })).toBe('unknown');
  });
});
