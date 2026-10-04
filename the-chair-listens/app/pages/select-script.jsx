import { useRouter } from "next/router";
import { useRequireSession } from "@/lib/session";

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
    description: "Test what you know about prostate and mental health.",
    type: "quiz",
  },
];

export default function SelectScript({ locationName = "Pretoria" }) {
  const router = useRouter();
  const sessionReady = useRequireSession(); // redirects to / if no consent session
  const { location } = router.query;
  const displayLocation = location || locationName;

  function handleSelect(path) {
    if (path.type === "quiz") {
      router.push({
        pathname: "/quiz",
        query: { location: displayLocation },
      });
    } else {
      router.push({
        pathname: "/questions",
        query: { script: path.key, location: displayLocation },
      });
    }
  }

  if (!sessionReady) return null;

  return (
      <main style={styles.page}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-path-card {
          transition: transform 160ms ease, border-color 160ms ease, background-color 160ms ease;
        }
        .clisten-path-card:hover {
          transform: translateY(-2px);
          border-color: #B99B5B;
          background-color: rgba(185, 155, 91, 0.08);
        }
        .clisten-path-card:active {
          transform: translateY(0px) scale(0.99);
        }
      `}</style>

        <div style={styles.frame}>
          <div style={styles.locationTag}>
            <span style={styles.locationDot} aria-hidden="true" />
            Sitting in {displayLocation}
          </div>

          <h1 style={styles.headline}>Choose your path</h1>
          <p style={styles.body}>
            Pick whichever fits you best today. You can always change your mind.
          </p>

          <div style={styles.cardGrid}>
            {PATHS.map((path) => (
                <button
                    key={path.key}
                    type="button"
                    onClick={() => handleSelect(path)}
                    className="clisten-path-card"
                    style={
                      path.type === "quiz"
                          ? { ...styles.pathCard, ...styles.quizCard }
                          : styles.pathCard
                    }
                >
                  {path.type === "quiz" && (
                      <span style={styles.quizBadge}>Knowledge Check</span>
                  )}
                  <span style={styles.pathLabel}>{path.label}</span>
                  <span style={styles.pathDescription}>{path.description}</span>
                </button>
            ))}
          </div>
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
    padding: "32px 20px 56px",
    boxSizing: "border-box",
  },
  frame: {
    width: "100%",
    maxWidth: "440px",
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
    fontWeight: 500,
    marginBottom: "18px",
  },
  locationDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#B99B5B",
    display: "inline-block",
  },
  headline: {
    fontWeight: 700,
    fontSize: "26px",
    color: "#F5F6FA",
    margin: "0 0 10px 0",
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "14.5px",
    lineHeight: 1.55,
    color: "#AEB8D6",
    margin: "0 0 30px 0",
    maxWidth: "320px",
  },
  cardGrid: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  pathCard: {
    width: "100%",
    textAlign: "left",
    backgroundColor: "rgba(15, 30, 74, 0.6)",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    borderRadius: "14px",
    padding: "16px 18px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  quizCard: {
    borderStyle: "dashed",
    borderColor: "rgba(185, 155, 91, 0.45)",
  },
  quizBadge: {
    fontSize: "10.5px",
    fontWeight: 700,
    color: "#B99B5B",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "2px",
  },
  pathLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#F5F6FA",
  },
  pathDescription: {
    fontSize: "13px",
    color: "#8B95BE",
    lineHeight: 1.4,
  },
};