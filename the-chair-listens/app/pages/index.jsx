// Destination: pages/index.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChairJourneyMap from "@/components/ChairJourneyMap";

const POPIA_TERMS_URL = "/consent-terms";

export default function Home({ locationName = "Pretoria" }) {
  const router = useRouter();

  const [consented, setConsented] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [messagesPaused, setMessagesPaused] = useState(false);

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
          // Map the database rows to just the text content string
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
      setActiveMessageIndex((current) => (current + 1) % participantMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [messagesPaused, participantMessages.length]);

  // --------------------------------------------------
  // Detect visitor location
  // --------------------------------------------------

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

            if (place) {
              setDetectedLocation(place);
            }
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
          }
        },
        (err) => {
          console.error("Geolocation unavailable:", err);
        }
    );
  }, []);

  const displayLocation = detectedLocation || locationName;

  // --------------------------------------------------
  // Continue
  // --------------------------------------------------

  async function handleContinue() {
    if (!consented) return;

    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_id: displayLocation,
        }),
      });
    } catch (error) {
      console.error("Consent request failed:", error);
    }

    router.push({
      pathname: "/check-in",
      query: {
        location: displayLocation,
      },
    });
  }

  return (
      <main className="chair-page">
        <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap");

        :root {
          /* -----------------------------------------
             BRAND COLOURS
          ----------------------------------------- */

          --forest: #2d5046;
          --forest-dark: #203f36;
          --forest-deep: #19362f;

          --mint: #8dcf94;
          --mint-bright: #a5dfa9;

          --powder-blue: #d4e9ed;
          --powder-blue-dark: #b8dbe0;

          /* ACTUAL CHAIR */
          --chair-blue: #315da8;
          --chair-blue-dark: #24498c;
          --chair-blue-light: #4775c5;

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
          min-height: 48px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          padding: 4px 3px 14px;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 8px;

          color: var(--white);

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .brand-logo {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(245, 242, 232, 0.55);
        }

        .brand-mark {
          width: 9px;
          height: 9px;

          flex: 0 0 auto;

          border-radius: 50%;

          background: var(--mint);

          box-shadow:
            0 0 0 4px rgba(141, 207, 148, 0.12),
            0 0 18px rgba(141, 207, 148, 0.25);
        }

        .location-pill {
          display: inline-flex;
          align-items: center;

          gap: 6px;

          flex-shrink: 0;

          color: var(--forest-dark);
          background: var(--mint);

          border-radius: 100px;

          padding: 7px 10px;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.04em;
        }

        .location-pill-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: var(--forest);
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

          border-radius: 27px;

          background: var(--cream);

          color: var(--forest);

          isolation: isolate;
        }

        .hero::before {
          content: "";

          position: absolute;

          width: 300px;
          height: 300px;

          border-radius: 50%;

          background: var(--powder-blue);

          top: -170px;
          right: -130px;

          z-index: -1;
        }

        .hero::after {
          content: "";

          position: absolute;

          width: 230px;
          height: 230px;

          border-radius: 50%;

          background: var(--mint);

          bottom: -160px;
          left: -120px;

          z-index: -1;
        }

        /* ==================================================
           HERO COPY
        ================================================== */

        .hero-copy {
          padding: 34px 23px 0;

          display: flex;
          flex-direction: column;
          align-items: center;

          text-align: center;

          position: relative;

          z-index: 2;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          margin-bottom: 18px;

          color: var(--sage);

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .eyebrow-line {
          width: 25px;
          height: 1px;

          background: var(--ochre);
        }

        .hero-title {
          margin: 0;

          font-size: clamp(55px, 17vw, 76px);

          line-height: 0.82;

          letter-spacing: -0.065em;

          font-weight: 900;

          color: var(--forest);
        }

        .hero-title span {
          display: block;

          color: var(--mint);
        }

        .script-line {
          margin: 20px 0 10px;

          color: var(--ochre);

          font-family: "Pinyon Script", cursive;

          font-size: 40px;

          line-height: 1;

          transform: none;
        }

        .hero-description {
          max-width: 300px;

          margin: 8px 0 0;

          color: #52645e;

          font-size: 14px;

          line-height: 1.5;
        }

        /* ==================================================
           HERO ART
        ================================================== */

        .hero-art {
          position: relative;

          height: 310px;
          min-height: 310px;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          margin-top: -5px;
        }

        .art-circle {
          position: absolute;

          width: 260px;
          height: 260px;

          border-radius: 50%;

          background: var(--mint);

          opacity: 0.92;
        }

        .art-circle-small {
          position: absolute;

          width: 65px;
          height: 65px;

          border-radius: 50%;

          background: var(--ochre);

          right: 22px;
          top: 45px;
        }

        .art-star {
          position: absolute;

          left: 28px;
          bottom: 55px;

          color: var(--forest);

          font-size: 26px;

          transform: none;
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
              0 20px 18px rgba(35, 66, 100, 0.22)
            );
        }

        .chair-back {
          position: absolute;

          left: 48px;
          top: 12px;

          width: 155px;
          height: 190px;

          border-radius: 60px 60px 20px 20px;

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

        .chair-back::before,
        .chair-back::after {
          content: "";

          position: absolute;

          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #8eb0e7;

          opacity: 0.85;

          left: 73px;
        }

        .chair-back::before {
          top: 68px;
        }

        .chair-back::after {
          top: 116px;
        }

        .chair-seat {
          position: absolute;

          left: 32px;
          top: 190px;

          width: 190px;
          height: 58px;

          border-radius: 19px;

          background:
            linear-gradient(
              180deg,
              var(--chair-blue-light),
              var(--chair-blue-dark)
            );

          box-shadow:
            inset 0 6px 0 rgba(255, 255, 255, 0.1),
            0 8px 0 #1d3c75;
        }

        .chair-arm-left,
        .chair-arm-right {
          position: absolute;

          top: 165px;

          width: 34px;
          height: 85px;

          border-radius: 18px;

          background: var(--chair-blue);
        }

        .chair-arm-left {
          left: 18px;
        }

        .chair-arm-right {
          right: 18px;
        }

        .chair-leg {
          position: absolute;

          width: 9px;
          height: 65px;

          background: var(--ochre);

          border-radius: 7px;

          top: 240px;
        }

        .chair-leg.left {
          left: 54px;

          transform: rotate(8deg);
        }

        .chair-leg.right {
          right: 54px;

          transform: rotate(-8deg);
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
        .voices-symbol {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border-radius: 50%;
          background: var(--ochre);
          color: var(--forest-deep);
          font-size: 17px;
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
        .message-window:hover { transform: translateY(-2px); background: var(--white); }
        .message-window:focus-visible { outline: 3px solid var(--ochre-light); outline-offset: 4px; }
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
        .message-attribution, .message-control {
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
        .message-control { color: var(--forest); white-space: nowrap; }
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
        .message-progress-bar.paused { animation-play-state: paused; }
        .voices-note {
          margin: 13px 3px 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 10px;
          line-height: 1.6;
          text-align: center;
        }
        @keyframes message-arrive {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes message-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
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

        /* NEW: footer disclaimer */
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
            width: 29px;
            height: 29px;
            flex-basis: 29px;
          }

          .hero-copy {
            padding-left: 18px;
            padding-right: 18px;
          }

          .hero-title {
            font-size: 52px;
          }

          .script-line {
            font-size: 35px;
          }

          .hero-art {
            height: 280px;
            min-height: 280px;
          }

          .art-circle {
            width: 235px;
            height: 235px;
          }

          .chair {
            transform: scale(0.88);
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

          .hero {
            display: grid;

            grid-template-columns: 1fr 0.9fr;

            min-height: 620px;
          }

          .hero-copy {
            padding: 65px 30px 55px 60px;

            align-items: flex-start;

            text-align: left;
          }

          .eyebrow {
            justify-content: flex-start;
          }

          .hero-title {
            font-size: clamp(65px, 8vw, 100px);
          }

          .script-line {
            font-size: 52px;
          }

          .hero-description {
            font-size: 16px;

            max-width: 420px;
          }

          .hero-art {
            height: auto;

            min-height: 600px;
          }

          .art-circle {
            width: 430px;
            height: 430px;
          }

          .chair {
            width: 330px;
            height: 400px;

            transform: none;
          }

          .chair-back {
            left: 63px;
            top: 25px;

            width: 205px;
            height: 255px;
          }

          .chair-back::before,
          .chair-back::after {
            left: 97px;
          }

          .chair-back::before {
            top: 92px;
          }

          .chair-back::after {
            top: 155px;
          }

          .chair-seat {
            left: 42px;
            top: 255px;

            width: 250px;
            height: 74px;
          }

          .chair-arm-left,
          .chair-arm-right {
            top: 222px;

            width: 45px;
            height: 110px;
          }

          .chair-arm-left {
            left: 25px;
          }

          .chair-arm-right {
            right: 25px;
          }

          .chair-leg {
            top: 318px;

            width: 12px;
            height: 90px;
          }

          .chair-leg.left {
            left: 70px;
          }

          .chair-leg.right {
            right: 70px;
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

          .footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }
        }

        /* ==================================================
           REDUCE MOTION
        ================================================== */

        @media (max-width: 420px) {
          .community-voices { padding: 21px 13px 15px; }
          .message-window { min-height: 205px; padding: 20px 16px 17px; }
          .message-bottom-row { align-items: flex-start; flex-direction: column; gap: 9px; }
        }

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
              <img
                  className="brand-logo"
                  src="/logos/factor-of-ten-logo.jpg"
                  alt="Factor of Ten Foundation logo"
              />
              <span className="brand-mark" aria-hidden="true" />
              The Chair Listens
            </div>

            <div className="location-pill">
              <span className="location-pill-dot" />
              {displayLocation}
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
              </div>

              <h1 className="hero-title">
                The
                <span>Chair</span>
                Listens.
              </h1>

              {/* STRAIGHT */}
              <div className="script-line">
                Take a seat
              </div>

              <p className="hero-description">
                The Chair gives men a quiet, anonymous place to be heard and to learn about prostate health, so that talking and getting checked feel a little easier.
              </p>

              <p className="hero-description">

              </p>

              <p className="hero-description">

              </p>

              <p className="hero-description">
                Sit for a minute. Say what’s on your mind.
                No names. No judgement. Just a moment to be heard.
              </p>

            </div>

            {/* ==============================================
              CHAIR
          ============================================== */}

            <div className="hero-art">

              <div className="art-circle" />

              <div className="art-circle-small" />

              <div className="art-star">
                ✦
              </div>

              <div className="chair">

                <div className="chair-back" />

                <div className="chair-arm-left" />

                <div className="chair-arm-right" />

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
                  onChange={(e) =>
                      setConsented(e.target.checked)
                  }
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
                disabled={!consented}
            >
              Take a seat
            </button>

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

          <section className="community-voices" aria-label="Messages from the community">
            <div className="voices-heading">
              <div>
                <div className="voices-kicker">A few words from the community</div>
                <h2 className="voices-title">You are not sitting alone.</h2>
              </div>
              <span className="voices-symbol" aria-hidden="true">🗨️</span>
            </div>

            <button
                type="button"
                className="message-window"
                onClick={() => setMessagesPaused((paused) => !paused)}
                aria-pressed={messagesPaused}
                aria-label={messagesPaused ? "Resume rotating messages" : "Pause rotating messages to read"}
            >
              <span className="message-quote-mark" aria-hidden="true">“</span>
              <span key={activeMessageIndex} className="participant-message">
                {participantMessages[activeMessageIndex]}
              </span>
              <span className="message-bottom-row">
                <span className="message-control">{messagesPaused ? "Paused · tap to play ▷" : "Tap to pause Ⅱ"}</span>
              </span>
              <span className="message-progress" aria-hidden="true">
                <span key={`${activeMessageIndex}-${messagesPaused}`} className={`message-progress-bar${messagesPaused ? " paused" : ""}`} />
              </span>
            </button>
            <p className="voices-note">Anonymous words shared by our community members.</p>
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

              {/* STRAIGHT */}
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
            <span className="footer-brand">FACTOR OF TEN</span>
            <span className="footer-tagline">Know more. Ask more. Check sooner.</span>

            {/* NEW: disclaimer */}
            <p className="footer-disclaimer">
              The Chair Listens offers awareness and reflection, not medical
              advice, diagnosis or crisis care. If you have symptoms or
              concerns, speak to a doctor or clinic. If you are in danger or
              distress, use the <a href="/emergency">emergency resources</a>.
            </p>
          </footer>

        </div>
      </main>
  );
}