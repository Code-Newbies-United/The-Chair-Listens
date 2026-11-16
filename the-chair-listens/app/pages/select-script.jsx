import { useRouter } from "next/router";
import { useState, useEffect } from "react";

/**
 * The Chair Listens — Select Your Path
 * Lets the visitor choose which reflection track to take, or the quiz.
 * Location carries through via the `location` query param, same pattern
 * as the rest of the flow.
 */

const PATHS = [
  {
    key: "men_mental_health",
    label: "For Men",
    description: "A few quiet questions, just for you.",
    type: "reflection",
  },
  {
    key: "ally_support",
    label: "Ally & Support",
    description: "For anyone supporting a man in their life.",
    type: "reflection",
  },
  {
    key: "fast_track_activations",
    label: "Today's Event",
    description: "Quick reflections made for this activation.",
    type: "reflection",
  },
  {
    key: "quiz",
    label: "Knowledge Check",
    description:
        "Test what you know about prostate and mental health.",
    type: "quiz",
  },
];
const PROSTATE_FACTS = [
  "Prostate cancer can develop without noticeable symptoms in its early stages.",

  "The risk of prostate cancer increases as men get older.",

  "Having a father or brother who had prostate cancer can increase your risk.",

  "A PSA blood test can help assess prostate health. A raised PSA does not automatically mean cancer.",

  "Knowing your family history can help you have more informed conversations with your healthcare professional.",

  "You do not have to wait for symptoms to start a conversation about prostate health.",
];
export default function SelectScript({
                                       locationName = "Pretoria",
                                     }) {
  const router = useRouter();
  const [showChairThought, setShowChairThought] = useState(true);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    let hideTimer;
    let showTimer;

    function startCycle() {
      // Show the thought for 10 seconds
      hideTimer = setTimeout(() => {
        setShowChairThought(false);

        // Keep it hidden for 15 seconds
        showTimer = setTimeout(() => {
          setFactIndex((current) =>
              (current + 1) % PROSTATE_FACTS.length
          );

          setShowChairThought(true);
          startCycle();
        }, 15000);
      }, 10000);
    }

    startCycle();

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, []);

  const { location } = router.query;

  const displayLocation =
      location || locationName;

  function handleSelect(path) {
    if (path.type === "quiz") {
      router.push({
        pathname: "/quiz",
        query: {
          location: displayLocation,
        },
      });
    } else {
      router.push({
        pathname: "/questions",
        query: {
          script: path.key,
          location: displayLocation,
        },
      });
    }
  }

  return (
      <main className="path-page">

        <style jsx global>{`
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&family=Pinyon+Script&display=swap");

:root {
  /* ==========================================
     THE CHAIR LISTENS PALETTE
  ========================================== */

  --forest: #2d5046;
  --forest-dark: #203f36;
  --forest-deep: #19362f;

  --mint: #8dcf94;
  --mint-bright: #a5dfa9;

  --powder-blue: #d4e9ed;
  --powder-blue-dark: #b8dbe0;

  --cream: #f5f2e8;
  --white: #fbfaf5;

  --ochre: #bc9553;
  --ochre-light: #d1b071;

  --sage: #526b61;

  --text-muted: #52645e;
  --text-light: #dce9df;
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

button {
  font: inherit;
}

/* ==========================================
   PAGE
========================================== */

.path-page {
  min-height: 100dvh;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding:
      max(28px, env(safe-area-inset-top))
      max(18px, env(safe-area-inset-right))
      max(40px, env(safe-area-inset-bottom))
      max(18px, env(safe-area-inset-left));

  background:
      radial-gradient(
          circle at 100% 0%,
          rgba(141, 207, 148, 0.2),
          transparent 30%
      ),
      radial-gradient(
          circle at 0% 90%,
          rgba(212, 233, 237, 0.1),
          transparent 28%
      ),
      var(--forest);

  color: var(--white);

  font-family:
      "IBM Plex Sans",
      "Benton Sans",
      "Helvetica Neue",
      Arial,
      sans-serif;
}

/* ==========================================
   FRAME
========================================== */

.path-frame {
  position: relative;

  width: 100%;
  max-width: 620px;

  padding: 35px 20px 30px;

  text-align: center;

  overflow: hidden;

  border-radius: 27px;

  background: var(--cream);

  color: var(--forest);

  isolation: isolate;

  box-shadow:
      0 24px 60px rgba(17, 45, 37, 0.25);
}

.path-frame::before {
  content: "";

  position: absolute;

  width: 260px;
  height: 260px;

  border-radius: 50%;

  background: var(--powder-blue);

  top: -155px;
  right: -110px;

  z-index: -1;
}

.path-frame::after {
  content: "";

  position: absolute;

  width: 210px;
  height: 210px;

  border-radius: 50%;

  background: var(--mint);

  bottom: -150px;
  left: -110px;

  z-index: -1;
}

/* ==========================================
   LOCATION
========================================== */

.location-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-bottom: 17px;

  color: var(--sage);

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.15em;

  text-transform: uppercase;
}

.location-dot {
  width: 7px;
  height: 7px;

  flex: 0 0 auto;

  border-radius: 50%;

  background: var(--mint);

  box-shadow:
      0 0 0 4px rgba(141, 207, 148, 0.16),
      0 0 15px rgba(141, 207, 148, 0.22);
}

/* ==========================================
   LOGO & HEADING
========================================== */

.path-brand-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(45, 80, 70, 0.15);
  box-shadow: 0 6px 18px rgba(17, 45, 37, 0.08);
}

.headline {
  margin: 0;

  color: var(--forest);

  font-size: clamp(42px, 11vw, 64px);

  line-height: 0.9;

  letter-spacing: -0.06em;

  font-weight: 900;
}

.headline-script {
  margin-top: 12px;

  color: var(--ochre);

  font-family:
      "Pinyon Script",
      cursive;

  font-size: 38px;

  line-height: 1;
}

.body {
  max-width: 360px;

  margin:
      14px auto 30px;

  color: var(--text-muted);

  font-size: 14px;

  line-height: 1.55;
}

/* ==========================================
   PATH CARDS
========================================== */

.card-grid {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 11px;
}

.path-card {
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 5px;

  padding: 19px 20px;

  text-align: left;

  border: 1.5px solid rgba(82, 107, 97, 0.2);

  border-radius: 18px;

  background: rgba(255, 255, 255, 0.62);

  color: var(--forest);

  cursor: pointer;

  box-shadow:
      0 5px 14px rgba(45, 80, 70, 0.06);

  transition:
      transform 160ms ease,
      border-color 160ms ease,
      background 160ms ease,
      box-shadow 160ms ease;
}

.path-card:hover {
  transform: translateY(-2px);

  border-color: var(--mint);

  background: rgba(141, 207, 148, 0.14);

  box-shadow:
      0 10px 22px rgba(45, 80, 70, 0.1);
}

.path-card:active {
  transform: translateY(0) scale(0.99);
}

.path-card:focus-visible {
  outline: 2px solid var(--ochre);

  outline-offset: 3px;
}

/* ==========================================
   CARD NUMBER / ACCENT
========================================== */

.path-number {
  display: block;

  margin-bottom: 4px;

  color: var(--ochre);

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 0.14em;

  text-transform: uppercase;
}

.path-label {
  display: block;

  color: var(--forest);

  font-size: 17px;

  line-height: 1.2;

  font-weight: 800;

  letter-spacing: -0.02em;
}

.path-description {
  display: block;

  color: var(--text-muted);

  font-size: 12.5px;

  line-height: 1.45;
}

/* ==========================================
   QUIZ CARD
========================================== */

.quiz-card {
  border: 1.5px dashed rgba(188, 149, 83, 0.7);

  background:
      linear-gradient(
          135deg,
          rgba(212, 233, 237, 0.72),
          rgba(255, 255, 255, 0.68)
      );
}

.quiz-card:hover {
  border-color: var(--ochre);

  background:
      linear-gradient(
          135deg,
          rgba(212, 233, 237, 0.9),
          rgba(141, 207, 148, 0.16)
      );
}

.quiz-badge {
  display: inline-flex;

  align-self: flex-start;

  margin-bottom: 3px;

  padding: 5px 8px;

  border-radius: 100px;

  background: var(--ochre);

  color: var(--cream);

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

/* ==========================================
   FOOTER
========================================== */

.path-footer {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(45, 80, 70, 0.12);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  text-align: center;
}

.path-footer-brand {
  color: var(--forest-dark);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.path-footer-tagline {
  color: var(--sage);
  font-size: 11px;
}

/* ==========================================
   SMALL PHONES
========================================== */

@media (max-width: 360px) {
  .path-page {
    padding-left: 12px;
    padding-right: 12px;
  }

  .path-frame {
    padding:
        28px 15px 24px;

    border-radius: 23px;
  }

  .path-brand-logo {
    width: 52px;
    height: 52px;
    margin-bottom: 12px;
  }

  .headline {
    font-size: 40px;
  }

  .headline-script {
    font-size: 34px;
  }

  .path-card {
    padding: 17px;
  }
}

/* ==========================================
   TABLET / DESKTOP
========================================== */

@media (min-width: 700px) {
  .path-page {
    padding: 40px 20px;
  }

  .path-frame {
    max-width: 650px;

    padding:
        50px 45px 38px;
  }

  .path-brand-logo {
    width: 72px;
    height: 72px;
    margin-bottom: 18px;
  }

  .headline {
    font-size: 66px;
  }

  .headline-script {
    font-size: 46px;
  }

  .body {
    font-size: 15px;

    margin-bottom: 34px;
  }

  .path-card {
    padding: 21px 23px;

    border-radius: 20px;
  }

  .path-label {
    font-size: 18px;
  }

  .path-description {
    font-size: 13px;
  }
}

/* ==========================================
   REDUCE MOTION
========================================== */

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
/* ==========================================
   BLUE CHAIR THOUGHT BUBBLE
========================================== */

.chair-thought-container {
  position: fixed;
  right: 20px;
  bottom: 18px;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;

  pointer-events: none;
}

/* Thought bubble */

.chair-thought-bubble {
  position: relative;
  width: min(250px, calc(100vw - 85px));
  padding: 12px 15px;
  border-radius: 14px 14px 4px 14px;

  background: #E7F1F7;
  color: #245B83;

  border: 1px solid #D3E0E8;
  box-shadow: 0 5px 16px rgba(36, 91, 131, 0.12);

  font-family: Arial, Helvetica, sans-serif;
  animation: chair-thought-appear 350ms ease-out;
}

/* Small heading */

.thought-label {
  display: block;
  margin-bottom: 6px;

  color: #2877B8;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.chair-thought-bubble p {
  margin: 0;

  color: #477B9A;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  line-height: 1.6;
  font-weight: 400;
}

/* Fact text */

.chair-thought-bubble p {
  margin: 0;

  font-size: 11px;
  line-height: 1.45;
  font-weight: 500;

  color: var(--forest-dark);
}

/* Thought dots connecting bubble to chair */

.thought-dot {
  position: absolute;
  display: block;
  border-radius: 50%;

  background: #E7F1F7;
  border: 1px solid #D3E0E8;
}

.thought-dot-one {
  width: 9px;
  height: 9px;

  right: 17px;
  bottom: -11px;
}

.thought-dot-two {
  width: 5px;
  height: 5px;

  right: 9px;
  bottom: -19px;
}

/* Blue chair avatar */

.thought-chair-avatar {
  position: relative;

  width: 43px;
  height: 48px;

  margin-right: 4px;
  pointer-events: auto;
}

/* Chair back */

.thought-chair-back {
  position: absolute;

  width: 31px;
  height: 29px;

  left: 6px;
  top: 0;

  border-radius: 11px 11px 5px 5px;

  background: #315da8;

  border: 2px solid #24498c;

  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  gap: 5px;
}

/* Chair tufting */

.thought-chair-tuft {
  width: 4px;
  height: 4px;

  border-radius: 50%;

  background: #8eabe0;
}

/* Chair seat */

.thought-chair-seat {
  position: absolute;

  width: 39px;
  height: 10px;

  left: 2px;
  top: 27px;

  border-radius: 5px;

  background: #4775c5;

  border: 1px solid #24498c;
}

/* Chair legs */

.thought-chair-leg {
  position: absolute;

  width: 4px;
  height: 12px;

  top: 35px;

  border-radius: 2px;

  background: #24498c;
}

.thought-chair-leg.left {
  left: 9px;
}

.thought-chair-leg.right {
  right: 9px;
}

/* Bubble animation */

@keyframes chair-thought-appear {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile sizing */

@media (max-width: 480px) {
  .chair-thought-container {
    right: 12px;
    bottom: 12px;
  }

  .chair-thought-bubble {
    width: min(205px, calc(100vw - 75px));
    padding: 9px 11px;
  }

  .chair-thought-bubble p {
    font-size: 10px;
  }

  .thought-chair-avatar {
    transform: scale(0.4);
    transform-origin: bottom right;
  }
}
`}</style>

        <div className="path-frame">

          {/* LOCATION */}

          <div className="location-tag">
          <span
              className="location-dot"
              aria-hidden="true"
          />

            {displayLocation}
          </div>

          {/* LOGO */}

          <img
              className="path-brand-logo"
              src="/logos/factor-of-ten-logo-1.jpg"
              alt="Factor of Ten Foundation logo"
          />

          {/* HEADING */}

          <h1 className="headline">
            Choose your path
          </h1>

          <div className="headline-script">
            Take your time.
          </div>

          <p className="body">
            Pick whichever fits you best today.
            You can always change your mind.
          </p>

          {/* PATHS */}

          <div className="card-grid">

            {PATHS.map((path, index) => (
                <button
                    key={path.key}
                    type="button"
                    onClick={() => handleSelect(path)}
                    className={`path-card ${
                        path.type === "quiz"
                            ? "quiz-card"
                            : ""
                    }`}
                >

                  {path.type === "quiz" ? (
                      <span className="quiz-badge">
                  Knowledge Check
                </span>
                  ) : (
                      <span className="path-number">
                  0{index + 1} / REFLECT
                </span>
                  )}

                  <span className="path-label">
                {path.label}
              </span>

                  <span className="path-description">
                {path.description}
              </span>

                </button>
            ))}

          </div>

          {/* FOOTER */}

          <footer className="path-footer">
            <span className="path-footer-brand">FACTOR OF TEN</span>
            <span className="path-footer-tagline">Know more. Ask more. Check sooner.</span>
          </footer>

        </div>
        {/* CHAIR THOUGHT BUBBLE */}

        <div className="chair-thought-container">

          {showChairThought && (
              <div
                  className="chair-thought-bubble"
                  role="status"
                  aria-live="polite"
              >
      <span className="thought-label">
        A THOUGHT FROM THE CHAIR
      </span>

                <p>{PROSTATE_FACTS[factIndex]}</p>

                {/* Small thought dots */}
                <span className="thought-dot thought-dot-one" />
                <span className="thought-dot thought-dot-two" />
              </div>
          )}

          {/* BLUE CHAIR AVATAR */}
          <div
              className="thought-chair-avatar"
              role="img"
              aria-label="The blue chair"
          >
            <div className="thought-chair-back">
              <span className="thought-chair-tuft" />
              <span className="thought-chair-tuft" />
              <span className="thought-chair-tuft" />
            </div>

            <div className="thought-chair-seat" />

            <div className="thought-chair-leg left" />
            <div className="thought-chair-leg right" />
          </div>

        </div>
      </main>
  );
}