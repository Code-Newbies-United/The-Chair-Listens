jest.mock("@/lib/requireAdmin", () => ({ requireAdmin: jest.fn() }));
jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: jest.fn(),
    auth: { admin: { createUser: jest.fn(), deleteUser: jest.fn() } },
  },
}));

import addAdminHandler from "../../../pages/api/admin/add-admin";
import registerHandler from "../../../pages/api/admin/register";
import { generateCode, hashCode, codeMatches, normalizeCode } from "../../../lib/adminCode";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ME = { id: "me", email: "me@example.com", role: "admin" };
const CODE = "ABCD-EFGH-JKLM";
const PASSWORD = "a-long-password-1";

function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), setHeader: jest.fn() };
}

function chain(result) {
  const c = {};
  ["select", "eq", "is", "gt", "order", "update", "insert"].forEach((m) => {
    c[m] = jest.fn(() => c);
  });
  c.maybeSingle = jest.fn(() => Promise.resolve(result));
  c.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return c;
}

function fromSequence(...results) {
  const chains = results.map(chain);
  chains.forEach((c) => supabaseAdmin.from.mockReturnValueOnce(c));
  return chains;
}

function registerReq(email, overrides = {}) {
  return {
    method: "POST",
    headers: {},
    socket: { remoteAddress: "9.9.9.9" },
    body: { email, code: CODE, password: PASSWORD, ...overrides },
  };
}

const OPEN_INVITE = () => ({
  data: { id: "i1", code_hash: hashCode(CODE), expires_at: new Date(Date.now() + 86400000).toISOString() },
  error: null,
});

beforeEach(() => {
  jest.resetAllMocks();
  requireAdmin.mockResolvedValue(ME);
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

describe("invitation codes", () => {
  test("generateCode makes a readable, unique code", () => {
    const a = generateCode();
    expect(a).toMatch(/^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){2}$/);
    expect(generateCode()).not.toBe(a);
  });

  test("a code matches in any case and with or without dashes", () => {
    const hash = hashCode(CODE);
    expect(codeMatches("abcd-efgh-jklm", hash)).toBe(true);
    expect(codeMatches("ABCDEFGHJKLM", hash)).toBe(true);
    expect(codeMatches("ABCD-EFGH-JKLN", hash)).toBe(false);
    expect(codeMatches("", hash)).toBe(false);
    expect(normalizeCode(" ab-cd ")).toBe("ABCD");
  });
});

describe("POST /api/admin/add-admin", () => {
  test("401 when not an active admin; nothing created", async () => {
    requireAdmin.mockResolvedValue(null);
    const res = mockRes();
    await addAdminHandler({ method: "POST", body: { email: "x@example.com" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("405 for non-POST", async () => {
    const res = mockRes();
    await addAdminHandler({ method: "GET" }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  test("400 for an invalid email", async () => {
    const res = mockRes();
    await addAdminHandler({ method: "POST", body: { email: "nope" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("409 when the person is already an admin", async () => {
    fromSequence({ data: { user_id: "a1" }, error: null });
    const res = mockRes();
    await addAdminHandler({ method: "POST", body: { email: "has@example.com" } }, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("creates a code, stores only its hash, and replaces any older open code", async () => {
    const [, revoke, insert] = fromSequence({ data: null, error: null }, { error: null }, { error: null });
    const res = mockRes();
    await addAdminHandler({ method: "POST", body: { email: " New@Example.com " } }, res);

    const body = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(body.email).toBe("new@example.com");
    expect(body.code).toMatch(/^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){2}$/);
    expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");

    expect(revoke.update).toHaveBeenCalledWith({ revoked_at: expect.any(String) });
    const stored = insert.insert.mock.calls[0][0];
    expect(stored.code_hash).toBe(hashCode(body.code));
    expect(JSON.stringify(stored)).not.toContain(body.code);
    expect(stored.created_by).toBe("me");
    expect(new Date(stored.expires_at).getTime()).toBeGreaterThan(Date.now());
  });
});

describe("POST /api/admin/register", () => {
  test("405 for non-POST", async () => {
    const res = mockRes();
    await registerHandler({ method: "GET", headers: {} }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  test("400 when the code is missing", async () => {
    const res = mockRes();
    await registerHandler(registerReq("a1@example.com", { code: "" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("400 for a short password", async () => {
    const res = mockRes();
    await registerHandler(registerReq("a2@example.com", { password: "short" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("401 when no open invitation exists for that email", async () => {
    fromSequence({ data: null, error: null });
    const res = mockRes();
    await registerHandler(registerReq("a3@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.auth.admin.createUser).not.toHaveBeenCalled();
  });

  test("401 for a wrong code; no account created", async () => {
    fromSequence(OPEN_INVITE());
    const res = mockRes();
    await registerHandler(registerReq("a4@example.com", { code: "ZZZZ-ZZZZ-ZZZZ" }), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.auth.admin.createUser).not.toHaveBeenCalled();
  });

  test("401 for an expired code", async () => {
    fromSequence({
      data: { id: "i1", code_hash: hashCode(CODE), expires_at: new Date(Date.now() - 1000).toISOString() },
      error: null,
    });
    const res = mockRes();
    await registerHandler(registerReq("a5@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.auth.admin.createUser).not.toHaveBeenCalled();
  });

  test("a code someone else just used is refused", async () => {
    fromSequence(OPEN_INVITE(), { data: [], error: null });
    const res = mockRes();
    await registerHandler(registerReq("a6@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.auth.admin.createUser).not.toHaveBeenCalled();
  });

  test("a valid code creates the login and the admins row", async () => {
    const [, , adminsInsert] = fromSequence(OPEN_INVITE(), { data: [{ id: "i1" }], error: null }, { error: null });
    supabaseAdmin.auth.admin.createUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    const res = mockRes();
    await registerHandler(registerReq("A7@Example.com"), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(supabaseAdmin.auth.admin.createUser).toHaveBeenCalledWith({
      email: "a7@example.com",
      password: PASSWORD,
      email_confirm: true,
    });
    expect(adminsInsert.insert).toHaveBeenCalledWith({
      user_id: "u1",
      email: "a7@example.com",
      role: "admin",
      active: true,
    });
  });

  test("an email that already has an account: 409 and the code is released", async () => {
    const [, , release] = fromSequence(OPEN_INVITE(), { data: [{ id: "i1" }], error: null }, { error: null });
    supabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: null,
      error: { code: "email_exists", message: "already registered" },
    });
    const res = mockRes();
    await registerHandler(registerReq("a8@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(release.update).toHaveBeenCalledWith({ used_at: null });
  });

  test("if the admins row fails, the new login is removed and the code released", async () => {
    const [, , , release] = fromSequence(
      OPEN_INVITE(),
      { data: [{ id: "i1" }], error: null },
      { error: { message: "boom" } },
      { error: null }
    );
    supabaseAdmin.auth.admin.createUser.mockResolvedValue({ data: { user: { id: "u9" } }, error: null });
    supabaseAdmin.auth.admin.deleteUser.mockResolvedValue({ error: null });
    const res = mockRes();
    await registerHandler(registerReq("a9@example.com"), res);
    expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith("u9");
    expect(release.update).toHaveBeenCalledWith({ used_at: null });
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("5 wrong codes block the 6th attempt before the database is touched", async () => {
    for (let i = 0; i < 5; i++) {
      fromSequence(OPEN_INVITE());
      await registerHandler(registerReq("locked@example.com", { code: "ZZZZ-ZZZZ-ZZZZ" }), mockRes());
    }
    supabaseAdmin.from.mockClear();
    const res = mockRes();
    await registerHandler(registerReq("locked@example.com"), res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });
});