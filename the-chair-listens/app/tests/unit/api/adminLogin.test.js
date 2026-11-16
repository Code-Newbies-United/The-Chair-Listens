jest.mock("@/lib/supabaseServer", () => ({ createSupabaseServerClient: jest.fn() }));
jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: { from: jest.fn(), auth: { admin: { signOut: jest.fn() } } },
}));

import handler from "../../../pages/api/admin-login";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const USER = { id: "user-1", email: "a@example.com" };
const SESSION = { access_token: "token" };

function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}

function mockReq(email, password = "a-long-password-1") {
  return { method: "POST", body: { email, password }, headers: {}, socket: { remoteAddress: "1.1.1.1" } };
}

function mockSignIn(result) {
  const signInWithPassword = jest.fn().mockResolvedValue(result);
  const commitCookies = jest.fn();
  const discardCookies = jest.fn();
  createSupabaseServerClient.mockReturnValue({
    supabase: { auth: { signInWithPassword } },
    commitCookies,
    discardCookies,
  });
  return { signInWithPassword, commitCookies, discardCookies };
}

const GOOD_LOGIN = { data: { user: USER, session: SESSION }, error: null };
const BAD_LOGIN = { data: { user: null, session: null }, error: { message: "Invalid login credentials" } };

function mockAdminRow(row) {
  supabaseAdmin.from.mockReturnValue({
    select: () => ({ eq: () => ({ maybeSingle: jest.fn().mockResolvedValue({ data: row, error: null }) }) }),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  supabaseAdmin.auth.admin.signOut.mockResolvedValue({});
});

describe("POST /api/admin-login", () => {
  test("405 for non-POST", async () => {
    const res = mockRes();
    await handler({ method: "GET", headers: {} }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  test("400 when email or password is missing", async () => {
    const res = mockRes();
    await handler(mockReq("", ""), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(createSupabaseServerClient).not.toHaveBeenCalled();
  });

  test("unknown email or wrong password: 401 and no cookie", async () => {
    const s = mockSignIn(BAD_LOGIN);
    const res = mockRes();
    await handler(mockReq("unknown@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(s.commitCookies).not.toHaveBeenCalled();
  });

  test("valid Supabase user with no admins row: 401, no cookie, session ended", async () => {
    const s = mockSignIn(GOOD_LOGIN);
    mockAdminRow(null);
    const res = mockRes();
    await handler(mockReq("nonadmin@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(s.commitCookies).not.toHaveBeenCalled();
    expect(s.discardCookies).toHaveBeenCalled();
    expect(supabaseAdmin.auth.admin.signOut).toHaveBeenCalled();
  });

  test("inactive admin: 401 and no cookie", async () => {
    const s = mockSignIn(GOOD_LOGIN);
    mockAdminRow({ active: false });
    const res = mockRes();
    await handler(mockReq("inactive@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(s.commitCookies).not.toHaveBeenCalled();
  });

  test("active admin: 200 and the session cookie is issued", async () => {
    const s = mockSignIn(GOOD_LOGIN);
    mockAdminRow({ active: true });
    const res = mockRes();
    await handler(mockReq("active@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(s.commitCookies).toHaveBeenCalled();
  });

  test("same wrong-credentials message for every failure (no account hints)", async () => {
    mockSignIn(BAD_LOGIN);
    const res1 = mockRes();
    await handler(mockReq("hint1@example.com"), res1);
    mockSignIn(GOOD_LOGIN);
    mockAdminRow(null);
    const res2 = mockRes();
    await handler(mockReq("hint2@example.com"), res2);
    expect(res1.json.mock.calls[0][0].message).toBe(res2.json.mock.calls[0][0].message);
  });

  test("5 failed attempts block the 6th, which never reaches Supabase", async () => {
    const s = mockSignIn(BAD_LOGIN);
    for (let i = 0; i < 5; i++) {
      await handler(mockReq("locked@example.com"), mockRes());
    }
    s.signInWithPassword.mockClear();
    const res = mockRes();
    await handler(mockReq("locked@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(s.signInWithPassword).not.toHaveBeenCalled();
  });

  test("a successful login does not count towards the limit", async () => {
    mockSignIn(GOOD_LOGIN);
    mockAdminRow({ active: true });
    for (let i = 0; i < 7; i++) {
      const res = mockRes();
      await handler(mockReq("busy@example.com"), res);
      expect(res.status).toHaveBeenCalledWith(200);
    }
  });
});