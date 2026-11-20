jest.mock("@/lib/requireAdmin", () => ({ requireAdmin: jest.fn() }));
jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: { from: jest.fn(), auth: { admin: {} } },
}));

import teamHandler from "../../../pages/api/admin/team";
import revokeHandler from "../../../pages/api/admin/revoke-invite";
import activeHandler from "../../../pages/api/admin/set-admin-active";
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ME = { id: "me", email: "me@example.com", role: "admin" };

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

  test("returns the admins and the open invitations", async () => {
    const [, invitesQuery] = fromSequence(
      { data: [{ user_id: "me", email: "me@example.com", role: "admin", active: true }], error: null },
      { data: [{ id: "i1", email: "new@example.com", expires_at: "2099-01-01" }], error: null }
    );
    const res = mockRes();
    await teamHandler({ method: "GET" }, res);
    const body = res.json.mock.calls[0][0];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(body.me).toBe("me");
    expect(body.admins).toHaveLength(1);
    expect(body.invites.map((i) => i.email)).toEqual(["new@example.com"]);
    expect(invitesQuery.is).toHaveBeenCalledWith("used_at", null);
    expect(invitesQuery.is).toHaveBeenCalledWith("revoked_at", null);
  });

  test("never returns a code or a code hash", async () => {
    fromSequence({ data: [], error: null }, { data: [{ id: "i1", email: "new@example.com" }], error: null });
    const res = mockRes();
    await teamHandler({ method: "GET" }, res);
    expect(JSON.stringify(res.json.mock.calls[0][0])).not.toMatch(/code/);
  });
});

describe("POST /api/admin/revoke-invite", () => {
  test("401 when not an active admin; nothing changed", async () => {
    requireAdmin.mockResolvedValue(null);
    const res = mockRes();
    await revokeHandler({ method: "POST", body: { invite_id: "i1" } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("400 without an invitation id", async () => {
    const res = mockRes();
    await revokeHandler({ method: "POST", body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("404 when the invitation is already used, revoked or missing", async () => {
    fromSequence({ data: [], error: null });
    const res = mockRes();
    await revokeHandler({ method: "POST", body: { invite_id: "gone" } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("revokes an open invitation", async () => {
    const [update] = fromSequence({ data: [{ id: "i1" }], error: null });
    const res = mockRes();
    await revokeHandler({ method: "POST", body: { invite_id: "i1" } }, res);
    expect(update.update).toHaveBeenCalledWith({ revoked_at: expect.any(String) });
    expect(update.is).toHaveBeenCalledWith("used_at", null);
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