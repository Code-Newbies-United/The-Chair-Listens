
import { useState } from "react";
import { useRouter } from "next/router";

const MOOD_OPTIONS = [
  {
    id: "heavy",
    emoji: "🌧️",
    label: "Carrying a Lot",
    subtext: "Feeling weighed down or overwhelmed",
    gratitudeMessage:
        "Thank you for taking a seat anyway, let's unburden a piece of it together.",
  },
  {
    id: "processing",
    emoji: "🌫️",
    label: "Processing",
    subtext: "Trying to make sense of things",
    gratitudeMessage:
        "It takes strength to sit with uncertainty. Take your time, this space is yours to unpack at your own pace.",
  },
  {
    id: "grounded",
    emoji: "⚓",
    label: "Grounded",
    subtext: "Present and ready to reflect",
    gratitudeMessage:
        "Welcome to the chair. Your presence and clarity add real value to this reflection space.",
  },
  {
    id: "hopeful",
    emoji: "🌱",
    label: "Hopeful",
    subtext: "Looking for clarity or new perspective",
    gratitudeMessage:
        "Glad you are here with an open mind. Let's explore what's next together.",
  },
];

export default function CheckInPage() {
  const router = useRouter();

  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleMoodSelect(mood) {
    setSelectedMood(mood);
    setIsSubmitted(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("chair_mood", mood.id);
    }
  }

  function handleProceedToScripts() {
    router.push({
      pathname: "/select-script",
      query: {
        location: router.query.location,
      },
    });
  }

  return (
      <main className="checkin-page">
        <style jsx global>{`
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&family=Pinyon+Script&display=swap");

:root {
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

/* ==================================================
   PAGE
================================================== */

.checkin-page {
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
  "IBM Plex Sans",
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

.checkin-shell {
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
  display: flex;
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
   MAIN PANEL
================================================== */

.checkin-panel {
  position: relative;

  width: 100%;

  overflow: hidden;

  border-radius: 27px;

  background: var(--cream);

  color: var(--forest);

  isolation: isolate;

  box-shadow:
  0 20px 50px rgba(17, 45, 37, 0.22);
}

.checkin-panel::before {
  content: "";

  position: absolute;

  width: 330px;
  height: 330px;

  border-radius: 50%;

  background: var(--powder-blue);

  top: -190px;
  right: -145px;

  z-index: -1;
}

.checkin-panel::after {
  content: "";

  position: absolute;

  width: 280px;
  height: 280px;

  border-radius: 50%;

  background: var(--mint);

  bottom: -190px;
  left: -150px;

  z-index: -1;

  opacity: 0.8;
}

/* ==================================================
   INTRO
================================================== */

.intro {
  position: relative;

  z-index: 2;

  padding: 38px 23px 28px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
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

.headline {
  max-width: 760px;

  margin: 0;

  color: var(--forest);

  font-size: clamp(41px, 10vw, 72px);

  line-height: 0.88;

  letter-spacing: -0.06em;

  font-weight: 900;
}

.headline-accent {
  display: block;

  color: var(--mint);
}

.script-line {
  margin: 19px 0 9px;

  color: var(--ochre);

  font-family: "Pinyon Script", cursive;

  font-size: 40px;

  line-height: 1;
}

.subheadline {
  max-width: 430px;

  margin: 7px 0 0;

  color: #52645e;

  font-size: 14px;

  line-height: 1.5;
}

/* ==================================================
   MOOD AREA
================================================== */

.mood-area {
  position: relative;

  z-index: 3;

  padding: 8px 20px 32px;
}

.mood-grid {
  width: 100%;

  max-width: 850px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 14px;
}

/* ==================================================
   MOOD CARD
================================================== */

.mood-card {
  appearance: none;

  position: relative;

  width: 100%;

  min-height: 132px;

  padding: 20px;

  display: flex;
  align-items: center;

  gap: 16px;

  text-align: left;

  cursor: pointer;

  border-radius: 20px;

  border: 1px solid rgba(45, 80, 70, 0.12);

  background:
      linear-gradient(
          145deg,
      rgba(255, 255, 255, 0.82),
      rgba(255, 255, 255, 0.52)
);

  color: var(--forest);

  box-shadow:
  0 7px 0 rgba(45, 80, 70, 0.08),
      0 14px 24px rgba(45, 80, 70, 0.08);

  backdrop-filter: blur(8px);

  transition:
      transform 180ms ease,
  border-color 180ms ease,
      background 180ms ease,
  box-shadow 180ms ease;
}

.mood-card:hover {
  transform: translateY(-4px);

  border-color: var(--ochre);

  background:
      linear-gradient(
          145deg,
      rgba(255, 255, 255, 0.96),
      rgba(255, 255, 255, 0.72)
);

  box-shadow:
  0 8px 0 rgba(188, 149, 83, 0.18),
      0 18px 30px rgba(45, 80, 70, 0.14);
}

.mood-card:active {
  transform: translateY(1px) scale(0.985);

  box-shadow:
  0 2px 0 rgba(45, 80, 70, 0.08),
      0 7px 15px rgba(45, 80, 70, 0.1);
}

.mood-card:focus-visible {
  outline: 2px solid var(--ochre);

  outline-offset: 4px;
}

/* ==================================================
   EMOJI
================================================== */

.emoji-ring {
  width: 62px;
  height: 62px;

  flex: 0 0 62px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--powder-blue);

  border:
      1px solid rgba(45, 80, 70, 0.08);

  box-shadow:
  inset 0 3px 0 rgba(255, 255, 255, 0.65),
      inset 0 -4px 6px rgba(45, 80, 70, 0.08),
      0 5px 10px rgba(45, 80, 70, 0.08);
}

.emoji {
  font-size: 29px;

  line-height: 1;
}

/* ==================================================
   MOOD TEXT
================================================== */

.mood-text-wrap {
  min-width: 0;

  display: flex;
  flex-direction: column;
}

.mood-label {
  display: block;

  margin-bottom: 5px;

  color: var(--forest);

  font-size: 16px;

  font-weight: 800;

  line-height: 1.15;

  letter-spacing: -0.015em;
}

.mood-subtext {
  display: block;

  color: #52645e;

  font-size: 12px;

  line-height: 1.45;
}

/* ==================================================
   STEP INDICATOR
================================================== */

.step-strip {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 8px;

  padding: 0 20px 32px;
}

.step-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: rgba(45, 80, 70, 0.2);
}

.step-dot.active {
  width: 22px;

  border-radius: 100px;

  background: var(--ochre);
}

/* ==================================================
   THANK YOU STATE
================================================== */

.thank-you {
  position: relative;

  z-index: 3;

  padding: 45px 24px 48px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

.icon-ring {
  width: 82px;
  height: 82px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--mint);

  border:
      6px solid rgba(255, 255, 255, 0.55);

  box-shadow:
  0 12px 25px rgba(45, 80, 70, 0.14),
      inset 0 3px 5px rgba(255, 255, 255, 0.3);

  margin-bottom: 23px;
}

.thank-you-headline {
  max-width: 680px;

  margin: 0;

  color: var(--forest);

  font-size: clamp(43px, 9vw, 70px);

  line-height: 0.88;

  letter-spacing: -0.06em;

  font-weight: 900;
}

.thank-you-script {
  margin: 17px 0 10px;

  color: var(--ochre);

  font-family: "Pinyon Script", cursive;

  font-size: 40px;

  line-height: 1;
}

.thank-you-body {
  max-width: 530px;

  margin: 8px 0 26px;

  color: #52645e;

  font-size: 15px;

  line-height: 1.6;
}

.divider {
  width: 55px;

  height: 2px;

  margin-bottom: 26px;

  background: var(--ochre);

  opacity: 0.75;
}

/* ==================================================
   CTA
================================================== */

.cta {
  appearance: none;

  border: 0;

  min-width: 230px;

  padding: 15px 25px;

  border-radius: 100px;

  background: var(--mint);

  color: var(--forest-dark);

  font-family:
  "IBM Plex Sans",
  sans-serif;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
  0 7px 0 rgba(32, 63, 54, 0.12),
      0 10px 22px rgba(45, 80, 70, 0.14);

  transition:
      transform 160ms ease,
      background 160ms ease,
  box-shadow 160ms ease;
}

.cta:hover {
  transform: translateY(-3px);

  background: var(--mint-bright);

  box-shadow:
  0 9px 0 rgba(32, 63, 54, 0.12),
      0 15px 28px rgba(45, 80, 70, 0.18);
}

.cta:active {
  transform: translateY(1px) scale(0.98);

  box-shadow:
  0 3px 0 rgba(32, 63, 54, 0.12),
      0 7px 14px rgba(45, 80, 70, 0.12);
}

.cta:focus-visible {
  outline: 2px solid var(--forest);

  outline-offset: 4px;
}

/* ==================================================
   FOOTER
================================================== */

.footer {
  display: flex;

  flex-direction: column;

  gap: 7px;

  padding: 25px 4px 8px;

  color: rgba(255, 255, 255, 0.45);

  font-size: 8px;

  letter-spacing: 0.08em;

  text-transform: uppercase;

  text-align: center;
}

/* ==================================================
   SMALL PHONES
================================================== */

@media (max-width: 600px) {
.intro {
    padding-top: 34px;
  }

.headline {
    font-size:  41px;
  }

.script-line {
    font-size: 36px;
  }

.mood-grid {
    grid-template-columns: 1fr;
  }

.mood-card {
    min-height: 100px;

    padding: 16px;
  }

.emoji-ring {
    width: 54px;
    height: 54px;

    flex-basis: 54px;
  }

.emoji {
    font-size: 26px;
  }

.thank-you {
    padding-top: 35px;
  }

.thank-you-headline {
    font-size: 43px;
  }

.thank-you-script {
    font-size: 36px;
  }
}

/* ==================================================
   VERY SMALL PHONES
================================================== */

@media (max-width: 360px) {
.headline {
     font-size: 37px;
  }

 .thank-you-headline {
     font-size: 39px;
  }

.script-line,
.thank-you-script {
    font-size: 33px;
  }

.mood-card {
    gap: 12px;
  }

.mood-label {
    font-size: 15px;
  }

.mood-subtext {
    font-size: 11px;
  }
}

/* ==================================================
   TABLET / DESKTOP
================================================== */

@media (min-width: 700px) {
.checkin-page {
    padding: 18px;
  }

.intro {
    padding: 58px 40px 35px;
  }

.headline {
    font-size: clamp(58px, 8vw, 86px);
  }

.script-line {
    font-size: 52px;
  }

.subheadline {
    font-size: 15px;
  }

.mood-area {
    padding:
        10px 55px 38px;
  }

.mood-grid {
    gap: 16px;
  }

.mood-card {
    min-height: 150px;

    padding: 25px;
  }

.emoji-ring {
    width: 70px;
    height: 70px;

    flex-basis: 70px;
  }

.emoji {
    font-size: 32px;
  }

.mood-label {
    font-size: 18px;
  }

.mood-subtext {
    font-size: 13px;
  }

.thank-you {
    padding:
        65px 60px 70px;
  }

.thank-you-headline {
    font-size: clamp(60px, 7vw, 86px);
  }

.thank-you-script {
    font-size: 52px;
  }

.footer {
    flex-direction: row;

    justify-content: space-between;

    text-align: left;
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

        <div className="checkin-shell">
          {/* ==================================================
            HEADER
        ================================================== */}

          <header className="topbar">
            <div className="brand">
              <span className="brand-mark" />
              The Chair Listens
            </div>

            <div className="location-pill">
              <span className="location-pill-dot" />
              {router.query.location || "Your location"}
            </div>
          </header>

          {/* ==================================================
            CHECK-IN PANEL
        ================================================== */}

          <section className="checkin-panel">
            {!isSubmitted ? (
                <>
                  {/* INTRO */}

                  <div className="intro">
                    <div className="eyebrow">
                      <span className="eyebrow-line" />
                      Check-In
                      <span className="eyebrow-line" />
                    </div>

                    <h1 className="headline">
                      How are you arriving
                      <span className="headline-accent">
                    at the chair today?
                  </span>
                    </h1>

                    <div className="script-line">
                      No wrong answers.
                    </div>

                    <p className="subheadline">
                      There are no wrong answers. Choose the option
                      that comes closest to describing your headspace.
                    </p>
                  </div>

                  {/* MOODS */}

                  <div className="mood-area">
                    <div className="mood-grid">
                      {MOOD_OPTIONS.map((option) => (
                          <button
                              key={option.id}
                              type="button"
                              className="mood-card"
                              onClick={() => handleMoodSelect(option)}
                          >
                      <span className="emoji-ring">
                        <span className="emoji">
                          {option.emoji}
                        </span>
                      </span>

                            <span className="mood-text-wrap">
                        <span className="mood-label">
                          {option.label}
                        </span>

                        <span className="mood-subtext">
                          {option.subtext}
                        </span>
                      </span>
                          </button>
                      ))}
                    </div>
                  </div>

                  {/* PROGRESS */}

                  <div className="step-strip">
                    <span className="step-dot active" />
                    <span className="step-dot" />
                    <span className="step-dot" />
                  </div>
                </>
            ) : (
                /* ==================================================
                   THANK YOU
                ================================================== */

                <div className="thank-you">
                  <div className="icon-ring">
                <span style={{ fontSize: "36px" }}>
                  {selectedMood.emoji}
                </span>
                  </div>

                  <h1 className="thank-you-headline">
                    Thank you for
                    <span className="headline-accent">
                  checking in.
                </span>
                  </h1>

                  <div className="thank-you-script">
                    You're in the chair.
                  </div>

                  <p className="thank-you-body">
                    {selectedMood.gratitudeMessage}
                  </p>

                  <div className="divider" />

                  <button
                      type="button"
                      className="cta"
                      onClick={handleProceedToScripts}
                  >
                    Choose Reflection Journey →
                  </button>
                </div>
            )}
          </section>

          {/* ==================================================
            FOOTER
        ================================================== */}

          <footer className="footer">
          <span>
            The Chair Listens
          </span>

            <span>
            A quiet place in a noisy world.
          </span>
          </footer>
        </div>
      </main>
  );
}
