import { useState } from "react";
import { useRouter } from "next/router";
import ChairJourneyMap from "@/components/ChairJourneyMap";
import { CONSENT_VERSION } from "@/lib/consentVersion";
import { setSessionId } from "@/lib/session";

/**
 * The Chair Listens — Home / landing + consent
 *
 * Palette and hero style pulled from the campaign reference: deep navy
 * background, a blue upholstered chair as the hero illustration, warm
 * khaki accent for small tags, IBM Plex Sans throughout.
 *
 * Continue is disabled until the POPIA consent checkbox is checked.
 * Swap POPIA_TERMS_URL below for the real link to the full notice.
 *
 * Location is now detected automatically via the browser's Geolocation
 * API, then reverse-geocoded to a place name using OpenStreetMap's
 * Nominatim service (free, no API key required). If the visitor denies
 * permission or geolocation fails, we fall back to the locationName prop.
 *
 * Below the consent flow, a "Where The Chair Has Been" section shows a
 * live status badge and a map of every campaign stop so far.
 */

const POPIA_TERMS_URL = "/consent-terms";
export default function Home() {
  const router = useRouter();
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consentError, setConsentError] = useState(null);


  async function handleContinue() {
    if (!consented || submitting) return;

    setSubmitting(true);
    setConsentError(null);

    try {
      // The server records the consent and gives back a session ID.
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            consent_version: CONSENT_VERSION,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.sessionId) {
        setConsentError(
          res.status === 409
            ? "The privacy terms have been updated. Please refresh this page and read them again."
            : "We couldn't record your consent. Please check your connection and try again."
        );
        setSubmitting(false);
        return;
      }

      if (!setSessionId(data.sessionId)) {
        setConsentError(
          "Your browser is blocking the storage this page needs. If you're in private browsing, please switch to a normal tab and try again."
        );
        setSubmitting(false);
        return;
      }

      router.push("/check-in");
    } catch (error) {
      console.error(error);
      setConsentError("We couldn't record your consent. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
      <main style={styles.page}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&display=swap');

        .clisten-continue {
          transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
        }
        .clisten-continue:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
        .clisten-continue:not(:disabled):active {
          transform: translateY(0px) scale(0.98);
        }
        .clisten-continue:focus-visible {
          outline: 2px solid #F5F6FA;
          outline-offset: 3px;
        }
        .clisten-checkbox:focus-visible {
          outline: 2px solid #B99B5B;
          outline-offset: 3px;
        }
        .clisten-link {
          color: #D9C489;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .clisten-link:hover { color: #F5F6FA; }

        @keyframes chairLivePulse {
          0% { box-shadow: 0 0 0 0 rgba(143, 209, 158, 0.6); }
          70% { box-shadow: 0 0 0 8px rgba(143, 209, 158, 0); }
          100% { box-shadow: 0 0 0 0 rgba(143, 209, 158, 0); }
        }
      `}
        </style>

        <div style={styles.frame}>
          <div style={styles.locationTag}>
              <span style={styles.locationDot} aria-hidden="true" />
              The chair's location is managed by the campaign team
          </div>

          <div style={styles.heroWrap}>
            <svg
                viewBox="0 0 240 240"
                width="200"
                height="200"
                role="img"
                aria-label="A simple illustration of a blue upholstered armchair"
            >
              {/* wooden legs */}
              <g stroke="#8B5E34" strokeWidth="6" strokeLinecap="round">
                <path d="M62 190 L40 230" />
                <path d="M178 190 L200 230" />
                <path d="M62 190 L88 230" opacity="0.55" />
                <path d="M178 190 L152 230" opacity="0.55" />
              </g>

              {/* seat base */}
              <rect x="48" y="168" width="144" height="30" rx="8" fill="#1F3A85" />

              {/* armrests */}
              <rect x="34" y="118" width="26" height="72" rx="13" fill="#2A4FA0" />
              <rect x="180" y="118" width="26" height="72" rx="13" fill="#2A4FA0" />

              {/* backrest */}
              <rect x="56" y="46" width="128" height="132" rx="26" fill="#2A4FA0" />
              <rect x="56" y="46" width="128" height="132" rx="26" fill="#1F3A85" opacity="0.18" />

              {/* tufting diamonds */}
              <g stroke="#16265E" strokeWidth="2" opacity="0.6" fill="none">
                <path d="M120 62 L92 90 L120 118 L148 90 Z" />
                <path d="M120 118 L92 146 L120 174 L148 146 Z" />
                <path d="M92 90 L64 118 L92 146" />
                <path d="M148 90 L176 118 L148 146" />
              </g>
              <g fill="#16265E" opacity="0.7">
                <circle cx="120" cy="62" r="2.6" />
                <circle cx="92" cy="90" r="2.6" />
                <circle cx="148" cy="90" r="2.6" />
                <circle cx="120" cy="118" r="2.6" />
                <circle cx="92" cy="146" r="2.6" />
                <circle cx="148" cy="146" r="2.6" />
                <circle cx="120" cy="174" r="2.6" />
                <circle cx="64" cy="118" r="2.6" />
                <circle cx="176" cy="118" r="2.6" />
              </g>

              {/* seat cushion highlight */}
              <rect x="48" y="168" width="144" height="8" rx="4" fill="#4C74C9" opacity="0.5" />
            </svg>
          </div>

          <div style={styles.textBlock}>
            <h1 style={styles.headline}>The Chair Listens</h1>
            <p style={styles.body}>
              Sit for a minute. Say what's on your mind
            </p>
            <p style={styles.body}>
              &mdash; nobody here
              needs your name.
            </p>
          </div>

          <label style={styles.consentRow} htmlFor="popia-consent">
            <input
                id="popia-consent"
                type="checkbox"
                className="clisten-checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                style={styles.checkbox}
            />
            <span style={styles.consentText}>
            I confirm I am 18 or older (or participating with parent/guardian
            supervision) and agree to anonymously participate. I have read
            and accepted the{" "}
              <a
                  href={POPIA_TERMS_URL}
                  className="clisten-link"
                  target="_blank"
                  rel="noopener noreferrer"
              >
              POPIA Privacy Notice &amp; Consent Terms
            </a>
            .
          </span>
          </label>

          <button
              type="button"
              className="clisten-continue"
              onClick={handleContinue}
              disabled={!consented || submitting}
              aria-disabled={!consented || submitting}
              style={{
                ...styles.cta,
                opacity: consented ? 1 : 0.45,
                cursor: consented ? "pointer" : "not-allowed",
              }}
          >
            {submitting ? "Please wait..." : "Continue"}
          </button>

          {consentError && (
            <p role="alert" style={styles.consentError}>
              {consentError}
            </p>
          )}
          {!consentError && router.query.consent === "required" && (
            <p role="status" style={styles.consentNotice}>
              Please confirm your consent to continue.
            </p>
          )}

          <p style={styles.footnote}>
            Type it out, or just say it out loud.
          </p>

          {/* Where The Chair Has Been — live status + map of every stop */}
          <div style={styles.journeyDivider} />
          <div style={styles.journeySection}>
            <ChairJourneyMap />
          </div>
        </div>
      </main>
  );
}


const styles = {
  consentError: {
    color: "#FFB4B4",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    margin: "12px 0 0",
    textAlign: "center",
  },
  consentNotice: {
    color: "#C9D2EC",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    margin: "12px 0 0",
    textAlign: "center",
  },
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
        "radial-gradient(120% 60% at 50% 0%, #14265C 0%, #0F1E4A 40%, #0A1735 75%, #081128 100%)",
    fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "32px 20px 56px",
    boxSizing: "border-box",
  },
  frame: {
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  locationTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    color: "#D9C489",
    fontSize: "13px",
    letterSpacing: "0.01em",
    marginBottom: "8px",
    fontWeight: 500,
  },
  locationDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#B99B5B",
    display: "inline-block",
  },
  heroWrap: {
    marginTop: "16px",
    marginBottom: "4px",
    display: "flex",
    justifyContent: "center",
  },
  textBlock: {
    marginTop: "12px",
    marginBottom: "26px",
  },
  headline: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 700,
    fontSize: "34px",
    lineHeight: 1.15,
    color: "#F5F6FA",
    margin: "0 0 14px 0",
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "16px",
    lineHeight: 1.55,
    color: "#AEB8D6",
    margin: 0,
    maxWidth: "300px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  consentRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    textAlign: "left",
    maxWidth: "320px",
    marginBottom: "24px",
    cursor: "pointer",
  },
  checkbox: {
    marginTop: "3px",
    width: "18px",
    height: "18px",
    flexShrink: 0,
    accentColor: "#B99B5B",
    cursor: "pointer",
  },
  consentText: {
    fontSize: "13px",
    lineHeight: 1.55,
    color: "#AEB8D6",
  },
  cta: {
    appearance: "none",
    border: "none",
    background: "#B99B5B",
    color: "#0A1735",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: "16px",
    padding: "15px 56px",
    borderRadius: "999px",
    letterSpacing: "0.01em",
  },
  footnote: {
    marginTop: "16px",
    fontSize: "13px",
    color: "#7E88AC",
  },
  journeyDivider: {
    width: "100%",
    maxWidth: "320px",
    height: "1px",
    backgroundColor: "rgba(174, 184, 214, 0.15)",
    marginTop: "40px",
    marginBottom: "32px",
  },
  journeySection: {
    width: "100%",
    textAlign: "left",
  },
};
