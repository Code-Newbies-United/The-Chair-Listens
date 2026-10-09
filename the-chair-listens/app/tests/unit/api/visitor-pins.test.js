import handler from "../../../pages/api/visitor-pins";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

import { supabase } from "@/lib/supabaseClient";

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("POST /api/visitor-pins", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rejects requests with no city", async () => {
    const req = { method: "POST", body: {} };
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("inserts a pin and increments the city total on success", async () => {
    const insertMock = jest.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert: insertMock });
    supabase.rpc.mockResolvedValue({ error: null });

    const req = {
      method: "POST",
      body: { city: "Pretoria", lat: -25.7, lng: 28.2 },
    };
    const res = mockRes();

    await handler(req, res);

    expect(supabase.from).toHaveBeenCalledWith("visitor_pins");
    expect(insertMock).toHaveBeenCalledWith({
      city: "Pretoria",
      lat: -25.7,
      lng: 28.2,
    });
    expect(supabase.rpc).toHaveBeenCalledWith("increment_city_visit", {
      p_city: "Pretoria",
      p_lat: -25.7,
      p_lng: 28.2,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("returns 500 if the pin insert fails", async () => {
    const insertMock = jest.fn().mockResolvedValue({ error: { message: "db error" } });
    supabase.from.mockReturnValue({ insert: insertMock });

    const req = { method: "POST", body: { city: "Durban" } };
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    // Should not attempt the increment if the insert already failed
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  test("returns 500 if the increment RPC fails", async () => {
    const insertMock = jest.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert: insertMock });
    supabase.rpc.mockResolvedValue({ error: { message: "rpc error" } });

    const req = { method: "POST", body: { city: "Cape Town" } };
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("GET /api/visitor-pins", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("groups pins by city and counts them correctly", async () => {
    const selectChain = {
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [
          { city: "Pretoria", lat: -25.7, lng: 28.2, created_at: "2026-01-01T10:00:00Z" },
          { city: "Pretoria", lat: -25.71, lng: 28.21, created_at: "2026-01-01T11:00:00Z" },
          { city: "Durban", lat: -29.8, lng: 31.0, created_at: "2026-01-01T12:00:00Z" },
        ],
        error: null,
      }),
    };
    supabase.from.mockReturnValue({ select: jest.fn().mockReturnValue(selectChain) });

    const req = { method: "GET" };
    const res = mockRes();

    await handler(req, res);

    const response = res.json.mock.calls[0][0];
    expect(response.visitors).toHaveLength(2);

    const pretoria = response.visitors.find((v) => v.location === "Pretoria");
    expect(pretoria.visitor_count).toBe(2);
    // Should use the most recent row's coordinates (the second Pretoria entry)
    expect(pretoria.lat).toBe(-25.71);

    const durban = response.visitors.find((v) => v.location === "Durban");
    expect(durban.visitor_count).toBe(1);
  });

  test("returns an empty array when there are no recent pins", async () => {
    const selectChain = {
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    };
    supabase.from.mockReturnValue({ select: jest.fn().mockReturnValue(selectChain) });

    const req = { method: "GET" };
    const res = mockRes();

    await handler(req, res);

    expect(res.json).toHaveBeenCalledWith({ visitors: [] });
  });

  test("returns 500 if the query fails", async () => {
    const selectChain = {
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: null, error: { message: "query failed" } }),
    };
    supabase.from.mockReturnValue({ select: jest.fn().mockReturnValue(selectChain) });

    const req = { method: "GET" };
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("unsupported methods", () => {
  test("rejects DELETE requests", async () => {
    const req = { method: "DELETE" };
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});