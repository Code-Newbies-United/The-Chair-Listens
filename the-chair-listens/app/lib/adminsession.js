import crypto from "crypto";

/**
 * Minimal signed-cookie admin session — no "cookie" package dependency,
 * no database/session-store needed. Parses/builds the cookie manually.
 *
 * Requires in .env.local:
 *   ADMIN_SESSION_SECRET=<any long random string>
 *   ADMIN_PASSWORD=<the shared admin password>
 */

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 hours

if (!SESSION_SECRET) {
    console.warn(
        "ADMIN_SESSION_SECRET is not set — admin sessions cannot be created or verified."
    );
}

function sign(value) {
    return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function createAdminSessionCookie() {
    const expires = Date.now() + SESSION_DURATION_MS;
    const payload = `admin:${expires}`;
    const token = `${payload}.${sign(payload)}`;

    const isProd = process.env.NODE_ENV === "production";
    return [
        `admin_session=${encodeURIComponent(token)}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
        isProd ? "Secure" : "",
        `Max-Age=${Math.floor(SESSION_DURATION_MS / 1000)}`,
    ]
        .filter(Boolean)
        .join("; ");
}

export function clearAdminSessionCookie() {
    return "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0";
}

export function verifyAdminSession(req) {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    if (!match) return false;

    const token = decodeURIComponent(match[1]);
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;

    const expected = sign(payload);
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

    const expires = Number(payload.split(":")[1]);
    if (!expires || Date.now() > expires) return false;

    return true;
}