export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 72;

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email) {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function utf8Length(str) {
  let bytes = 0;
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    bytes += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
  }
  return bytes;
}

export function validatePassword(password) {
  if (typeof password !== "string") return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH || utf8Length(password) > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export function hasAdminInviteFlag(user) {
  return user?.app_metadata?.admin_invite === true;
}
