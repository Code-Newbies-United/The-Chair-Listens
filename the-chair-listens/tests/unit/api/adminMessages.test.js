import handler from '@/pages/api/admin/messages';
import { verifyAdminSession } from '@/lib/adminsession';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { mockReq, mockRes, SESSION_ID } from '../helpers/http';

jest.mock('@/lib/adminsession', () => ({ verifyAdminSession: jest.fn() }));
jest.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: { from: jest.fn() },
}));

let table;

beforeEach(() => {
  jest.clearAllMocks();
  verifyAdminSession.mockReturnValue(true);
  table = {
    select: jest.fn(() => table),
    order: jest.fn(() => table),
    limit: jest.fn(async () => ({
      data: [{ id: SESSION_ID, message: 'hello', created_at: 'x' }],
      error: null,
    })),
    delete: jest.fn(() => table),
    eq: jest.fn(() => table),
  };
  supabaseAdmin.from.mockReturnValue(table);
});

const call = async (opts) => {
  const res = mockRes();
  await handler(mockReq(opts), res);
  return res;
};

describe('/api/admin/messages', () => {
  test.each(['GET', 'DELETE'])('%s without an admin session returns 401 and touches nothing', async (method) => {
    verifyAdminSession.mockReturnValue(false);
    const res = await call({ method, query: { id: SESSION_ID } });
    expect(res.statusCode).toBe(401);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test('other methods return 405 with an Allow header', async () => {
    const res = await call({ method: 'POST' });
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('GET, DELETE');
  });

  test('GET lists all messages for the admin', async () => {
    const res = await call({ method: 'GET' });
    expect(res.statusCode).toBe(200);
    expect(res.body.messages).toHaveLength(1);
    expect(supabaseAdmin.from).toHaveBeenCalledWith('messages');
  });

  test('GET returns 500 in the standard shape if the query fails', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    table.limit.mockResolvedValue({ data: null, error: new Error('boom') });
    const res = await call({ method: 'GET' });
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Connection failed');
    spy.mockRestore();
  });

  test.each([undefined, 'abc', "1' or 1=1", ['a', 'b']])('DELETE with an invalid id (%p) returns 400 and deletes nothing', async (id) => {
    const res = await call({ method: 'DELETE', query: { id } });
    expect(res.statusCode).toBe(400);
    expect(table.delete).not.toHaveBeenCalled();
  });

  test('DELETE removes exactly the requested message', async () => {
    table.select.mockResolvedValue({ data: [{ id: SESSION_ID }], error: null });
    const res = await call({ method: 'DELETE', query: { id: SESSION_ID } });
    expect(res.statusCode).toBe(200);
    expect(table.delete).toHaveBeenCalled();
    expect(table.eq).toHaveBeenCalledWith('id', SESSION_ID);
    expect(res.body).toEqual({ success: true, id: SESSION_ID });
  });

  test('DELETE returns 404 when the message is already gone', async () => {
    table.select.mockResolvedValue({ data: [], error: null });
    const res = await call({ method: 'DELETE', query: { id: SESSION_ID } });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE returns 500 if the database fails', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    table.select.mockResolvedValue({ data: null, error: new Error('boom') });
    const res = await call({ method: 'DELETE', query: { id: SESSION_ID } });
    expect(res.statusCode).toBe(500);
    spy.mockRestore();
  });
});
