import { normalizeCity } from "./normalizeCity";

describe("normalizeCity", () => {
  test("returns null for empty or missing input", () => {
    expect(normalizeCity(null)).toBeNull();
    expect(normalizeCity(undefined)).toBeNull();
    expect(normalizeCity("")).toBeNull();
    expect(normalizeCity("   ")).toBeNull();
  });

  test("maps known aliases to their canonical city name", () => {
    expect(normalizeCity("joburg")).toBe("Johannesburg");
    expect(normalizeCity("JHB")).toBe("Johannesburg");
    expect(normalizeCity("Johannesburg")).toBe("Johannesburg");
    expect(normalizeCity("pta")).toBe("Pretoria");
    expect(normalizeCity("cpt")).toBe("Cape Town");
    expect(normalizeCity("dbn")).toBe("Durban");
  });

  test("is case-insensitive and trims whitespace", () => {
    expect(normalizeCity("  JoBuRg  ")).toBe("Johannesburg");
    expect(normalizeCity("PRETORIA")).toBe("Pretoria");
  });

  test("falls back to title-casing unknown city names", () => {
    expect(normalizeCity("polokwane")).toBe("Polokwane");
    expect(normalizeCity("port elizabeth")).toBe("Port Elizabeth");
  });

  test("does not crash on unusual input", () => {
    expect(normalizeCity("   multiple   spaces   ")).toBe("Multiple   Spaces");
    expect(normalizeCity("123")).toBe("123");
  });
});