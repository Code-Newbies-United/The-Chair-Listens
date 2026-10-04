// lib/session.js  (browser-side helpers for the consent session)
//
// The session ID is created by the server when the person consents.
// It lives in sessionStorage: it is private to this browser tab and disappears
// when the tab is closed. It is NOT a login and holds no personal information.
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const KEY = "chair_session_id";

export function getSessionId() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
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
      router.replace("/?consent=required");
      return;
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
