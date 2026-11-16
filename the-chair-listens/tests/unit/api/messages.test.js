import handler from '@/pages/api/messages';
import { rateLimit } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { MAX_MESSAGE_CHARS } from '@/lib/limits';
import { mockReq, mockRes, SESSION_ID } from '../helpers/http';

jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIp: jest.fn(() => '203.0.113.7'),
}));
jest.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: { from: jest.fn() },
}));

let sessionRow;
let sessionsTable;
let messagesTable;

beforeEach(() => {
  jest.clearAllMocks();
  rateLimit.mockResolvedValue({ allowed: true, remaining: 5, count: 1 });

  sessionRow = { id: SESSION_ID, consented_at: new Date().toISOString() };
  sessionsTable = {
    select: jest.fn(() => sessionsTable),
    eq: jest.fn(() => sessionsTable),
    maybeSingle: jest.fn(async () => ({ data: sessionRow, error: null })),
  };
  messagesTable = {
    // GET chain: select().eq().order().limit()
    select: jest.fn(() => messagesTable),
    eq: jest.fn(() => messagesTable),
    order: jest.fn(() => messagesTable),
    limit: jest.fn(async () => ({
      data: [{ id: '1', message: 'Hello', created_at: 'x' }],
      error: null,
    })),
    // POST chain: insert().select().single()
    insert: jest.fn(() => messagesTable),
    single: jest.fn(async () => ({
      data: { id: '2', message: 'Be kind', created_at: 'x' },
      error: null,
    })),
  };
  supabaseAdmin.from.mockImplementation((table) =>
    table === 'sessions' ? sessionsTable : messagesTable,
  );
});

const post = async (body, headers = { 'x-session-id': SESSION_ID }) => {
  const res = mockRes();
  await handler(mockReq({ method: 'POST', body, headers }), res);
  return res;
};

describe('/api/messages', () => {
  test('rejects other methods with 405 and an Allow header', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'DELETE' }), res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('GET, POST');
  });

  test('GET returns only visible messages', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.messages).toHaveLength(1);
    expect(messagesTable.eq).toHaveBeenCalledWith('is_visible', true);
  });

  test('POST without a consent session header returns 403 and saves nothing', async () => {
    const res = await post({ message: 'Hi' }, {});
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Consent required');
    expect(messagesTable.insert).not.toHaveBeenCalled();
  });

  test('POST with an unknown session returns 403', async () => {
    sessionsTable.maybeSingle.mockResolvedValue({ data: null, error: null });
    const res = await post({ message: 'Hi' });
    expect(res.statusCode).toBe(403);
    expect(messagesTable.insert).not.toHaveBeenCalled();
  });

  test('POST with an expired session returns 403', async () => {
    sessionRow.consented_at = new Date(
      Date.now() - 48 * 60 * 60 * 1000,
    ).toISOString();
    const res = await post({ message: 'Hi' });
    expect(res.statusCode).toBe(403);
  });

  test.each([
    ['missing', undefined],
    ['blank', '   '],
    ['not text', 123],
    ['too long', 'a'.repeat(MAX_MESSAGE_CHARS + 1)],
  ])('POST with a %s message returns 400 and saves nothing', async (_l, message) => {
    const res = await post({ message });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(messagesTable.insert).not.toHaveBeenCalled();
  });

  test('POST saves the trimmed message against the consent session', async () => {
    const res = await post({ message: '  Be kind  ' });
    expect(res.statusCode).toBe(201);
    expect(messagesTable.insert).toHaveBeenCalledWith({
      message: 'Be kind',
      session_id: SESSION_ID,
      is_visible: true,
    });
  });

  test('POST returns 429 when over the rate limit', async () => {
    rateLimit.mockResolvedValue({ allowed: false, remaining: 0, count: 99 });
    const res = await post({ message: 'Hi' });
    expect(res.statusCode).toBe(429);
    expect(messagesTable.insert).not.toHaveBeenCalled();
  });
});
