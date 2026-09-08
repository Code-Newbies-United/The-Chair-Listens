import { useState, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * The Chair Listens — AI Feedback & Reflection
 * Connects to Groq via /api/groq to provide personalized validation and reflection.
 */

const SCRIPT_TITLES = {
  men_mental_health: "For Men",
  ally_support: "Ally & Support System",
  fast_track_activations: "Today's Event",
};

export default function ResponsesPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const { script, answers: rawAnswers } = router.query;

  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const activeScriptKey = SCRIPT_TITLES[script] ? script : "men_mental_health";

  useEffect(() => {
    if (!router.isReady) return;

    let parsedAnswers = {};
    if (rawAnswers) {
      try {
        parsedAnswers = JSON.parse(rawAnswers);
      } catch (e) {
        console.error("Failed to parse answers query param", e);
      }
    }

    async function fetchGroqReflection() {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch("/api/groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script: activeScriptKey,
            answers: parsedAnswers,
          }),
        });

        if (!res.ok) throw new Error("API call failed");

        const data = await res.json();
        setAiResponse(data.text);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGroqReflection();
  }, [router.isReady, script, rawAnswers]);

  function handleRestart() {
    router.push("/");
  }

  return (
    <main style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-btn {
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .clisten-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
        .clisten-btn:active {
          transform: translateY(0px) scale(0.98);
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
        <div style={styles.topRow}>
          <div style={styles.scriptBadge}>{SCRIPT_TITLES[activeScriptKey]}</div>
          <div style={styles.locationTag}>
            <span style={styles.locationDot} aria-hidden="true" />
            Sitting in {locationName}
          </div>
        </div>

        <div style={styles.card}>
          <span style={styles.subhead}>A Moment of Reflection</span>
          <h1 style={styles.title}>Thank You for Sharing</h1>

          {loading && (
            <div className="pulse-loader" style={styles.loadingBox}>
              <div style={styles.spinnerDot} />
              <p style={styles.loadingText}>The Chair is reflecting on your words...</p>
            </div>
          )}

          {!loading && error && (
            <div style={styles.errorBox}>
              <p style={styles.responseText}>
                Thank you for taking a seat today. Your words matter, and taking time to acknowledge them is a courageous step.
              </p>
            </div>
          )}

          {!loading && !error && (
            <div style={styles.responseContent}>
              {aiResponse.split("\n\n").map((paragraph, idx) => (
                <p key={idx} style={styles.responseText}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="clisten-btn"
          style={styles.cta}
        >
          Return to Home
        </button>

        <p style={styles.footnote}>
          Your session was completely confidential and anonymous.
        </p>
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
    letterSpacing: "0.04em",
  },
  locationTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    color: "#D9C489",
    fontSize: "13px",
    letterSpacing: "0.01em",
    fontWeight: 500,
  },
  locationDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#B99B5B",
    display: "inline-block",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(15, 30, 74, 0.6)",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    borderRadius: "16px",
    padding: "24px 20px",
    boxSizing: "border-box",
    marginBottom: "24px",
    textAlign: "left",
  },
  subhead: {
    fontSize: "12px",
    color: "#B99B5B",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "6px",
  },
  title: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 700,
    fontSize: "22px",
    color: "#F5F6FA",
    margin: "0 0 18px 0",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 0",
    gap: "12px",
  },
  spinnerDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#B99B5B",
  },
  loadingText: {
    fontSize: "14px",
    color: "#AEB8D6",
  },
  responseContent: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  responseText: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#F5F6FA",
    margin: 0,
  },
  errorBox: {
    padding: "10px 0",
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
    cursor: "pointer",
    width: "100%",
    maxWidth: "280px",
  },
  footnote: {
    marginTop: "16px",
    fontSize: "13px",
    color: "#7E88AC",
    textAlign: "center",
  },
};