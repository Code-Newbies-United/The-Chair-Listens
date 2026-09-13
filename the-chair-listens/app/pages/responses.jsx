import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResponsesPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const { script, data } = router.query;

  // Prefer the location passed through from earlier pages, fall back to the prop
  const displayLocation = router.query.location || locationName;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const SCRIPT_LABELS = {
    men_mental_health: "Men's Mental Health",
    ally_support: "Ally & Support System",
    fast_track_activations: "Community Event",
  };

  const topicLabel = SCRIPT_LABELS[script] || "Community Reflection";

  useEffect(() => {
    if (!router.isReady) return;

    async function fetchSessionSummary() {
      let parsedAnswers = [];
      if (data) {
        try {
          parsedAnswers = JSON.parse(decodeURIComponent(data));
        } catch (e) {
          console.error("Failed to parse answers", e);
        }
      }

      try {
        const res = await fetch("/api/session-reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script: script || "men_mental_health",
            answers: parsedAnswers,
          }),
        });

        const result = await res.json();
        setSummary(result);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setSummary({
          overallReflection:
            "Thank you for taking the time to share your perspective today.",
          takeaways: [
            "Acknowledging your journey is an important step forward.",
            "Your voice contributes meaningfully to our collective healing.",
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSessionSummary();
  }, [router.isReady, script, data]);

  return (
    <main style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-btn-home {
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .clisten-btn-home:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
        .pulse-loader {
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      <div style={styles.frame}>
        {/* Top Header Row */}
        <div style={styles.topRow}>
          <div style={styles.scriptBadge}>{topicLabel}</div>
          <div style={styles.locationTag}>
            <span style={styles.locationDot} />
            Sitting in {displayLocation}
          </div>
        </div>

        {/* Main Card */}
        <div style={styles.card}>
          <span style={styles.subhead}>Session Complete</span>
          <h1 style={styles.title}>Your Reflection</h1>

          {loading ? (
            <div className="pulse-loader" style={styles.loadingBox}>
              <div style={styles.chairIcon}>🪑</div>
              <p style={styles.loadingText}>
                The Chair is bringing your reflection together...
              </p>
            </div>
          ) : (
            <>
              {/* Overall Reflection Section */}
              <div style={styles.reflectionSection}>
                <span style={styles.sectionHeader}>Summary</span>
                <p style={styles.bodyText}>{summary?.overallReflection}</p>
              </div>

              <div style={styles.divider} />

              {/* Key Takeaways Section */}
              <div style={styles.takeawaysSection}>
                <span style={styles.sectionHeader}>Key Takeaways</span>
                <ul style={styles.takeawayList}>
                  {summary?.takeaways?.map((item, index) => (
                    <li key={index} style={styles.takeawayItem}>
                      <span style={styles.bulletDot}>✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="clisten-btn-home"
          style={styles.cta}
        >
          Return to Start
        </button>
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
    maxWidth: "440px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  topRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  scriptBadge: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#D9C489",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  locationTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    color: "#D9C489",
    fontSize: "13px",
  },
  locationDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#B99B5B",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(15, 30, 74, 0.6)",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    borderRadius: "16px",
    padding: "28px 24px",
    boxSizing: "border-box",
    marginBottom: "24px",
    backdropFilter: "blur(12px)",
  },
  subhead: {
    fontSize: "11px",
    color: "#B99B5B",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: "6px",
  },
  title: {
    fontWeight: 700,
    fontSize: "22px",
    color: "#F5F6FA",
    margin: "0 0 20px 0",
  },
  reflectionSection: {
    marginBottom: "16px",
  },
  sectionHeader: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#D9C489",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "8px",
  },
  bodyText: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#AEB8D6",
    margin: 0,
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "rgba(174, 184, 214, 0.15)",
    margin: "20px 0",
  },
  takeawaysSection: {
    textAlign: "left",
  },
  takeawayList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  takeawayItem: {
    display: "flex",
    gap: "10px",
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#F5F6FA",
    alignItems: "flex-start",
  },
  bulletDot: {
    color: "#B99B5B",
    fontSize: "12px",
    marginTop: "2px",
  },
  loadingBox: {
    padding: "32px 0",
    textAlign: "center",
  },
  chairIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  loadingText: {
    fontSize: "14px",
    color: "#AEB8D6",
    margin: 0,
  },
  cta: {
    appearance: "none",
    border: "none",
    background: "#B99B5B",
    color: "#0A1735",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    padding: "14px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    width: "100%",
  },
};