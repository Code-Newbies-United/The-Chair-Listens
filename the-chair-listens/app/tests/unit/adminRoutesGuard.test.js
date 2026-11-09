/**
 * Guard test: every admin page and admin API route must check for an active admin,
 * except the intentionally public onboarding pairs listed below. Adding a new file under
 * pages/admin or pages/api/admin without a guard makes this test fail.
 * Also checks the legacy shared-password code is gone.
 */
import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "../..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const list = (dir, ext) =>
  fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith(ext)).map((f) => `${dir}/${f}`);

// Intentionally public. Confirm this list with the ticket owner.
const PUBLIC_PAGES = [
  "pages/admin/login.jsx",
  "pages/admin/accept-invite.jsx",
  "pages/admin/set-password.jsx",
];
const PUBLIC_API = [
  "pages/api/admin-login.js",
  "pages/api/admin-logout.js", // only ends the caller's own session; harmless without one
  "pages/api/admin/accept-invite.js",
  "pages/api/admin/set-password.js",
];
// Admin-only API routes that live outside pages/api/admin
const OTHER_ADMIN_API = ["pages/api/set-location.js", "pages/api/stats.js", "pages/api/visit-totals.js"];

const GUARD = /requireAdminSSR|requireAdmin|withAdmin/;

describe("admin pages are guarded", () => {
  const pages = list("pages/admin", ".jsx").filter((f) => !PUBLIC_PAGES.includes(f));
  test("there are admin pages to check", () => expect(pages.length).toBeGreaterThan(0));
  test.each(pages)("%s checks for an active admin", (file) => {
    expect(read(file)).toMatch(GUARD);
  });
  test("pages/admin contains no unguarded example or helper files", () => {
    const all = fs.readdirSync(path.join(root, "pages/admin"));
    expect(all.every((f) => /\.jsx$/.test(f))).toBe(true);
  });
});

describe("admin API routes are guarded", () => {
  const routes = [...list("pages/api/admin", ".js"), ...OTHER_ADMIN_API].filter((f) => !PUBLIC_API.includes(f));
  test.each(routes)("%s checks for an active admin", (file) => {
    expect(read(file)).toMatch(GUARD);
  });
  test.each(routes)("%s answers 401 when unauthenticated", (file) => {
    const src = read(file);
    expect(src).toMatch(/withAdmin|status\(401\)/);
  });
});

describe("intentionally public pairs still exist", () => {
  test.each([...PUBLIC_PAGES, ...PUBLIC_API])("%s exists", (file) => {
    expect(fs.existsSync(path.join(root, file))).toBe(true);
  });
});

describe("legacy shared password is gone", () => {
  const legacy = /ADMIN_PASSWORD|ADMIN_SESSION_SECRET|adminsession|verifyAdminSession/;
  const codeFiles = [
    ...list("lib", ".js"),
    ...list("pages", ".jsx"),
    ...list("pages/admin", ".jsx"),
    ...list("pages/api", ".js"),
    ...list("pages/api/admin", ".js"),
    ...list("components", ".jsx"),
    ...list("scripts", ".js"),
    ".env.example",
  ];
  test("lib/adminsession.js is deleted", () => {
    expect(fs.existsSync(path.join(root, "lib/adminsession.js"))).toBe(false);
  });
  test.each(codeFiles)("%s has no legacy references", (file) => {
    expect(read(file)).not.toMatch(legacy);
  });
});
