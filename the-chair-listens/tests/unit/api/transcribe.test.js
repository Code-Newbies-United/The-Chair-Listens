/** @jest-environment node */
import handler from '@/pages/api/transcribe';
import { rateLimit } from '@/lib/rateLimit';
import { RATE_LIMITS } from '@/lib/apiGuard';
import { mockReq, mockRes, SESSION_ID, TEST_IP } from '../helpers/http';

const mockTranscribe = jest.fn();

jest.mock('groq-sdk', () =>
  jest.fn(() => ({
    audio: { transcriptions: { create: (...args) => mockTranscribe(...args) } },
  })),
);
// No real upload in unit tests: pretend the form had no audio file in it.
jest.mock('formidable', () => () => ({ parse: async () => [{}, {}] }));
jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));

describe('/api/transcribe rate limiting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });
  });

  test('rejects anything but POST with 405 and an Allow header', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
  });

  test('limits per IP and per session, and allows more than the old 5/min per IP', async () => {
    const res = mockRes();
    await handler(mockReq({ headers: { 'x-session-id': SESSION_ID } }), res);

    const { perIp, perSession, windowSeconds } = RATE_LIMITS.transcribe;
    expect(perIp).toBeGreaterThan(5);
    expect(rateLimit).toHaveBeenCalledWith(
      'transcribe',
      TEST_IP,
      perIp,
      windowSeconds,
    );
    expect(rateLimit).toHaveBeenCalledWith(
      'transcribe-session',
      SESSION_ID,
      perSession,
      windowSeconds,
    );
  });

  test('returns 400 in the standard shape when no audio is attached', async () => {
    const res = mockRes();
    await handler(mockReq(), res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'No audio file uploaded',
    });
    expect(mockTranscribe).not.toHaveBeenCalled();
  });

  test('returns 429 in the standard shape, without calling Groq, when over the limit', async () => {
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 31 });
    const res = mockRes();
    await handler(mockReq(), res);

    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Too Many Requests');
    expect(mockTranscribe).not.toHaveBeenCalled();
  });
});

describe('/api/transcribe upload size and failures', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });
  });

  test('refuses a huge upload straight away with 413, before reading any of it', async () => {
    const res = mockRes();
    await handler(
      mockReq({ headers: { 'content-length': String(25 * 1024 * 1024) } }),
      res,
    );

    expect(res.statusCode).toBe(413);
    expect(res.body.error).toBe('Payload Too Large');
    expect(res.body.message).toMatch(/shorter/i);
    expect(mockTranscribe).not.toHaveBeenCalled();
  });

  test('the size limit is below the 4.5 MB Vercel itself enforces', () => {
    const { MAX_AUDIO_BYTES } = require('@/lib/limits');
    expect(MAX_AUDIO_BYTES).toBeLessThan(4.5 * 1024 * 1024);
  });

  test('a normal-sized upload is not refused for its size', async () => {
    const res = mockRes();
    await handler(
      mockReq({ headers: { 'content-length': String(300 * 1024) } }),
      res,
    );
    // The mocked form has no audio in it, so this reaches the "no file" answer.
    expect(res.statusCode).toBe(400);
  });
});
