import crypto from "crypto";

export const CODE_TTL_DAYS = 7;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 12;

export function generateCode() {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let raw = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    raw += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return raw.match(/.{4}/g).join("-");
}

export function normalizeCode(value) {
  return typeof value === "string" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
}

export function hashCode(code) {
  return crypto.createHash("sha256").update(normalizeCode(code)).digest("hex");
}

export function codeMatches(code, storedHash) {
  if (!normalizeCode(code) || typeof storedHash !== "string") return false;
  const a = Buffer.from(hashCode(code), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}