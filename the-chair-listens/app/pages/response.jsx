import { useRouter } from "next/router";

/**
 * The Chair Listens — Final Completion & Summary Page
 */

export default function ResponsesPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const { script } = router.query;

  const SCRIPT_LABELS = {
    men_mental_health: "For Men",
    ally_support: "Ally & Support System",
    fast_track_activations: "Today's Event",
  };

  const topicLabel = SCRIPT_LABELS[script] || "Community Reflection";

  function handleReturnHome() {
    router.push("/");
  }

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
        .clisten-btn-home:active {
          transform: translateY(0px) scale(0.98);
        }
      `}</style>

      <div style={styles.frame}>
        {/* Top Header */}
        <div style={styles.topRow}>
          <div style={styles.scriptBadge}>{topicLabel}</div>
          <div style={styles.locationTag}>
            <span style={styles.locationDot} aria-hidden="true" />
            Sitting in {locationName}
          </div>
        </div>

        {/* Completion Card */}
        <div style={styles.card}>
          <div style={styles.iconCircle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B99B5B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <span style={styles.subhead}>Session Complete</span>
          <h1 style={styles.title}>Thank You for Taking a Seat</h1>

          <p style={styles.bodyText}>
            Speaking your thoughts out loud or putting them into words takes quiet courage. Every story shared helps break the silence and build stronger, more understanding communities.
          </p>

          <div style={styles.divider} />

          <p style={styles.reminderText}>
            Take this reflection with you today. Remember that carrying heavy things becomes easier when we allow ourselves space to pause and be heard.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleReturnHome}
          className="clisten-btn-home"
          style={styles.cta}
        >
          Return to Start
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
    padding: "32px 24px",
    boxSizing: "border-box",
    marginBottom: "24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "rgba(185, 155, 91, 0.12)",
    border: "1px solid rgba(185, 155, 91, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
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
    fontWeight: 700,
    fontSize: "22px",
    color: "#F5F6FA",
    margin: "0 0 16px 0",
    lineHeight: 1.3,
  },
  bodyText: {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#AEB8D6",
    margin: 0,
  },
  divider: {
    width: "60px",
    height: "1px",
    backgroundColor: "rgba(174, 184, 214, 0.25)",
    margin: "20px 0",
  },
  reminderText: {
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#D9C489",
    fontStyle: "italic",
    margin: 0,
  },
  cta: {
    appearance: "none",
    border: "none",
    background: "#B99B5B",
    color: "#0A1735",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: "16px",
    padding: "15px 48px",
    borderRadius: "999px",
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