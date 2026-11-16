jest.mock("@/lib/requireAdmin", () => ({ requireAdmin: jest.fn() }));
jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: jest.fn(),
    auth: { admin: { listUsers: jest.fn(), getUserById: jest.fn(), deleteUser: jest.fn() } },
  },
}));

import teamHandler from "../../../pages/api/admin/team";
import revokeHandler from "../../../pages/api/admin/revoke-invite";
import activeHandler from "../../../pages/api/admin/set-admin-active";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ME = { id: "me", email: "me@example.com", role: "admin" };

function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}

function chain(result) {
  const c = {};
  ["select", "eq", "order", "update"].forEach((m) => {
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

beforeEach(() => {
  jest.resetAllMocks();
  requireAdmin.mockResolvedValue(ME);
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

describe("GET /api/admin/team", () => {
  test("401 when not an active admin", async () => {
    requireAdmin.mockResolvedValue(null);
    const res = mockRes();
    await teamHandler({ method: "GET" }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("lists admins and only genuine pending invites", async () => {
    supabaseAdmin.auth.admin.listUsers.mockResolvedValue({
      data: {
        users: [
          { id: "me", email: "me@example.com", app_metadata: {} },
          { id: "p1", email: "pending@example.com", created_at: "2026-11-01", app_metadata: { admin_invite: true } },
          { id: "other", email: "random@example.com", app_metadata: {} },
          { id: "done", email: "done@example.com", app_metadata: { admin_invite: true } },
        ],
      },
      error: null,
    });
    fromSequence({
      data: [
        { user_id: "me", email: "me@example.com", role: "admin", active: true },
        { user_id: "done", email: "done@example.com", role: "admin", active: true },
      ],
      error: null,
    });
    const res = mockRes();
    await teamHandler({ method: "GET" }, res);
    const body = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(body.me).toBe("me");
    expect(body.invites.map((i) => i.email)).toEqual(["pending@example.com"]);
    expect(body.admins).toHaveLength(2);
  });
});

describe("POST /api/admin/revoke-invite", () => {
  test("401 when not an active admin; nothing deleted", async () => {
    requireAdmin.mockResolvedValue(null);
    const res = mockRes();
    await revokeHandler({ method: "POST", body: { user_id: "p1" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.auth.admin.deleteUser).not.toHaveBeenCalled();
  });

  test("400 without a user id", async () => {
    const res = mockRes();
    await revokeHandler({ method: "POST", body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("refuses to delete someone who is already an admin", async () => {
    fromSequence({ data: { user_id: "a1" }, error: null });
    const res = mockRes();
    await revokeHandler({ method: "POST", body: { user_id: "a1" } }, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(supabaseAdmin.auth.admin.deleteUser).not.toHaveBeenCalled();
  });

  test("refuses a normal user who is not an admin invite", async () => {
    fromSequence({ data: null, error: null });
    supabaseAdmin.auth.admin.getUserById.mockResolvedValue({
      data: { user: { id: "u9", app_metadata: {} } },
      error: null,
    });
    const res = mockRes();
    await revokeHandler({ method: "POST", body: { user_id: "u9" } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(supabaseAdmin.auth.admin.deleteUser).not.toHaveBeenCalled();
  });

  test("deletes a genuine pending invite", async () => {
    fromSequence({ data: null, error: null });
    supabaseAdmin.auth.admin.getUserById.mockResolvedValue({
      data: { user: { id: "p1", app_metadata: { admin_invite: true } } },
      error: null,
    });
    supabaseAdmin.auth.admin.deleteUser.mockResolvedValue({ error: null });
    const res = mockRes();
    await revokeHandler({ method: "POST", body: { user_id: "p1" } }, res);
    expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith("p1");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("POST /api/admin/set-admin-active", () => {
  test("401 when not an active admin; nothing changed", async () => {
    requireAdmin.mockResolvedValue(null);
    const res = mockRes();
    await activeHandler({ method: "POST", body: { user_id: "a1", active: false } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("400 when the status is missing", async () => {
    const res = mockRes();
    await activeHandler({ method: "POST", body: { user_id: "a1" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("an admin cannot deactivate themselves", async () => {
    const res = mockRes();
    await activeHandler({ method: "POST", body: { user_id: "me", active: false } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("404 for someone who is not in the admins table", async () => {
    fromSequence({ data: null, error: null });
    const res = mockRes();
    await activeHandler({ method: "POST", body: { user_id: "nobody", active: false } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("refuses to deactivate the last active admin", async () => {
    fromSequence({ data: { user_id: "a1", active: true }, error: null }, { count: 1, error: null });
    const res = mockRes();
    await activeHandler({ method: "POST", body: { user_id: "a1", active: false } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("deactivates an admin when others remain active", async () => {
    const [, , update] = fromSequence(
      { data: { user_id: "a1", active: true }, error: null },
      { count: 2, error: null },
      { error: null }
    );
    const res = mockRes();
    await activeHandler({ method: "POST", body: { user_id: "a1", active: false } }, res);
    expect(update.update).toHaveBeenCalledWith({ active: false });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("re-activates an inactive admin without the last-admin check", async () => {
    const [, update] = fromSequence({ data: { user_id: "a2", active: false }, error: null }, { error: null });
    const res = mockRes();
    await activeHandler({ method: "POST", body: { user_id: "a2", active: true } }, res);
    expect(update.update).toHaveBeenCalledWith({ active: true });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});