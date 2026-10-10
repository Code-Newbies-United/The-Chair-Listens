import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRequireSession } from "@/lib/session";

/**
 * The Chair Listens — Prostate & Mental Health Knowledge Check Quiz
 * Now fetches questions from /api/quiz-questions instead of a hardcoded array.
 */

export default function QuizPage() {
  const router = useRouter();
  const sessionReady = useRequireSession(); // redirects to / if no consent session

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      setQuestionsLoading(true);
      try {
        const res = await fetch("/api/quiz-questions", { cache: "no-store" });
        const result = await res.json();
        setQuestions(result.questions || []);
      } catch (err) {
        console.error("Failed to fetch quiz questions:", err);
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  function handleBack() {
    router.push("/select-script");
  }

  function handleSelectOption(option) {
    if (showExplanation) return;
    setSelectedOption(option);
    setShowExplanation(true);
    if (option.is_correct) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }

  if (!sessionReady) return null;

  if (questionsLoading) {
    return (
        <main style={styles.page}>
          <p style={{ color: "#AEB8D6" }}>Loading quiz...</p>
        </main>
    );
  }

  if (questions.length === 0) {
    return (
        <main style={styles.page}>
          <div style={styles.frame}>
            <p style={{ color: "#AEB8D6", textAlign: "center" }}>
              The quiz isn't set up yet. Please check back soon.
            </p>
            <button
                type="button"
                onClick={handleBack}
                style={{ ...styles.backButton, marginTop: "16px" }}
            >
              « Back
            </button>
          </div>
        </main>
    );
  }

  const currentQ = questions[currentIndex];

  return (
      <main style={styles.page}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-option-btn {
          transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
        }
        .clisten-option-btn:not(:disabled):hover {
          transform: translateY(-1px);
          border-color: #B99B5B !important;
        }
        .clisten-cta-btn {
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .clisten-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
        .clisten-cta-btn:active {
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
              « Exit Quiz
            </button>
            <div style={styles.locationTag}>
              <span style={styles.locationDot} aria-hidden="true" />
              The chair's location is managed by the campaign team
            </div>
          </div>

          {!isFinished ? (
              <div style={styles.card}>
            <span style={styles.badge}>
              Question {currentIndex + 1} of {questions.length}
            </span>

                <h2 style={styles.questionText}>{currentQ.question_text}</h2>

                <div style={styles.optionsGrid}>
                  {(currentQ.options || []).map((option, idx) => {
                    let btnBorderColor = "rgba(174, 184, 214, 0.2)";
                    let btnBgColor = "rgba(15, 30, 74, 0.6)";

                    if (showExplanation) {
                      if (option.is_correct) {
                        btnBorderColor = "#4E9F3D";
                        btnBgColor = "rgba(78, 159, 61, 0.2)";
                      } else if (option === selectedOption) {
                        btnBorderColor = "#D9534F";
                        btnBgColor = "rgba(217, 83, 79, 0.2)";
                      }
                    }

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(option)}
                            disabled={showExplanation}
                            className="clisten-option-btn"
                            style={{
                              ...styles.optionBtn,
                              borderColor: btnBorderColor,
                              backgroundColor: btnBgColor,
                            }}
                        >
                          <span>{option.text}</span>
                        </button>
                    );
                  })}
                </div>

                {showExplanation && (
                    <div style={styles.explanationBox}>
                      <p style={styles.explanationText}>{currentQ.explanation}</p>
                      <button
                          type="button"
                          onClick={handleNext}
                          className="clisten-cta-btn"
                          style={styles.cta}
                      >
                        {currentIndex + 1 === questions.length
                            ? "See Results"
                            : "Next Question"}
                      </button>
                    </div>
                )}
              </div>
          ) : (
              <div style={styles.card}>
                <span style={styles.badge}>Knowledge Check Complete</span>
                <h2 style={styles.questionText}>Quiz Results</h2>
                <div style={styles.scoreBadge}>
                  {score} / {questions.length} Correct
                </div>
                <p style={styles.subtext}>
                  Understanding prostate and mental health is a critical first step. Share what you learn with brothers, fathers, and friends.
                </p>
                <button
                    type="button"
                    onClick={handleBack}
                    className="clisten-cta-btn"
                    style={styles.cta}
                >
                  Return to Pathways
                </button>
              </div>
          )}

          <p style={styles.footnote}>
            Your quiz interactions remain completely anonymous.
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
  card: {
    width: "100%",
    padding: "24px 20px",
    borderRadius: "16px",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    backgroundColor: "rgba(15, 30, 74, 0.6)",
    boxSizing: "border-box",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#D9C489",
    marginBottom: "12px",
  },
  questionText: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: 1.35,
    color: "#F5F6FA",
    margin: "0 0 20px 0",
    letterSpacing: "-0.01em",
  },
  optionsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  },
  optionBtn: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid",
    color: "#F5F6FA",
    fontSize: "15px",
    fontWeight: 500,
    fontFamily: "'IBM Plex Sans', sans-serif",
    cursor: "pointer",
    textAlign: "left",
    boxSizing: "border-box",
  },
  explanationBox: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(174, 184, 214, 0.2)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  explanationText: {
    fontSize: "14px",
    color: "#AEB8D6",
    lineHeight: 1.5,
    marginBottom: "18px",
    textAlign: "left",
  },
  cta: {
    appearance: "none",
    border: "none",
    background: "#B99B5B",
    color: "#0A1735",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: "16px",
    padding: "14px 0",
    borderRadius: "999px",
    letterSpacing: "0.01em",
    width: "100%",
    maxWidth: "280px",
    cursor: "pointer",
  },
  scoreBadge: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#B99B5B",
    margin: "8px 0 12px 0",
  },
  subtext: {
    fontSize: "14px",
    color: "#AEB8D6",
    lineHeight: 1.5,
    marginBottom: "24px",
  },
  footnote: {
    marginTop: "16px",
    fontSize: "13px",
    color: "#7E88AC",
  },
};