import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChairJourneyMap from "@/components/ChairJourneyMap";
import AboutFactorOfTen from "@/components/AboutFactorOfTen";
import AdminGestureLogo from "@/components/AdminGestureLogo";
import { CONSENT_VERSION } from "@/lib/consentVersion";
import { setSessionId } from "@/lib/session";
import { useActiveLocationName } from "@/lib/useActiveLocation";

const POPIA_TERMS_URL = "/consent-terms";

// Awareness-ribbon path: one continuous strand with a loop on top and two crossing tails.
const RIBBON_PATH =
    "M24 118 L50 70 C58 55 70 40 66 22 C62 4 36 6 34 22 C32 38 42 56 50 70 L76 118";
// The piece of the first strand that passes OVER the second at the crossing.
const RIBBON_OVER = "M37 94 L50 70 C54 63 58 57 61 51";

/* Ochre circle with the blue prostate cancer awareness ribbon and sparkle rays */
function RibbonBadge() {
  return (
      <div
          className="art-badge"
          role="img"
          aria-label="Blue prostate cancer awareness ribbon"
      >
        <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <radialGradient id="badge-gold" cx="35%" cy="30%" r="85%">
              <stop offset="0%" stopColor="#dcb676" />
              <stop offset="100%" stopColor="#bc9553" />
            </radialGradient>
          </defs>

          <g stroke="#bc9553" strokeWidth="4.5" strokeLinecap="round">
            <line className="badge-ray ray-a" x1="134.5" y1="62.2" x2="145.8" y2="58.1" />
            <line className="badge-ray ray-b" x1="121" y1="41" x2="129.5" y2="32.5" />
            <line className="badge-ray ray-a" x1="25.5" y1="62.2" x2="14.2" y2="58.1" />
            <line className="badge-ray ray-b" x1="39" y1="41" x2="30.5" y2="32.5" />
          </g>

          <circle cx="80" cy="82" r="44" fill="url(#badge-gold)" />

          <g transform="translate(60 57) scale(0.4)" fill="none" strokeLinejoin="round">
            <path d={RIBBON_PATH} stroke="#0b4f99" strokeWidth="18" strokeLinecap="round" />
            <path d={RIBBON_PATH} stroke="#1f82dc" strokeWidth="12" strokeLinecap="round" />
            <path d={RIBBON_OVER} stroke="#0b4f99" strokeWidth="18" />
            <path d={RIBBON_OVER} stroke="#2a8fe8" strokeWidth="12" />
          </g>
        </svg>
      </div>
  );
}

/* Matching ochre circle with a quotation mark, used by the community messages */
function QuoteBadge() {
  return (
      <span className="voices-badge" aria-hidden="true">
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="quote-gold" cx="35%" cy="30%" r="85%">
            <stop offset="0%" stopColor="#dcb676" />
            <stop offset="100%" stopColor="#bc9553" />
          </radialGradient>
        </defs>
        <g stroke="#d1b071" strokeWidth="3.5" strokeLinecap="round">
          <line className="badge-ray ray-a" x1="71" y1="30.7" x2="77.6" y2="28.3" />
          <line className="badge-ray ray-b" x1="63.3" y1="18.7" x2="68.3" y2="13.7" />
          <line className="badge-ray ray-a" x1="9" y1="30.7" x2="2.4" y2="28.3" />
          <line className="badge-ray ray-b" x1="16.7" y1="18.7" x2="11.7" y2="13.7" />
        </g>
        <circle cx="40" cy="42" r="26" fill="url(#quote-gold)" />
        <text
            x="40"
            y="67"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="48"
            fill="#19362f"
        >
          “
        </text>
      </svg>
    </span>
  );
}

function FourPointStar({ className }) {
  return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="currentColor" />
      </svg>
  );
}

export default function Home() {

  const router = useRouter();

  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [messagesPaused, setMessagesPaused] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // State for community messages fetched from backend
  const [participantMessages, setParticipantMessages] = useState([
    "Some days, getting out of bed is already a brave thing.",
    "You do not have to have all the answers today.",
    "I am learning that asking for help is a kind of strength.",
    "To anyone carrying a lot right now: you are not alone.",
    "Small steps still count. Give yourself credit for them.",
    "I hope you find one gentle moment for yourself today.",
  ]);

  // Fetch live community messages on mount
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();

        if (data.messages && data.messages.length > 0) {
          setParticipantMessages(data.messages.map((m) => m.message));
        }
      } catch (err) {
        console.error("Failed to load community messages:", err);
      }
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    if (messagesPaused || participantMessages.length === 0) return;

    const interval = setInterval(() => {
      setActiveMessageIndex(
          (current) => (current + 1) % participantMessages.length
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [messagesPaused, participantMessages.length]);

  // The chair's stop is resolved by the server; the visitor's own GPS is never
  // read and nothing goes to third-party geocoders (FIX-07).
  const displayLocation = useActiveLocationName();

  // --------------------------------------------------
  // Continue
  // --------------------------------------------------

  async function handleContinue() {
    if (!consented || submitting) return;

    setSubmitting(true);
    setConsentError(null);

    try {
      // The server records the consent and returns an opaque session ID.
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent_version: CONSENT_VERSION }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.sessionId) {
        setConsentError(
          res.status === 409
            ? "The privacy terms have been updated. Please refresh this page and read them again."
            : res.status === 503
              ? "The chair isn't set up for a stop right now. Please try again later."
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
      console.error("Consent request failed:", error);
      setConsentError(
        "We couldn't record your consent. Please check your connection and try again."
      );
      setSubmitting(false);
    }
  }

  return (
      <main className="chair-page">
        <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap");

        :root {
          /* -----------------------------------------
             BRAND COLOURS
          ----------------------------------------- */

          --forest: #2d5046;
          --forest-dark: #203f36;
          --forest-deep: #19362f;
          --forest-ink: #1d4538;

          --mint: #8dcf94;
          --mint-bright: #a5dfa9;
          --mint-pale: #c9e6cb;

          --powder-blue: #d4e9ed;
          --powder-blue-dark: #b8dbe0;
          --powder-pale: #dcedef;

          /* ACTUAL CHAIR */
          --chair-blue: #315da8;
          --chair-blue-dark: #24498c;
          --chair-blue-light: #4775c5;

          --wood-light: #d9a062;
          --wood-dark: #b07334;

          --cream: #f5f2e8;
          --white: #fbfaf5;

          --ochre: #bc9553;
          --ochre-light: #d1b071;

          --sage: #526b61;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: var(--forest);
        }

        body {
          overflow-x: hidden;
        }

        button,
        input {
          font: inherit;
        }

        /* ==================================================
           PAGE
        ================================================== */

        .chair-page {
          min-height: 100dvh;
          width: 100%;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(141, 207, 148, 0.2),
              transparent 28%
            ),
            radial-gradient(
              circle at 0% 90%,
              rgba(212, 233, 237, 0.1),
              transparent 25%
            ),
            var(--forest);

          color: var(--white);

          font-family:
            "Benton Sans",
            "Helvetica Neue",
            Arial,
            sans-serif;

          padding:
            max(10px, env(safe-area-inset-top))
            max(10px, env(safe-area-inset-right))
            max(20px, env(safe-area-inset-bottom))
            max(10px, env(safe-area-inset-left));
        }

        .chair-shell {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ==================================================
           HEADER
        ================================================== */

        .topbar {
          min-height: 56px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          padding: 6px 3px 16px;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 9px;

          color: var(--white);

          font-family: "Plus Jakarta Sans", "Benton Sans", "Helvetica Neue", Arial, sans-serif;
          font-size: 14px;
          font-weight: 700;

          letter-spacing: 0.005em;
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid rgba(245, 242, 232, 0.7);
        }

        .brand-mark {
          width: 10px;
          height: 10px;

          flex: 0 0 auto;

          border-radius: 50%;

          background: var(--mint);

          box-shadow:
            0 0 0 4px rgba(141, 207, 148, 0.14),
            0 0 18px rgba(141, 207, 148, 0.4);
        }

        .location-pill {
          display: inline-flex;
          align-items: center;

          gap: 8px;

          flex-shrink: 0;

          color: var(--forest-dark);
          background: #b9e2bf;

          border-radius: 100px;

          padding: 9px 16px;

          font-size: 12px;
          font-weight: 700;

          letter-spacing: 0.01em;

          box-shadow: 0 6px 16px rgba(10, 30, 24, 0.18);
        }

        .header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        @media (max-width: 420px) {
          .topbar {
            gap: 8px;
          }

          .brand {
            gap: 7px;
            font-size: 12px;
          }

          .brand-logo {
            width: 34px;
            height: 34px;
            flex-basis: 34px;
          }

          .location-pill-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #1c2b25;
        }

        /* ==================================================
           HERO
        ================================================== */

        .hero {
          position: relative;

          display: flex;
          flex-direction: column;

          min-height: 0;

          overflow: hidden;

          border-radius: 38px;

          background: linear-gradient(180deg, #fbf7ea 0%, var(--cream) 100%);

          color: var(--forest);

          box-shadow:
            0 26px 54px rgba(8, 24, 19, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);

          isolation: isolate;
        }

        .hero::before {
          content: "";

          position: absolute;

          width: 360px;
          height: 360px;

          border-radius: 50%;

          background: var(--powder-pale);

          top: -190px;
          right: -150px;

          z-index: -1;
        }

        .hero::after {
          content: "";

          position: absolute;

          width: 300px;
          height: 300px;

          border-radius: 50%;

          background: #cfe6ea;

          bottom: -170px;
          right: -120px;

          opacity: 0.9;

          z-index: -1;
        }

        /* ==================================================
           HERO COPY
        ================================================== */

        .hero-copy {
          padding: 36px 23px 0;

          display: flex;
          flex-direction: column;
          align-items: center;

          text-align: center;

          position: relative;

          z-index: 2;
        }

        .hero-copy > * {
          animation: hero-rise 650ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        .hero-copy > *:nth-child(1) { animation-delay: 40ms; }
        .hero-copy > *:nth-child(2) { animation-delay: 120ms; }
        .hero-copy > *:nth-child(3) { animation-delay: 200ms; }
        .hero-copy > *:nth-child(4) { animation-delay: 280ms; }
        .hero-copy > *:nth-child(5) { animation-delay: 360ms; }
        .hero-copy > *:nth-child(6) { animation-delay: 440ms; }

        @keyframes hero-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 11px;

          margin-bottom: 18px;

          color: var(--forest-ink);

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .eyebrow-line {
          width: 28px;
          height: 2px;

          border-radius: 2px;

          background: var(--ochre);
        }

        .hero-title {
          margin: 0;

          font-family: "Plus Jakarta Sans", "Benton Sans", "Helvetica Neue", Arial, sans-serif;
          font-size: clamp(58px, 18vw, 80px);

          line-height: 0.86;

          letter-spacing: -0.06em;

          font-weight: 800;

          color: var(--forest-ink);
        }

        .hero-line {
          display: block;
        }

        .hero-line.accent {
          color: var(--mint);
        }

        .script-line {
          margin: 18px 0 12px;

          color: var(--ochre);

          font-family: "Pinyon Script", cursive;

          font-size: 44px;

          line-height: 1;

          transform: none;
        }

        .hero-description {
          max-width: 320px;

          margin: 6px 0 0;

          color: #234a3f;

          font-size: 15px;
          font-weight: 500;

          line-height: 1.5;
        }

        .hero-description strong {
          color: var(--forest-ink);
          font-weight: 800;
        }

        .hero-subtext {
          max-width: 300px;

          margin: 16px 0 0;

          color: #5d6f68;

          font-size: 13px;

          line-height: 1.55;
        }

        .about-link {
          margin: 20px 0 0;
          padding: 13px 26px;
          border: 2px solid var(--ochre);
          border-radius: 100px;
          background: #fcf8ec;
          color: #1f2a25;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.005em;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(188, 149, 83, 0.2);
          transition:
            background 160ms ease,
            color 160ms ease,
            transform 160ms ease,
            box-shadow 160ms ease;
        }

        .about-link:hover {
          background: var(--ochre);
          color: var(--white);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(188, 149, 83, 0.32);
        }

        .about-link:focus-visible {
          outline: 3px solid var(--forest);
          outline-offset: 3px;
        }

        /* ==================================================
           HERO ART
        ================================================== */

        .hero-art {
          position: relative;

          height: 345px;
          min-height: 345px;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          margin-top: 0;
        }

        .art-circle {
          position: absolute;

          width: 270px;
          height: 270px;

          border-radius: 50%;

          background: var(--mint-pale);

          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
        }

        /* Ribbon badge */
        .art-badge {
          position: absolute;

          width: 124px;
          height: 124px;

          right: 4px;
          top: 6px;

          z-index: 3;

          filter: drop-shadow(0 10px 14px rgba(25, 54, 47, 0.2));

          animation: badge-bob 5s ease-in-out infinite;
        }

        .art-badge svg {
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }

        .badge-ray {
          animation: ray-twinkle 2.6s ease-in-out infinite;
        }

        .badge-ray.ray-b {
          animation-delay: 0.7s;
        }

        @keyframes badge-bob {
          0%,
          100% {
            translate: 0 0;
          }

          50% {
            translate: 0 -7px;
          }
        }

        @keyframes ray-twinkle {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.35;
          }
        }

        /* Sparkles and dots */
        .art-star {
          position: absolute;

          left: 26px;
          bottom: 62px;

          width: 26px;
          height: 26px;

          color: var(--forest);

          animation: star-twinkle 3.2s ease-in-out infinite;
        }

        .art-star-2 {
          position: absolute;

          left: 58px;
          top: 62px;

          width: 15px;
          height: 15px;

          color: var(--mint);

          animation: star-twinkle 3.2s ease-in-out 1.1s infinite;
        }

        .art-dot {
          position: absolute;

          border-radius: 50%;

          background: var(--ochre);
          opacity: 0.55;
        }

        .art-dot.one {
          width: 8px;
          height: 8px;
          left: 90px;
          bottom: 38px;
        }

        .art-dot.two {
          width: 6px;
          height: 6px;
          right: 74px;
          bottom: 78px;
          background: var(--chair-blue);
          opacity: 0.35;
        }

        @keyframes star-twinkle {
          0%,
          100% {
            opacity: 1;
            scale: 1;
          }

          50% {
            opacity: 0.5;
            scale: 0.82;
          }
        }

        /* ==================================================
           BLUE CHAIR
        ================================================== */

        .chair {
          position: relative;

          width: 250px;
          height: 295px;

          z-index: 2;

          transform: none;

          filter:
            drop-shadow(
              0 18px 16px rgba(35, 66, 100, 0.2)
            );
        }

        .chair-floor {
          position: absolute;

          left: 22px;
          top: 300px;

          width: 206px;
          height: 22px;

          border-radius: 50%;

          background: radial-gradient(
            ellipse at center,
            rgba(25, 54, 47, 0.3),
            transparent 70%
          );

          z-index: -1;
        }

        .chair-back {
          position: absolute;

          left: 48px;
          top: 12px;

          width: 155px;
          height: 190px;

          border-radius: 62px 62px 22px 22px;

          background:
            linear-gradient(
              135deg,
              var(--chair-blue-light) 0%,
              var(--chair-blue) 45%,
              var(--chair-blue-dark) 100%
            );

          box-shadow:
            inset 9px 0 0 rgba(255, 255, 255, 0.08),
            inset -9px 0 0 rgba(0, 25, 70, 0.12);
        }

        /* Two buttons side by side, like the artwork */
        .chair-back::before,
        .chair-back::after {
          content: "";

          position: absolute;

          top: 62px;

          width: 11px;
          height: 11px;

          border-radius: 50%;

          background: radial-gradient(circle at 35% 30%, #5d88cf, #1f4c92);

          box-shadow:
            0 1px 2px rgba(0, 20, 60, 0.3),
            inset 0 -1px 1px rgba(0, 20, 60, 0.25);
        }

        .chair-back::before {
          left: 43px;
        }

        .chair-back::after {
          left: 101px;
        }

        .chair-seat {
          position: absolute;

          left: 30px;
          top: 188px;

          width: 194px;
          height: 60px;

          border-radius: 20px;

          background:
            linear-gradient(
              180deg,
              #5583cc,
              var(--chair-blue) 55%,
              var(--chair-blue-dark)
            );

          box-shadow:
            inset 0 7px 0 rgba(255, 255, 255, 0.12),
            inset 0 -10px 0 rgba(0, 20, 60, 0.1),
            0 8px 0 #1d3c75;
        }

        .chair-seat::after {
          content: "";

          position: absolute;

          left: 12px;
          right: 12px;
          top: 26px;

          height: 2px;

          border-radius: 2px;

          background: rgba(0, 25, 70, 0.22);
        }

        .chair-arm-left,
        .chair-arm-right {
          position: absolute;

          top: 150px;

          width: 36px;
          height: 100px;

          border-radius: 22px 22px 14px 14px;
        }

        .chair-arm-left {
          left: 14px;

          transform: rotate(-4deg);

          background: linear-gradient(
            90deg,
            var(--chair-blue-light),
            var(--chair-blue) 60%,
            var(--chair-blue-dark)
          );
        }

        .chair-arm-right {
          right: 14px;

          transform: rotate(4deg);

          background: linear-gradient(
            270deg,
            var(--chair-blue-light),
            var(--chair-blue) 60%,
            var(--chair-blue-dark)
          );
        }

        /* Wooden, tapered legs: two at the back, two splayed at the front */
        .chair-leg {
          position: absolute;

          width: 13px;
          height: 68px;

          top: 244px;

          background: linear-gradient(90deg, var(--wood-light), var(--wood-dark));

          clip-path: polygon(0 0, 100% 0, 76% 100%, 24% 100%);

          border-radius: 3px 3px 0 0;

          transform-origin: top center;
        }

        .chair-leg.left {
          left: 50px;

          transform: rotate(10deg);
        }

        .chair-leg.right {
          right: 50px;

          transform: rotate(-10deg);
        }

        .chair-leg.back-left {
          left: 80px;

          top: 236px;
          height: 58px;

          transform: rotate(5deg);

          filter: brightness(0.86);
        }

        .chair-leg.back-right {
          right: 80px;

          top: 236px;
          height: 58px;

          transform: rotate(-5deg);

          filter: brightness(0.86);
        }

        /* ==================================================
           CONSENT CARD
        ================================================== */

        .action-card {
          position: relative;

          z-index: 5;

          width: calc(100% - 20px);

          margin: -18px auto 0;

          padding: 18px;

          display: flex;
          flex-direction: column;

          gap: 15px;

          border-radius: 21px;

          background: var(--forest-dark);

          box-shadow:
            0 14px 35px rgba(17, 45, 37, 0.28);
        }

        .consent-message {
          margin: 12px 0 0;
          text-align: center;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #c9d2ec;
        }

        .consent-message-error {
          color: #ffb4b4;
        }

        .consent {
          display: flex;
          align-items: flex-start;

          gap: 10px;

          cursor: pointer;

          color: #dce9df;

          font-size: 11px;

          line-height: 1.5;

          text-align: left;
        }

        .consent input {
          width: 18px;
          height: 18px;

          flex: 0 0 18px;

          margin: 1px 0 0;

          accent-color: var(--mint);

          cursor: pointer;
        }

        .consent a {
          color: var(--mint);

          text-decoration-thickness: 1px;

          text-underline-offset: 3px;
        }

        .consent a:hover {
          color: var(--white);
        }

        .continue-button {
          width: 100%;

          border: 0;

          border-radius: 100px;

          padding: 15px 20px;

          background: var(--mint);

          color: var(--forest-dark);

          font-size: 14px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform 160ms ease,
            background 160ms ease,
            box-shadow 160ms ease;
        }

        .continue-button:hover:not(:disabled) {
          background: var(--mint-bright);

          transform: translateY(-2px);

          box-shadow:
            0 8px 20px rgba(141, 207, 148, 0.18);
        }

        .continue-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .continue-button:focus-visible {
          outline: 2px solid var(--white);
          outline-offset: 3px;
        }

        .continue-button:disabled {
          opacity: 0.35;

          cursor: not-allowed;
        }

        /* ==================================================
           THREE STORY BLOCKS
        ================================================== */

        .intro-strip {
          display: flex;
          flex-direction: column;

          gap: 1px;

          margin-top: 35px;

          overflow: hidden;

          border-radius: 21px;

          background: rgba(255, 255, 255, 0.1);
        }

        .intro-item {
          padding: 23px;

          min-height: 125px;

          background: rgba(255, 255, 255, 0.035);
        }

        .intro-item:nth-child(2) {
          background: var(--powder-blue);

          color: var(--forest);
        }

        .intro-item:nth-child(3) {
          background: var(--mint);

          color: var(--forest);
        }

        .intro-number {
          display: block;

          margin-bottom: 10px;

          color: var(--ochre);

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.14em;
        }

        .intro-item:nth-child(2) .intro-number,
        .intro-item:nth-child(3) .intro-number {
          color: var(--forest);

          opacity: 0.55;
        }

        .intro-title {
          margin: 0 0 6px;

          font-size: 18px;

          letter-spacing: -0.02em;
        }

        .intro-text {
          margin: 0;

          max-width: 300px;

          opacity: 0.7;

          font-size: 12px;

          line-height: 1.5;
        }

        /* ==================================================
           COMMUNITY VOICES
        ================================================== */

        .community-voices {
          margin-top: 38px;
          padding: 25px 18px 18px;
          border: 1px solid rgba(245, 242, 232, 0.12);
          border-radius: 23px;
          background: rgba(25, 54, 47, 0.72);
          box-shadow: 0 15px 34px rgba(17, 45, 37, 0.12);
          overflow: hidden;
        }

        .voices-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .voices-kicker {
          margin-bottom: 7px;
          color: var(--mint);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .voices-title {
          margin: 0;
          color: var(--white);
          font-size: clamp(22px, 4vw, 30px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .voices-badge {
          display: block;
          width: 58px;
          height: 58px;
          flex: 0 0 58px;
          margin: -4px -2px 0 0;
          filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.22));
          animation: badge-bob 5s ease-in-out infinite;
        }

        .voices-badge svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .message-window {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          min-height: 190px;
          padding: 24px 21px 18px;
          border: 1px solid rgba(45, 80, 70, 0.1);
          border-radius: 18px;
          background: var(--cream);
          color: var(--forest);
          text-align: left;
          cursor: pointer;
          overflow: hidden;
          transition: transform 180ms ease, background 180ms ease;
        }

        .message-window:hover {
          transform: translateY(-2px);
          background: var(--white);
        }

        .message-window:focus-visible {
          outline: 3px solid var(--ochre-light);
          outline-offset: 4px;
        }

        .message-quote-mark {
          height: 31px;
          color: var(--ochre);
          font-family: Georgia, serif;
          font-size: 54px;
          line-height: 0.9;
        }

        .participant-message {
          display: block;
          flex: 1;
          margin: 5px 0 22px;
          color: var(--forest);
          font-size: clamp(17px, 3vw, 22px);
          font-weight: 600;
          line-height: 1.45;
          letter-spacing: -0.025em;
          overflow-wrap: anywhere;
          animation: message-arrive 420ms ease both;
        }

        .message-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 13px;
          border-top: 1px solid rgba(45, 80, 70, 0.12);
        }

        .message-attribution,
        .message-control {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--sage);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .message-anonymous-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: var(--mint);
          box-shadow: 0 0 0 3px rgba(141, 207, 148, 0.2);
        }

        .message-control {
          color: var(--forest);
          white-space: nowrap;
        }

        .message-progress {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(45, 80, 70, 0.08);
        }

        .message-progress-bar {
          display: block;
          width: 100%;
          height: 100%;
          transform: scaleX(0);
          transform-origin: left center;
          background: var(--ochre);
          animation: message-progress 4.5s linear forwards;
        }

        .message-progress-bar.paused {
          animation-play-state: paused;
        }

        .voices-note {
          margin: 13px 3px 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 10px;
          line-height: 1.6;
          text-align: center;
        }

        @keyframes message-arrive {
          from {
            opacity: 0;
            transform: translateY(7px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes message-progress {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        /* ==================================================
           JOURNEY
        ================================================== */

        .journey {
          margin-top: 42px;

          padding: 27px 18px;

          border-radius: 23px;

          background: var(--powder-blue);

          color: var(--forest);

          overflow: hidden;
        }

        .journey-header {
          display: block;

          margin-bottom: 22px;
        }

        .journey-kicker {
          margin-bottom: 8px;

          color: var(--sage);

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.16em;

          text-transform: uppercase;
        }

        .journey-title {
          margin: 0;

          font-size: 39px;

          line-height: 0.92;

          letter-spacing: -0.055em;
        }

        .journey-script {
          margin-top: 14px;

          color: var(--ochre);

          font-family: "Pinyon Script", cursive;

          font-size: 34px;

          line-height: 1;

          white-space: normal;

          transform: none;
        }

        .journey-map {
          width: 100%;

          padding: 12px;

          border-radius: 16px;

          background: rgba(255, 255, 255, 0.48);

          overflow-x: auto;

          -webkit-overflow-scrolling: touch;
        }

        /* ==================================================
           FOOTER
        ================================================== */

        .footer {
          margin: 24px 0 0;
          padding-top: 20px;
          border-top: 1px solid rgba(245, 242, 232, 0.16);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
        }

        .footer-brand {
          color: var(--mint-bright);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .footer-tagline {
          color: rgba(245, 242, 232, 0.58);
          font-size: 11px;
        }

        .footer-disclaimer {
          max-width: 520px;
          margin: 10px 0 0;
          color: rgba(245, 242, 232, 0.5);
          font-size: 10px;
          line-height: 1.6;
        }

        .footer-disclaimer a {
          color: var(--mint);
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }

        .footer-disclaimer a:hover {
          color: var(--white);
        }

        /* ==================================================
           VERY SMALL PHONES
        ================================================== */

        @media (max-width: 360px) {
          .brand-logo {
            width: 30px;
            height: 30px;
            flex-basis: 30px;
          }

          .hero-copy {
            padding-left: 18px;
            padding-right: 18px;
          }

          .hero-title {
            font-size: 54px;
          }

          .script-line {
            font-size: 38px;
          }

          .hero-art {
            height: 310px;
            min-height: 310px;
          }

          .art-circle {
            width: 235px;
            height: 235px;
          }

          .art-badge {
            width: 100px;
            height: 100px;
            right: 0;
            top: 4px;
          }

          .chair {
            transform: scale(0.86);
          }

          .journey-title {
            font-size: 34px;
          }
        }

        /* ==================================================
           TABLET / DESKTOP
        ================================================== */

        @media (min-width: 700px) {
          .chair-page {
            padding: 18px;
          }

          .brand {
            gap: 12px;
            font-size: 22px;
          }

          .brand-logo {
            width: 54px;
            height: 54px;
            flex-basis: 54px;
          }

          .location-pill {
            padding: 10px 22px;
            font-size: 14px;
          }

          .hero {
            display: grid;

            grid-template-columns: 1fr 0.9fr;

            min-height: 620px;

            border-radius: 44px;
          }

          .hero::before {
            width: 440px;
            height: 440px;
            top: -210px;
            right: -150px;
          }

          .hero::after {
            width: 360px;
            height: 360px;
            bottom: -190px;
            right: -130px;
          }

          .hero-copy {
            padding: 62px 30px 55px 60px;

            align-items: flex-start;

            text-align: left;
          }

          .eyebrow {
            justify-content: flex-start;

            font-size: 12px;
          }

          .eyebrow-line {
            width: 40px;
          }

          .hero-title {
            font-size: clamp(70px, 8.5vw, 108px);
          }

          .script-line {
            font-size: 58px;
          }

          .hero-description {
            font-size: 18px;

            max-width: 440px;
          }

          .hero-subtext {
            font-size: 14px;

            max-width: 420px;
          }

          .about-link {
            font-size: 16px;

            padding: 15px 32px;
          }

          .hero-art {
            height: auto;

            min-height: 600px;
          }

          .art-circle {
            width: 440px;
            height: 440px;
          }

          .art-badge {
            width: 176px;
            height: 176px;

            right: 26px;
            top: 26px;
          }

          .art-star {
            left: 50px;
            bottom: 100px;

            width: 34px;
            height: 34px;
          }

          .art-star-2 {
            left: 90px;
            top: 120px;

            width: 20px;
            height: 20px;
          }

          .art-dot.one {
            left: 130px;
            bottom: 70px;
          }

          .art-dot.two {
            right: 120px;
            bottom: 130px;
          }

          .chair {
            width: 330px;
            height: 400px;

            transform: none;
          }

          .chair-floor {
            left: 30px;
            top: 410px;

            width: 270px;
            height: 26px;
          }

          .chair-back {
            left: 63px;
            top: 25px;

            width: 205px;
            height: 255px;
          }

          .chair-back::before,
          .chair-back::after {
            top: 86px;

            width: 14px;
            height: 14px;
          }

          .chair-back::before {
            left: 58px;
          }

          .chair-back::after {
            left: 133px;
          }

          .chair-seat {
            left: 40px;
            top: 255px;

            width: 254px;
            height: 76px;
          }

          .chair-seat::after {
            top: 34px;
          }

          .chair-arm-left,
          .chair-arm-right {
            top: 205px;

            width: 48px;
            height: 132px;
          }

          .chair-arm-left {
            left: 18px;
          }

          .chair-arm-right {
            right: 18px;
          }

          .chair-leg {
            top: 326px;

            width: 17px;
            height: 92px;
          }

          .chair-leg.left {
            left: 66px;
          }

          .chair-leg.right {
            right: 66px;
          }

          .chair-leg.back-left,
          .chair-leg.back-right {
            top: 318px;

            height: 76px;
          }

          .chair-leg.back-left {
            left: 106px;
          }

          .chair-leg.back-right {
            right: 106px;
          }

          .action-card {
            width: calc(100% - 90px);

            margin-top: -45px;

            padding: 25px 30px;

            display: grid;

            grid-template-columns: 1fr auto;

            align-items: center;
          }

          .continue-button {
            width: auto;

            min-width: 150px;
          }

          .intro-strip {
            display: grid;

            grid-template-columns: repeat(3, 1fr);
          }

          .journey {
            padding: 48px;
          }

          .journey-header {
            display: flex;

            align-items: flex-end;

            justify-content: space-between;
          }

          .journey-title {
            font-size: clamp(40px, 5vw, 58px);
          }

          .journey-script {
            margin-top: 0;

            font-size: 42px;
          }

          .voices-badge {
            width: 72px;
            height: 72px;
            flex-basis: 72px;
          }

          .footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }
        }

        /* ==================================================
           SMALL PHONES: COMMUNITY CARD
        ================================================== */

        @media (max-width: 420px) {
          .community-voices {
            padding: 21px 13px 15px;
          }

          .message-window {
            min-height: 205px;
            padding: 20px 16px 17px;
          }

          .message-bottom-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 9px;
          }
        }

        /* ==================================================
           REDUCE MOTION
        ================================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

        <div className="chair-shell">
          {/* ================================================
            HEADER
        ================================================= */}

          <header className="topbar">
            <div className="brand">
              <AdminGestureLogo
                  className="brand-logo"
                  src="/logos/factor-of-ten-logo.jpg"
                  alt="Factor of Ten Foundation logo"
              />

              <span className="brand-mark" aria-hidden="true" />

              The Chair Listens
            </div>

            <div className="header-actions">
              <div className="location-pill">
                <span className="location-pill-dot" />
                {displayLocation}
              </div>
            </div>
          </header>

          {/* ================================================
            HERO
        ================================================= */}

          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                A space to pause
                <span className="eyebrow-line" />
              </div>

              <h1 className="hero-title">
                <span className="hero-line">The</span>
                <span className="hero-line">Chair</span>
                <span className="hero-line accent">Listens.</span>
              </h1>

              <div className="script-line">
                Take a seat
              </div>

              <p className="hero-description">
                The <strong>Chair</strong> gives men a quiet, anonymous place to
                be heard and to learn about prostate health, so that talking and
                getting checked feel a little easier.
              </p>

              <button
                  type="button"
                  className="about-link"
                  onClick={() => setAboutOpen(true)}
              >
                Small Acts. Tenfold Impact.
              </button>

              <p className="hero-subtext">
                Sit for a minute. Say what’s on your mind.
                No names. No judgement. Just a moment to be heard.
              </p>
            </div>

            {/* ==============================================
              CHAIR + PROSTATE CANCER AWARENESS RIBBON
          ============================================== */}

            <div className="hero-art">
              <div className="art-circle" />

              <RibbonBadge />

              <FourPointStar className="art-star" />
              <FourPointStar className="art-star-2" />
              <span className="art-dot one" aria-hidden="true" />
              <span className="art-dot two" aria-hidden="true" />

              <div className="chair">
                <div className="chair-floor" />

                <div className="chair-back" />

                <div className="chair-arm-left" />

                <div className="chair-arm-right" />

                <div className="chair-leg back-left" />

                <div className="chair-leg back-right" />

                <div className="chair-seat" />

                <div className="chair-leg left" />

                <div className="chair-leg right" />
              </div>
            </div>
          </section>

          {/* ================================================
            CONSENT + CTA
        ================================================= */}

          <section className="action-card">
            <label
                className="consent"
                htmlFor="popia-consent"
            >
              <input
                  id="popia-consent"
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
              />

              <span>
              I confirm I am 18 or older (or participating
              with parent/guardian supervision) and agree
              to anonymously participate. I have read and
              accepted the{" "}

                <a
                    href={POPIA_TERMS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                POPIA Privacy Notice & Consent Terms
              </a>
              .
            </span>
            </label>

            <button
                type="button"
                className="continue-button"
                onClick={handleContinue}
                disabled={!consented || submitting}
            >
              {submitting ? "Please wait..." : "Take a seat"}
            </button>

            {consentError && (
              <p role="alert" className="consent-message consent-message-error">
                {consentError}
              </p>
            )}
            {!consentError && router.query.consent === "required" && (
              <p role="status" className="consent-message">
                Please confirm your consent to continue.
              </p>
            )}

          </section>

          {/* ================================================
            THREE STEPS
        ================================================= */}

          <section className="intro-strip">
            <div className="intro-item">
            <span className="intro-number">
              01 / PAUSE
            </span>

              <h3 className="intro-title">
                Take a breath.
              </h3>

              <p className="intro-text">
                Step away from the noise and give
                yourself a minute.
              </p>
            </div>

            <div className="intro-item">
            <span className="intro-number">
              02 / SPEAK
            </span>

              <h3 className="intro-title">
                Say what you feel.
              </h3>

              <p className="intro-text">
                Type it out or speak naturally.
                There is no right answer.
              </p>
            </div>

            <div className="intro-item">
            <span className="intro-number">
              03 / LISTEN
            </span>

              <h3 className="intro-title">
                You are heard.
              </h3>

              <p className="intro-text">
                Your words become part of something
                bigger, anonymously.
              </p>
            </div>
          </section>

          {/* ================================================
            COMMUNITY VOICES
        ================================================= */}

          <section
              className="community-voices"
              aria-label="Messages from the community"
          >
            <div className="voices-heading">
              <div>
                <div className="voices-kicker">
                  A few words from the community
                </div>

                <h2 className="voices-title">
                  You are not sitting alone.
                </h2>
              </div>

              <QuoteBadge />
            </div>

            <button
                type="button"
                className="message-window"
                onClick={() => setMessagesPaused((paused) => !paused)}
                aria-pressed={messagesPaused}
                aria-label={
                  messagesPaused
                      ? "Resume rotating messages"
                      : "Pause rotating messages to read"
                }
            >
            <span className="message-quote-mark" aria-hidden="true">
              “
            </span>

              <span
                  key={activeMessageIndex}
                  className="participant-message"
              >
              {participantMessages[activeMessageIndex]}
            </span>

              <span className="message-bottom-row">
              <span className="message-control">
                {messagesPaused
                    ? "Paused · tap to play ▷"
                    : "Tap to pause Ⅱ"}
              </span>
            </span>

              <span className="message-progress" aria-hidden="true">
              <span
                  key={`${activeMessageIndex}-${messagesPaused}`}
                  className={`message-progress-bar${
                      messagesPaused ? " paused" : ""
                  }`}
              />
            </span>
            </button>

            <p className="voices-note">
              Anonymous words shared by our community members.
            </p>
          </section>

          {/* ================================================
            JOURNEY
        ================================================= */}

          <section className="journey">
            <div className="journey-header">
              <div>
                <div className="journey-kicker">
                  The Chair's journey
                </div>

                <h2 className="journey-title">
                  Where we've
                  <br />
                  been sitting.
                </h2>
              </div>

              <div className="journey-script">
                Come sit with us.
              </div>
            </div>

            <div className="journey-map">
              <ChairJourneyMap />
            </div>
          </section>

          {/* ================================================
            FOOTER
        ================================================= */}

          <footer className="footer">
          <span className="footer-brand">
            FACTOR OF TEN
          </span>

            <span className="footer-tagline">
            Know more. Ask more. Check sooner.
          </span>

            <p className="footer-disclaimer">
              The Chair Listens offers awareness and reflection, not medical
              advice, diagnosis or crisis care. If you have symptoms or
              concerns, speak to a doctor or clinic. If you are in danger or
              distress, use the{" "}
              <a href="/emergency">
                emergency resources
              </a>
              .
            </p>
          </footer>
        </div>

        <AboutFactorOfTen
            open={aboutOpen}
            onClose={() => setAboutOpen(false)}
        />
      </main>
  );
}