import { useState } from "react";
import { useRouter } from "next/router";

/**
 * The Chair Listens — Script / Persona Selection
 *
 * Prompts the participant to select their pathway:
 * 1. Man (Men's Mental Health)
 * 2. Ally / Support (Mother, Sister, Partner, Wife, Friend)
 * 3. Specific Activation Days (Fast-tracked questions)
 * 4. Prostate Cancer Knowledge Check (Interactive Quiz)
 */

const PATHWAYS = [
  {
    id: "men_mental_health",
    tag: "For Men",
    title: "I'm Here for Me",
    description:
      "This is your seat. A few honest questions about how you're really doing, mentally, physically, and everything in between. No judgment, no names attached.",
    isQuiz: false,
  },
  {
    id: "ally_support",
    tag: "Ally & Support System",
    title: "I'm Here for Someone I Love",
    description:
      "Maybe it's your son, your partner, your brother, your dad. You're not the one carrying it, but you carry it with him. Tell us what you've noticed, what you wish he knew, or what you want him to hear.",
    isQuiz: false,
  },
  {
    id: "fast_track_activations",
    tag: "Today",
    title: "I'm Here for Today's Event",
    description: "Answer a quick set of questions made just for today.",
    isQuiz: false,
  },
  {
    id: "prostate_quiz",
    tag: "Awareness Check",
    title: "Prostate Cancer Knowledge Check",
    description:
      "A short 3-question myth vs. fact check to test your awareness on prostate health, risks, and screening.",
    isQuiz: true,
    path: "/quiz",
  },
];

export default function SelectScript({ locationName = "Pretoria" }) {
  const router = useRouter();
  const [selectedScript, setSelectedScript] = useState(null);

  function handleBack() {
    router.push("/check-in");
  }

  function handleContinue() {
    if (!selectedScript) return;

    const chosenPathway = PATHWAYS.find((p) => p.id === selectedScript);

    if (chosenPathway?.isQuiz) {
      router.push(chosenPathway.path);
    } else {
      router.push({
        pathname: "/questions",
        query: { script: selectedScript },
      });
    }
  }

  return (
    <main style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-card {
          transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
        }
        .clisten-card:hover {
          transform: translateY(-2px);
        }
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
        .clisten-back-btn {
          transition: color 160ms ease;
        }
        .clisten-back-btn:hover {
          color: #F5F6FA !important;
        }
      `}</style>

      <div style={styles.frame}>
        <div style={styles.topRow}>
          <button
            type="button"
            onClick={handleBack}
            className="clisten-back-btn"
            style={styles.backButton}
          >
            &larr; Back
          </button>
          <div style={styles.locationTag}>
            <span style={styles.locationDot} aria-hidden="true" />
            Sitting in {locationName}
          </div>
        </div>

        <div style={styles.textBlock}>
          <h1 style={styles.headline}>Settle in and pick your lens</h1>
          <p style={styles.body}>
            Select how you'd like to participate in today's listening session or take a short knowledge check.
          </p>
        </div>

        <div
          style={styles.cardsContainer}
          role="radiogroup"
          aria-label="Select participant pathway"
        >
          {PATHWAYS.map((pathway) => {
            const isSelected = selectedScript === pathway.id;
            return (
              <div
                key={pathway.id}
                tabIndex={0}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedScript(pathway.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedScript(pathway.id);
                  }
                }}
                className="clisten-card"
                style={{
                  ...styles.card,
                  borderColor: isSelected ? "#B99B5B" : "rgba(174, 184, 214, 0.2)",
                  backgroundColor: isSelected ? "rgba(185, 155, 91, 0.12)" : "rgba(15, 30, 74, 0.6)",
                }}
              >
                <div style={styles.badge}>{pathway.tag}</div>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>{pathway.title}</span>
                  <div
                    style={{
                      ...styles.radioCircle,
                      borderColor: isSelected ? "#B99B5B" : "#7E88AC",
                      backgroundColor: isSelected ? "#B99B5B" : "transparent",
                    }}
                  >
                    {isSelected && <div style={styles.radioInnerDot} />}
                  </div>
                </div>
                <p style={styles.cardDescription}>{pathway.description}</p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="clisten-continue"
          onClick={handleContinue}
          disabled={!selectedScript}
          aria-disabled={!selectedScript}
          style={{
            ...styles.cta,
            opacity: selectedScript ? 1 : 0.45,
            cursor: selectedScript ? "pointer" : "not-allowed",
          }}
        >
          {PATHWAYS.find((p) => p.id === selectedScript)?.isQuiz
            ? "Start Quiz"
            : "Continue"}
        </button>

        <p style={styles.footnote}>
          Your answers remain completely anonymous regardless of your choice.
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
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  topRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#AEB8D6",
    fontSize: "14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    cursor: "pointer",
    padding: 0,
    fontWeight: 500,
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
  textBlock: {
    marginBottom: "24px",
  },
  headline: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 700,
    fontSize: "28px",
    lineHeight: 1.2,
    color: "#F5F6FA",
    margin: "0 0 8px 0",
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "15px",
    lineHeight: 1.5,
    color: "#AEB8D6",
    margin: 0,
  },
  cardsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "28px",
  },
  card: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1.5px solid",
    boxSizing: "border-box",
    textAlign: "left",
    cursor: "pointer",
    outline: "none",
  },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#D9C489",
    marginBottom: "6px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  cardTitle: {
    color: "#F5F6FA",
    fontSize: "16px",
    fontWeight: 600,
  },
  radioCircle: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioInnerDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#0A1735",
  },
  cardDescription: {
    color: "#AEB8D6",
    fontSize: "13px",
    lineHeight: 1.45,
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
    padding: "15px 56px",
    borderRadius: "999px",
    letterSpacing: "0.01em",
    width: "100%",
    maxWidth: "280px",
  },
  footnote: {
    marginTop: "16px",
    fontSize: "13px",
    color: "#7E88AC",
  },
};