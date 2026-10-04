import { useState, useEffect } from "react";
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

export default function Home({ locationName = "Pretoria" }) {
  const router = useRouter();
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [detectedLocation, setDetectedLocation] = useState(null);

  // Detect the visitor's location on page load
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();

            const place =
                data?.address?.city ||
                data?.address?.town ||
                data?.address?.village ||
                data?.address?.suburb ||
                null;

            if (place) setDetectedLocation(place);
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
          }
        },
        (err) => {
          console.error("Geolocation permission denied or unavailable:", err);
        }
    );
  }, []);

  // Use the detected location if we have it, otherwise fall back to the prop
  const displayLocation = detectedLocation || locationName;

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
          location_id: displayLocation,
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

      router.push({
        pathname: "/check-in",
        query: { location: displayLocation },
      });
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
            Sitting today in {displayLocation}
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

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/router";
// import ChairJourneyMap from "@/components/ChairJourneyMap";
//
// /**
//  * The Chair Listens — Home / landing + consent
//  *
//  * Color system: Factor of Ten brand tokens (--fot-*), dark theme active
//  * by default. Light tokens are included and ready for a future light
//  * mode, but not switched on here — this page still targets the same
//  * dark, contemplative feel as the rest of the app.
//  *
//  * Motion: three lightweight, purposeful animations rather than a wall
//  * of effects —
//  *   1. Line-draw reveal on the chair illustration (stroke-dasharray),
//  *      so the hero draws itself in rather than just appearing.
//  *   2. Staggered fade/slide-up on the headline, body copy, and consent
//  *      block, timed just after the line-draw finishes.
//  *   3. Scroll-triggered reveal on the "Where the chair has been"
//  *      section via IntersectionObserver, so it animates in the first
//  *      time it enters view rather than animating on every scroll pass.
//  *
//  * Location is detected via the browser's Geolocation API, then
//  * reverse-geocoded via OpenStreetMap's Nominatim (free, no API key).
//  * Falls back to the locationName prop if permission is denied.
//  */
//
// const POPIA_TERMS_URL = "/consent-terms";
//
// export default function Home({ locationName = "Pretoria" }) {
//   const router = useRouter();
//   const [consented, setConsented] = useState(false);
//   const [detectedLocation, setDetectedLocation] = useState(null);
//   const [mounted, setMounted] = useState(false);
//   const journeyRef = useRef(null);
//   const [journeyVisible, setJourneyVisible] = useState(false);
//   const heroRef = useRef(null);
//   const [tilt, setTilt] = useState({ x: 0, y: 0 });
//   const [hovering, setHovering] = useState(false);
//
//   // Interactive 3D tilt on pointer move (desktop-friendly progressive
//   // enhancement — mobile visitors just get the idle CSS tilt animation
//   // below, since there's no hover/pointer-move to drive this).
//   function handlePointerMove(e) {
//     if (!heroRef.current) return;
//     const rect = heroRef.current.getBoundingClientRect();
//     const px = (e.clientX - rect.left) / rect.width; // 0 -> 1
//     const py = (e.clientY - rect.top) / rect.height; // 0 -> 1
//     const rotateY = (px - 0.5) * 22; // left/right tilt
//     const rotateX = (0.5 - py) * 16; // up/down tilt
//     setTilt({ x: rotateX, y: rotateY });
//   }
//
//   function handlePointerLeave() {
//     setHovering(false);
//     setTilt({ x: 0, y: 0 });
//   }
//
//   // Trigger the entrance animation shortly after mount
//   useEffect(() => {
//     const t = setTimeout(() => setMounted(true), 50);
//     return () => clearTimeout(t);
//   }, []);
//
//   // Detect the visitor's location on page load
//   useEffect(() => {
//     if (typeof window === "undefined" || !navigator.geolocation) return;
//
//     navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           try {
//             const res = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
//             );
//             const data = await res.json();
//             const place =
//                 data?.address?.city ||
//                 data?.address?.town ||
//                 data?.address?.village ||
//                 data?.address?.suburb ||
//                 null;
//             if (place) setDetectedLocation(place);
//           } catch (err) {
//             console.error("Reverse geocoding failed:", err);
//           }
//         },
//         (err) => {
//           console.error("Geolocation permission denied or unavailable:", err);
//         }
//     );
//   }, []);
//
//   // Scroll-triggered reveal for the journey section
//   useEffect(() => {
//     if (typeof window === "undefined" || !journeyRef.current) return;
//     const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setJourneyVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.15 }
//     );
//     observer.observe(journeyRef.current);
//     return () => observer.disconnect();
//   }, []);
//
//   const displayLocation = detectedLocation || locationName;
//
//   async function handleContinue() {
//     if (!consented) return;
//     try {
//       await fetch("/api/consent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ location_id: displayLocation }),
//       });
//       router.push({ pathname: "/check-in", query: { location: displayLocation } });
//     } catch (error) {
//       console.error(error);
//       router.push({ pathname: "/check-in", query: { location: displayLocation } });
//     }
//   }
//
//   return (
//       <main style={styles.page}>
//         <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&display=swap');
//
//         :root {
//           /* Dark Surfaces */
//           --fot-bg-dark: #121824;
//           --fot-bg-dark-deep: #0B0F17;
//           --fot-card-dark: #1A2332;
//
//           /* Light Surfaces */
//           --fot-bg-light: #F9F8F5;
//           --fot-card-light: #FFFFFF;
//
//           /* Accent Colors */
//           --fot-accent-gold: #C5A358;
//           --fot-accent-gold-light: #D9C489;
//
//           /* Text Colors */
//           --fot-text-primary-dark: #111827;
//           --fot-text-secondary-dark: #4B5563;
//           --fot-text-primary-light: #F5F6FA;
//           --fot-text-secondary-light: #AEB8D6;
//         }
//
//         .clisten-continue {
//           transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
//         }
//         .clisten-continue:not(:disabled):hover {
//           transform: translateY(-1px);
//           box-shadow: 0 10px 24px rgba(197, 163, 88, 0.28);
//         }
//         .clisten-continue:not(:disabled):active {
//           transform: translateY(0px) scale(0.98);
//         }
//         .clisten-continue:focus-visible {
//           outline: 2px solid var(--fot-text-primary-light);
//           outline-offset: 3px;
//         }
//         .clisten-checkbox:focus-visible {
//           outline: 2px solid var(--fot-accent-gold);
//           outline-offset: 3px;
//         }
//         .clisten-link {
//           color: var(--fot-accent-gold-light);
//           text-decoration: underline;
//           text-underline-offset: 2px;
//         }
//         .clisten-link:hover { color: var(--fot-text-primary-light); }
//
//         @keyframes chairLivePulse {
//           0% { box-shadow: 0 0 0 0 rgba(143, 209, 158, 0.6); }
//           70% { box-shadow: 0 0 0 8px rgba(143, 209, 158, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(143, 209, 158, 0); }
//         }
//
//         /* Line-draw reveal on the chair illustration */
//         .clisten-chair-line {
//           stroke-dasharray: 620;
//           stroke-dashoffset: 620;
//           animation: clistenDraw 1100ms ease forwards;
//         }
//         @keyframes clistenDraw {
//           to { stroke-dashoffset: 0; }
//         }
//
//         /* 3D hero: perspective wrapper + idle sway + interactive tilt */
//         .clisten-hero-perspective {
//           perspective: 900px;
//           display: flex;
//           justify-content: center;
//         }
//         .clisten-hero-3d {
//           transform-style: preserve-3d;
//           transform-origin: 50% 85%;
//           animation: clistenIdleSway 6s ease-in-out infinite;
//           filter: drop-shadow(0 18px 22px rgba(0, 0, 0, 0.35));
//         }
//         .clisten-hero-3d.hovering {
//           animation-play-state: paused;
//         }
//         @keyframes clistenIdleSway {
//           0%, 100% { transform: rotateY(-7deg) rotateX(2deg); }
//           50% { transform: rotateY(7deg) rotateX(-2deg); }
//         }
//         .clisten-hero-shadow {
//           width: 150px;
//           height: 22px;
//           margin: 6px auto 0;
//           border-radius: 50%;
//           background: radial-gradient(closest-side, rgba(0,0,0,0.45), transparent 75%);
//           animation: clistenShadowSway 6s ease-in-out infinite;
//         }
//         @keyframes clistenShadowSway {
//           0%, 100% { transform: translateX(-10px) scaleX(1); opacity: 0.55; }
//           50% { transform: translateX(10px) scaleX(0.92); opacity: 0.4; }
//         }
//
//         @media (prefers-reduced-motion: reduce) {
//           .clisten-hero-3d, .clisten-hero-shadow { animation: none !important; }
//         }
//
//         /* Staggered fade/slide-up entrance */
//         .clisten-reveal {
//           opacity: 0;
//           transform: translateY(14px);
//           transition: opacity 520ms ease, transform 520ms ease;
//         }
//         .clisten-reveal.in {
//           opacity: 1;
//           transform: translateY(0);
//         }
//
//         /* Scroll-triggered reveal for the journey section */
//         .clisten-scroll-reveal {
//           opacity: 0;
//           transform: translateY(24px);
//           transition: opacity 650ms ease, transform 650ms ease;
//         }
//         .clisten-scroll-reveal.in {
//           opacity: 1;
//           transform: translateY(0);
//         }
//
//         @media (prefers-reduced-motion: reduce) {
//           .clisten-chair-line { animation: none; stroke-dashoffset: 0; }
//           .clisten-reveal, .clisten-scroll-reveal {
//             opacity: 1 !important;
//             transform: none !important;
//             transition: none !important;
//           }
//         }
//       `}
//         </style>
//
//         <div style={styles.frame}>
//           <div
//               className="clisten-reveal in"
//               style={{ ...styles.locationTag, transitionDelay: "60ms" }}
//           >
//             <span style={styles.locationDot} aria-hidden="true" />
//             Sitting today in {displayLocation}
//           </div>
//
//           <div className="clisten-hero-perspective">
//             <div
//                 ref={heroRef}
//                 className={`clisten-hero-3d ${hovering ? "hovering" : ""}`}
//                 onPointerMove={handlePointerMove}
//                 onPointerEnter={() => setHovering(true)}
//                 onPointerLeave={handlePointerLeave}
//                 style={{
//                   transform: hovering
//                       ? `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`
//                       : undefined,
//                 }}
//             >
//               <svg
//                   viewBox="0 0 240 240"
//                   width="200"
//                   height="200"
//                   role="img"
//                   aria-label="A simple illustration of a blue upholstered armchair"
//               >
//                 <defs>
//                   <linearGradient id="seatGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#3A5FBE" />
//                     <stop offset="100%" stopColor="#16265E" />
//                   </linearGradient>
//                   <linearGradient id="backGrad" x1="0" y1="0" x2="1" y2="1">
//                     <stop offset="0%" stopColor="#3F63C4" />
//                     <stop offset="60%" stopColor="#2A4FA0" />
//                     <stop offset="100%" stopColor="#17265C" />
//                   </linearGradient>
//                   <linearGradient id="armGrad" x1="0" y1="0" x2="1" y2="0">
//                     <stop offset="0%" stopColor="#3A5FBE" />
//                     <stop offset="100%" stopColor="#1F3A85" />
//                   </linearGradient>
//                 </defs>
//
//                 {/* wooden legs */}
//                 <g stroke="#8B5E34" strokeWidth="6" strokeLinecap="round">
//                   <path d="M62 190 L40 230" /><path d="M178 190 L200 230" />
//                   <path d="M62 190 L88 230" opacity="0.55" /><path d="M178 190 L152 230" opacity="0.55" />
//                 </g>
//
//                 {/* seat base */}
//                 <rect x="48" y="168" width="144" height="30" rx="8" fill="url(#seatGrad)" />
//
//                 {/* armrests */}
//                 <rect x="34" y="118" width="26" height="72" rx="13" fill="url(#armGrad)" />
//                 <rect x="180" y="118" width="26" height="72" rx="13" fill="url(#armGrad)" />
//
//                 {/* backrest */}
//                 <rect x="56" y="46" width="128" height="132" rx="26" fill="url(#backGrad)" />
//
//                 {/* tufting diamonds — line-draw animated */}
//                 <g
//                     className="clisten-chair-line"
//                     stroke="#0C1638"
//                     strokeWidth="2"
//                     opacity="0.8"
//                     fill="none"
//                 >
//                   <path d="M120 62 L92 90 L120 118 L148 90 Z" />
//                   <path d="M120 118 L92 146 L120 174 L148 146 Z" />
//                   <path d="M92 90 L64 118 L92 146" />
//                   <path d="M148 90 L176 118 L148 146" />
//                 </g>
//                 <g fill="#0C1638" opacity="0.75">
//                   <circle cx="120" cy="62" r="2.6" /><circle cx="92" cy="90" r="2.6" />
//                   <circle cx="148" cy="90" r="2.6" /><circle cx="120" cy="118" r="2.6" />
//                   <circle cx="92" cy="146" r="2.6" /><circle cx="148" cy="146" r="2.6" />
//                   <circle cx="120" cy="174" r="2.6" /><circle cx="64" cy="118" r="2.6" />
//                   <circle cx="176" cy="118" r="2.6" />
//                 </g>
//
//                 {/* seat cushion highlight */}
//                 <rect x="48" y="168" width="144" height="8" rx="4" fill="#6E8FE0" opacity="0.55" />
//
//                 {/* rim light along the left edge of the backrest, for volume */}
//                 <rect x="58" y="48" width="6" height="128" rx="3" fill="#7A9CF0" opacity="0.35" />
//               </svg>
//             </div>
//           </div>
//           <div className="clisten-hero-shadow" aria-hidden="true" />
//
//           <div
//               className={`clisten-reveal ${mounted ? "in" : ""}`}
//               style={{ ...styles.textBlock, transitionDelay: "260ms" }}
//           >
//             <h1 style={styles.headline}>The Chair Listens</h1>
//             <p style={styles.body}>Sit for a minute. Say what's on your mind</p>
//             <p style={styles.body}>&mdash; nobody here needs your name.</p>
//           </div>
//
//           <label
//               className={`clisten-reveal ${mounted ? "in" : ""}`}
//               style={{ ...styles.consentRow, transitionDelay: "360ms" }}
//               htmlFor="popia-consent"
//           >
//             <input
//                 id="popia-consent"
//                 type="checkbox"
//                 className="clisten-checkbox"
//                 checked={consented}
//                 onChange={(e) => setConsented(e.target.checked)}
//                 style={styles.checkbox}
//             />
//             <span style={styles.consentText}>
//             I confirm I am 18 or older (or participating with parent/guardian
//             supervision) and agree to anonymously participate. I have read
//             and accepted the{" "}
//               <a
//                   href={POPIA_TERMS_URL}
//                   className="clisten-link"
//                   target="_blank"
//                   rel="noopener noreferrer"
//               >
//               POPIA Privacy Notice &amp; Consent Terms
//             </a>
//             .
//           </span>
//           </label>
//
//           <div
//               className={`clisten-reveal ${mounted ? "in" : ""}`}
//               style={{ transitionDelay: "440ms", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
//           >
//             <button
//                 type="button"
//                 className="clisten-continue"
//                 onClick={handleContinue}
//                 disabled={!consented}
//                 aria-disabled={!consented}
//                 style={{
//                   ...styles.cta,
//                   opacity: consented ? 1 : 0.45,
//                   cursor: consented ? "pointer" : "not-allowed",
//                 }}
//             >
//               Continue
//             </button>
//
//             <p style={styles.footnote}>Type it out, or just say it out loud.</p>
//           </div>
//
//           {/* Where The Chair Has Been — scroll-triggered reveal */}
//           <div style={styles.journeyDivider} />
//           <div
//               ref={journeyRef}
//               className={`clisten-scroll-reveal ${journeyVisible ? "in" : ""}`}
//               style={styles.journeySection}
//           >
//             <ChairJourneyMap />
//           </div>
//         </div>
//       </main>
//   );
// }
//
// const styles = {
//   page: {
//     minHeight: "100vh",
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background:
//         "radial-gradient(120% 60% at 50% 0%, #1A2332 0%, #121824 45%, #0B0F17 85%)",
//     fontFamily: "'IBM Plex Sans', sans-serif",
//     padding: "32px 20px 56px",
//     boxSizing: "border-box",
//   },
//   frame: {
//     width: "100%",
//     maxWidth: "380px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     textAlign: "center",
//   },
//   locationTag: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "7px",
//     color: "#D9C489",
//     fontSize: "13px",
//     letterSpacing: "0.01em",
//     marginBottom: "8px",
//     fontWeight: 500,
//   },
//   locationDot: {
//     width: "6px",
//     height: "6px",
//     borderRadius: "50%",
//     background: "#C5A358",
//     display: "inline-block",
//   },
//   heroWrap: {
//     marginTop: "16px",
//     marginBottom: "4px",
//     display: "flex",
//     justifyContent: "center",
//   },
//   textBlock: {
//     marginTop: "12px",
//     marginBottom: "26px",
//   },
//   headline: {
//     fontFamily: "'IBM Plex Sans', sans-serif",
//     fontWeight: 700,
//     fontSize: "34px",
//     lineHeight: 1.15,
//     color: "#F5F6FA",
//     margin: "0 0 14px 0",
//     letterSpacing: "-0.01em",
//   },
//   body: {
//     fontSize: "16px",
//     lineHeight: 1.55,
//     color: "#AEB8D6",
//     margin: 0,
//     maxWidth: "300px",
//     marginLeft: "auto",
//     marginRight: "auto",
//   },
//   consentRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "10px",
//     textAlign: "left",
//     maxWidth: "320px",
//     marginBottom: "24px",
//     cursor: "pointer",
//   },
//   checkbox: {
//     marginTop: "3px",
//     width: "18px",
//     height: "18px",
//     flexShrink: 0,
//     accentColor: "#C5A358",
//     cursor: "pointer",
//   },
//   consentText: {
//     fontSize: "13px",
//     lineHeight: 1.55,
//     color: "#AEB8D6",
//   },
//   cta: {
//     appearance: "none",
//     border: "none",
//     background: "#C5A358",
//     color: "#0B0F17",
//     fontFamily: "'IBM Plex Sans', sans-serif",
//     fontWeight: 600,
//     fontSize: "16px",
//     padding: "15px 56px",
//     borderRadius: "999px",
//     letterSpacing: "0.01em",
//   },
//   footnote: {
//     marginTop: "16px",
//     fontSize: "13px",
//     color: "#7E88AC",
//   },
//   journeyDivider: {
//     width: "100%",
//     maxWidth: "320px",
//     height: "1px",
//     backgroundColor: "rgba(174, 184, 214, 0.15)",
//     marginTop: "40px",
//     marginBottom: "32px",
//   },
//   journeySection: {
//     width: "100%",
//     textAlign: "left",
//   },
// };