jest.mock("@/lib/requireAdmin", () => ({ requireAdmin: jest.fn() }));
jest.mock("@/lib/supabaseServer", () => ({ createSupabaseServerClient: jest.fn() }));
jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: jest.fn(),
    auth: {
      admin: { inviteUserByEmail: jest.fn(), updateUserById: jest.fn(), signOut: jest.fn() },
    },
  },
}));

import inviteHandler from "../../../pages/api/admin/invite";
import acceptHandler from "../../../pages/api/admin/accept-invite";
import setPasswordHandler from "../../../pages/api/admin/set-password";
import { validatePassword } from "../../../lib/adminInvite";
import { requireAdmin } from "@/lib/requireAdmin";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const INVITED = { id: "u1", email: "New@Example.com", app_metadata: { admin_invite: true } };

function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}

// supabaseAdmin.from("admins") with a configurable existing row and insert result
function mockAdminsTable({ existing = null, insertError = null } = {}) {
  const insert = jest.fn().mockResolvedValue({ error: insertError });
  const del = jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) }));
  supabaseAdmin.from.mockReturnValue({
    select: () => ({ eq: () => ({ maybeSingle: jest.fn().mockResolvedValue({ data: existing, error: null }) }) }),
    insert,
    delete: del,
  });
  return { insert, del };
}

function mockSupabaseSession({ user = null, verify } = {}) {
  const commitCookies = jest.fn();
  const discardCookies = jest.fn();
  createSupabaseServerClient.mockReturnValue({
    supabase: {
      auth: {
        getUser: jest.fn().mockResolvedValue(
          user ? { data: { user }, error: null } : { data: { user: null }, error: { message: "none" } }
        ),
        verifyOtp: jest.fn().mockResolvedValue(verify || { data: {}, error: { message: "bad" } }),
      },
    },
    commitCookies,
    discardCookies,
  });
  return { commitCookies, discardCookies };
}

beforeEach(() => {
  jest.clearAllMocks();
  supabaseAdmin.auth.admin.updateUserById.mockResolvedValue({ error: null });
  supabaseAdmin.auth.admin.signOut.mockResolvedValue({});
});

describe("validatePassword", () => {
  test("accepts 12 to 72 characters only", () => {
    expect(validatePassword("a".repeat(11))).toMatch(/at least 12/);
    expect(validatePassword("a".repeat(12))).toBeNull();
    expect(validatePassword("a".repeat(72))).toBeNull();
    expect(validatePassword("a".repeat(73))).toMatch(/at most 72/);
    expect(validatePassword(undefined)).toBeTruthy();
  });
});

describe("POST /api/admin/invite", () => {
  test("401 when not an active admin; nothing is sent", async () => {
    requireAdmin.mockResolvedValue(null);
    const res = mockRes();
    await inviteHandler({ method: "POST", body: { email: "x@example.com" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.auth.admin.inviteUserByEmail).not.toHaveBeenCalled();
  });

  test("405 for non-POST", async () => {
    const res = mockRes();
    await inviteHandler({ method: "GET" }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  test("400 for an invalid email", async () => {
    requireAdmin.mockResolvedValue({ id: "a", email: "a@example.com", role: "admin" });
    const res = mockRes();
    await inviteHandler({ method: "POST", body: { email: "not-an-email" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("active admin: sends the invite and sets the server-side invite flag", async () => {
    requireAdmin.mockResolvedValue({ id: "a", email: "a@example.com", role: "admin" });
    supabaseAdmin.auth.admin.inviteUserByEmail.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    const res = mockRes();
    await inviteHandler({ method: "POST", body: { email: " New@Example.com " } }, res);
    expect(supabaseAdmin.auth.admin.inviteUserByEmail).toHaveBeenCalledWith("new@example.com");
    expect(supabaseAdmin.auth.admin.updateUserById).toHaveBeenCalledWith("u1", {
      app_metadata: { admin_invite: true },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("POST /api/admin/accept-invite", () => {
  test("rejects a missing token without touching Supabase", async () => {
    const res = mockRes();
    await acceptHandler({ method: "POST", body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(createSupabaseServerClient).not.toHaveBeenCalled();
  });

  test("bad or used token: 401, no cookie", async () => {
    const cookies = mockSupabaseSession();
    const res = mockRes();
    await acceptHandler({ method: "POST", body: { token_hash: "abc" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(cookies.commitCookies).not.toHaveBeenCalled();
  });

  test("valid token but NOT an admin invite: 401, no cookie, session killed", async () => {
    const cookies = mockSupabaseSession({
      verify: { data: { user: { id: "u9", app_metadata: {} }, session: { access_token: "t" } }, error: null },
    });
    const res = mockRes();
    await acceptHandler({ method: "POST", body: { token_hash: "abc" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(cookies.commitCookies).not.toHaveBeenCalled();
    expect(cookies.discardCookies).toHaveBeenCalled();
    expect(supabaseAdmin.auth.admin.signOut).toHaveBeenCalled();
  });

  test("invite for someone who already has an admins row: 401, no cookie", async () => {
    mockAdminsTable({ existing: { user_id: "u1" } });
    const cookies = mockSupabaseSession({
      verify: { data: { user: INVITED, session: { access_token: "t" } }, error: null },
    });
    const res = mockRes();
    await acceptHandler({ method: "POST", body: { token_hash: "abc" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(cookies.commitCookies).not.toHaveBeenCalled();
  });

  test("genuine admin invite: cookie issued", async () => {
    mockAdminsTable({ existing: null });
    const cookies = mockSupabaseSession({
      verify: { data: { user: INVITED, session: { access_token: "t" } }, error: null },
    });
    const res = mockRes();
    await acceptHandler({ method: "POST", body: { token_hash: "abc" } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(cookies.commitCookies).toHaveBeenCalled();
  });
});

describe("POST /api/admin/set-password", () => {
  test("short password: 400 before anything else", async () => {
    const res = mockRes();
    await setPasswordHandler({ method: "POST", body: { password: "short" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(createSupabaseServerClient).not.toHaveBeenCalled();
  });

  test("no invite session: 401", async () => {
    mockSupabaseSession({ user: null });
    const res = mockRes();
    await setPasswordHandler({ method: "POST", body: { password: "a-long-password-1" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("normal signed-in user without the invite flag: 401", async () => {
    mockSupabaseSession({ user: { id: "u2", app_metadata: {} } });
    const res = mockRes();
    await setPasswordHandler({ method: "POST", body: { password: "a-long-password-1" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.auth.admin.updateUserById).not.toHaveBeenCalled();
  });

  test("an admins row already exists (even deactivated): refused, nothing changed", async () => {
    const { insert } = mockAdminsTable({ existing: { user_id: "u1" } });
    mockSupabaseSession({ user: INVITED });
    const res = mockRes();
    await setPasswordHandler({ method: "POST", body: { password: "a-long-password-1" } }, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(insert).not.toHaveBeenCalled();
    expect(supabaseAdmin.auth.admin.updateUserById).not.toHaveBeenCalled();
  });

  test("race on insert (duplicate key): refused, password untouched", async () => {
    mockAdminsTable({ existing: null, insertError: { code: "23505" } });
    mockSupabaseSession({ user: INVITED });
    const res = mockRes();
    await setPasswordHandler({ method: "POST", body: { password: "a-long-password-1" } }, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(supabaseAdmin.auth.admin.updateUserById).not.toHaveBeenCalled();
  });

  test("valid invite: creates the admin row, sets the password, clears the flag", async () => {
    const { insert } = mockAdminsTable({ existing: null });
    mockSupabaseSession({ user: INVITED });
    const res = mockRes();
    await setPasswordHandler({ method: "POST", body: { password: "a-long-password-1" } }, res);
    expect(insert).toHaveBeenCalledWith({ user_id: "u1", email: "new@example.com", role: "admin", active: true });
    expect(supabaseAdmin.auth.admin.updateUserById).toHaveBeenCalledWith("u1", {
      password: "a-long-password-1",
      app_metadata: { admin_invite: null },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("password update fails: the admins row is rolled back", async () => {
    const { del } = mockAdminsTable({ existing: null });
    mockSupabaseSession({ user: INVITED });
    supabaseAdmin.auth.admin.updateUserById.mockResolvedValue({ error: { message: "weak" } });
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = mockRes();
    await setPasswordHandler({ method: "POST", body: { password: "a-long-password-1" } }, res);
    expect(del).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    console.error.mockRestore();
  });
});
