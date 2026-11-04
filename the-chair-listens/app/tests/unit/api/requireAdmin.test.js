jest.mock("@/lib/supabaseServer", () => ({ createSupabaseServerClient: jest.fn() }));
jest.mock("@/lib/supabaseAdmin", () => ({ supabaseAdmin: { from: jest.fn() } }));

import { requireAdmin, withAdmin } from "../../../lib/requireAdmin";
import { requireAdminSSR } from "../../../lib/requireAdminSSR";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const USER = { id: "user-1", email: "a@example.com" };

function mockSession(user) {
  createSupabaseServerClient.mockReturnValue({
    supabase: {
      auth: {
        getUser: jest.fn().mockResolvedValue(
          user
            ? { data: { user }, error: null }
            : { data: { user: null }, error: { message: "no session" } }
        ),
      },
    },
  });
}

function mockAdminRow(row) {
  const maybeSingle = jest.fn().mockResolvedValue({ data: row, error: null });
  supabaseAdmin.from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle }) }) });
}

function mockRes() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}

beforeEach(() => jest.clearAllMocks());

describe("requireAdmin", () => {
  test("no session: rejected, admins table never queried", async () => {
    mockSession(null);
    expect(await requireAdmin({}, {})).toBeNull();
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  test("valid user who is not an admin: rejected", async () => {
    mockSession(USER);
    mockAdminRow(null);
    expect(await requireAdmin({}, {})).toBeNull();
  });

  test("inactive admin: rejected", async () => {
    mockSession(USER);
    mockAdminRow({ user_id: USER.id, email: USER.email, role: "admin", active: false });
    expect(await requireAdmin({}, {})).toBeNull();
  });

  test("active admin: returns identity", async () => {
    mockSession(USER);
    mockAdminRow({ user_id: USER.id, email: USER.email, role: "admin", active: true });
    expect(await requireAdmin({}, {})).toEqual({ id: "user-1", email: "a@example.com", role: "admin" });
  });

  test("deactivating blocks the very next request, same open session", async () => {
    mockSession(USER);
    mockAdminRow({ user_id: USER.id, email: USER.email, role: "admin", active: true });
    expect(await requireAdmin({}, {})).not.toBeNull();

    mockAdminRow({ user_id: USER.id, email: USER.email, role: "admin", active: false });
    expect(await requireAdmin({}, {})).toBeNull();
  });
});

describe("withAdmin (API routes)", () => {
  test("401 when not an admin, handler not called", async () => {
    mockSession(null);
    const handler = jest.fn();
    const res = mockRes();
    await withAdmin(handler)({}, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(handler).not.toHaveBeenCalled();
  });

  test("calls the handler with req.admin for an active admin", async () => {
    mockSession(USER);
    mockAdminRow({ user_id: USER.id, email: USER.email, role: "admin", active: true });
    const handler = jest.fn();
    const req = {};
    await withAdmin(handler)(req, mockRes());
    expect(handler).toHaveBeenCalled();
    expect(req.admin.email).toBe("a@example.com");
  });
});

describe("requireAdminSSR (pages)", () => {
  test("redirects to the login page when not an admin", async () => {
    mockSession(null);
    const result = await requireAdminSSR()({ req: {}, res: {} });
    expect(result.redirect.destination).toBe("/admin/login");
  });

  test("passes the admin identity as props for an active admin", async () => {
    mockSession(USER);
    mockAdminRow({ user_id: USER.id, email: USER.email, role: "admin", active: true });
    const result = await requireAdminSSR()({ req: {}, res: {} });
    expect(result.props.admin.email).toBe("a@example.com");
  });
});