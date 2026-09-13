import { useState } from "react";
import { useRouter } from "next/router";

const MOOD_OPTIONS = [
  {
    id: "heavy",
    emoji: "🌧️",
    label: "Carrying a Lot",
    subtext: "Feeling weighed down or overwhelmed",
    gratitudeMessage: "Thank you for taking a seat anyway. You don't have to carry it all right now,let's unburden a piece of it together.",
  },
  {
    id: "processing",
    emoji: "🌫️",
    label: "Processing",
    subtext: "Trying to make sense of things",
    gratitudeMessage: "It takes strength to sit with uncertainty. Take your time, this space is yours to unpack at your own pace.",
  },
  {
    id: "grounded",
    emoji: "⚓",
    label: "Grounded",
    subtext: "Present and ready to reflect",
    gratitudeMessage: "Welcome to the chair. Your presence and clarity add real value to this reflection space.",
  },
  {
    id: "hopeful",
    emoji: "🌱",
    label: "Hopeful",
    subtext: "Looking for clarity or new perspective",
    gratitudeMessage: "Glad you are here with an open mind. Let's explore what's next together.",
  },
];

export default function CheckInPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleMoodSelect(mood) {
    setSelectedMood(mood);
    setIsSubmitted(true);
    
    // Store non-identifying mood state locally for the session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("chair_mood", mood.id);
    }
  }

  function handleProceedToScripts() {
    router.push({
      pathname: "/select-script",
      query: { location: router.query.location },
    });
  }

  return (
    <main style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-mood-btn {
          transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
        }
        .clisten-mood-btn:hover {
          transform: translateY(-2px);
          border-color: #B99B5B !important;
          background-color: rgba(185, 155, 91, 0.12) !important;
        }
        .clisten-mood-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .clisten-action-btn {
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .clisten-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
      `}</style>

      <div style={styles.frame}>
        {!isSubmitted ? (
          /* Step 1: Asking how the user feels */
          <div style={styles.contentBlock}>
            <span style={styles.stepBadge}>Step 1 of 2 • Check-In</span>
            <h1 style={styles.headline}>How are you arriving at the chair today?</h1>
            <p style={styles.subheadline}>
              There are no wrong answers. Choose the option that closest describes your headspace.
            </p>

            <div style={styles.grid}>
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="clisten-mood-btn"
                  onClick={() => handleMoodSelect(option)}
                  style={styles.moodCard}
                >
                  <span style={styles.emoji}>{option.emoji}</span>
                  <div style={styles.moodTextWrap}>
                    <span style={styles.moodLabel}>{option.label}</span>
                    <span style={styles.moodSubtext}>{option.subtext}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Step 2: Warm Thank You & Reflection Message */
          <div style={styles.thankYouBlock}>
            <div style={styles.iconRing}>
              <span style={{ fontSize: "36px" }}>{selectedMood.emoji}</span>
            </div>

            <h1 style={styles.headline}>Thank you for checking in.</h1>

            <p style={styles.thankYouBody}>
              {selectedMood.gratitudeMessage}
            </p>

            <div style={styles.divider} />

            <button
              type="button"
              className="clisten-action-btn"
              onClick={handleProceedToScripts}
              style={styles.cta}
            >
              Choose Reflection Journey
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(120% 60% at 50% 0%, #14265C 0%, #0F1E4A 40%, #0A1735 75%, #081128 100%)",
    fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "32px 20px",
    boxSizing: "border-box",
  },
  frame: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  contentBlock: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stepBadge: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#B99B5B",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "8px",
  },
  headline: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#F5F6FA",
    margin: "0 0 10px 0",
    lineHeight: 1.25,
  },
  subheadline: {
    fontSize: "14px",
    color: "#AEB8D6",
    margin: "0 0 24px 0",
    lineHeight: 1.5,
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
  moodCard: {
    appearance: "none",
    backgroundColor: "rgba(15, 30, 74, 0.65)",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    borderRadius: "14px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    textAlign: "left",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },
  emoji: {
    fontSize: "28px",
    flexShrink: 0,
  },
  moodTextWrap: {
    display: "flex",
    flexDirection: "column",
  },
  moodLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#F5F6FA",
    marginBottom: "2px",
  },
  moodSubtext: {
    fontSize: "13px",
    color: "#AEB8D6",
  },
  thankYouBlock: {
    width: "100%",
    backgroundColor: "rgba(15, 30, 74, 0.6)",
    border: "1.5px solid rgba(185, 155, 91, 0.3)",
    borderRadius: "20px",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backdropFilter: "blur(12px)",
  },
  iconRing: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "rgba(185, 155, 91, 0.15)",
    border: "1px solid #B99B5B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  thankYouBody: {
    fontSize: "15px",
    color: "#AEB8D6",
    lineHeight: 1.6,
    margin: "8px 0 24px 0",
  },
  divider: {
    width: "60px",
    height: "1px",
    backgroundColor: "rgba(174, 184, 214, 0.2)",
    marginBottom: "24px",
  },
  cta: {
    width: "100%",
    appearance: "none",
    border: "none",
    background: "#B99B5B",
    color: "#0A1735",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 700,
    fontSize: "16px",
    padding: "15px 0",
    borderRadius: "10px",
    cursor: "pointer",
  },
};