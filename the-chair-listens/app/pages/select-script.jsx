import { useRouter } from "next/router";

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

export default function SelectScript({
                                       locationName = "Pretoria",
                                     }) {
  const router = useRouter();

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
@import url("https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap");

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
   HEADING
========================================== */

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
  margin-top: 23px;

  color: rgba(45, 80, 70, 0.48);

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 0.1em;

  text-transform: uppercase;
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
`}</style>

        <div className="path-frame">

          {/* LOCATION */}

          <div className="location-tag">
          <span
              className="location-dot"
              aria-hidden="true"
          />

            Sitting in {displayLocation}
          </div>

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

          <div className="path-footer">
            The Chair Listens · A quiet place in a noisy world.
          </div>

        </div>
      </main>
  );
}