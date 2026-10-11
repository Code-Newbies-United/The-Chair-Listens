// lib/session.js  (browser-side helpers for the consent session)
//
// The session ID is created by the server when the person consents.
// It lives in sessionStorage: it is private to this browser tab and disappears
// when the tab is closed. It is NOT a login and holds no personal information.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const KEY = 'chair_session_id';

export function getSessionId() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// Headers that tell the server which consent session a request belongs to, so
// rate limits (FIX-11) can be applied per person and not only per IP address.
// Spread it into fetch headers:  headers: { "Content-Type": "...", ...sessionHeaders() }
export function sessionHeaders() {
  const id = getSessionId();
  return id ? { 'x-session-id': id } : {};
}

// Returns true if saved, false if the browser blocked storage (e.g. some private modes)
export function setSessionId(id) {
  try {
    sessionStorage.setItem(KEY, id);
    return true;
  } catch {
    return false;
  }
}

export function clearSessionId() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}

/**
 * Use at the top of any page that must only be reachable AFTER consent.
 * Sends people with no session back to the start page.
 * Returns true once a session is confirmed, so the page can avoid flashing content.
 *
 * NOTE: this is only a convenience for honest visitors. The real enforcement is
 * on the server (pages/api/responses.js), because anyone can bypass browser code.
 */
export function useRequireSession() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSessionId()) {
      router.replace('/?consent=required');
      return;
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}

// ---- Answers (FIX-08) ----
// Answers live in sessionStorage instead of the URL, so they never end up in
// browser history, server logs or referrers. Cleared on the thank-you page.
const ANSWERS_KEY = 'chair_answers';

export function saveAnswers(answers) {
  try {
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    return true;
  } catch {
    return false;
  }
}

export function loadAnswers() {
  try {
    const raw = sessionStorage.getItem(ANSWERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearAnswers() {
  try {
    sessionStorage.removeItem(ANSWERS_KEY);
  } catch {
    /* nothing to clear */
  }
}
