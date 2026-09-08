import { useState, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * The Chair Listens — Dynamic Question Flow
 *
 * Question Bank categorized by script pathway:
 * - men_mental_health: Deep-dive, honest questions about men's well-being
 * - ally_support: Questions for loved ones carrying and observing from the outside
 * - fast_track_activations: Quick, high-impact questions for today's event/activation
 */

const QUESTION_BANK = {
  men_mental_health: [
    {
      id: "mmh_1",
      title: "The Silent Load",
      question: "What is something heavy you’ve been carrying lately that you haven't spoken out loud to anyone?",
      type: "text",
      placeholder: "Say what's on your mind... no names needed.",
    },
    {
      id: "mmh_2",
      title: "Where You Go",
      question: "When things get overwhelming, where do you usually retreat or turn to?",
      type: "text",
      placeholder: "e.g., Silence, working out, driving, bottling it up...",
    },
    {
      id: "mmh_3",
      title: "What Needs to Change",
      question: "What expectation placed on men feels the most exhausting to maintain right now?",
      type: "text",
      placeholder: "e.g., Financial pressure, having to always be strong...",
    },
  ],

  ally_support: [
    {
      id: "ally_1",
      title: "What You Notice",
      question: "What have you observed the man in your life struggling with that he rarely talks about?",
      type: "text",
      placeholder: "Share what you notice from the outside...",
    },
    {
      id: "ally_2",
      title: "The Unsaid Words",
      question: "If you knew he would truly listen without feeling defensive, what is one thing you would want him to hear?",
      type: "text",
      placeholder: "Write what you wish he knew...",
    },
    {
      id: "ally_3",
      title: "Creating Safe Ground",
      question: "What do you think makes it hardest for men to open up when they are hurting?",
      type: "text",
      placeholder: "e.g., Fear of being a burden, lack of safe spaces...",
    },
  ],

  fast_track_activations: [
    {
      id: "fast_1",
      title: "Right Now",
      question: "Sitting in this chair today, what is the primary emotion you are feeling in three words or less?",
      type: "text",
      placeholder: "e.g., Tired, hopeful, uncertain...",
    },
    {
      id: "fast_2",
      title: "Today's Message",
      question: "What is one truth you wish more people understood about your daily reality?",
      type: "text",
      placeholder: "Share a short thought...",
    },
  ],
};

const SCRIPT_TITLES = {
  men_mental_health: "For Men",
  ally_support: "Ally & Support System",
  fast_track_activations: "Today's Event",
};

export default function QuestionsPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const { script } = router.query;

  // Match key from select-script, fallback to men_mental_health
  const activeScriptKey = SCRIPT_TITLES[script] ? script : "men_mental_health";
  const questions = QUESTION_BANK[activeScriptKey];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentText, setCurrentText] = useState("");

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Sync state when step changes or query loads
  useEffect(() => {
    if (currentQuestion) {
      setCurrentText(answers[currentQuestion.id] || "");
    }
  }, [currentIndex, activeScriptKey]);

  function handleNext() {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: currentText,
    };
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push({
        pathname: "/complete",
        query: { script: activeScriptKey },
      });
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: currentText }));
      setCurrentIndex((prev) => prev - 1);
    } else {
      router.push("/select-script");
    }
  }

  return (
    <main style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-btn-nav {
          transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
        }
        .clisten-btn-nav:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
        .clisten-btn-nav:active {
          transform: translateY(0px) scale(0.98);
        }
        .clisten-back-btn {
          transition: color 160ms ease;
        }
        .clisten-back-btn:hover {
          color: #F5F6FA !important;
        }
        .clisten-textarea:focus {
          outline: none;
          border-color: #B99B5B !important;
          box-shadow: 0 0 0 2px rgba(185, 155, 91, 0.25);
        }
      `}</style>

      <div style={styles.frame}>
        {/* Top Header Row */}
        <div style={styles.topRow}>
          <button
            type="button"
            onClick={handleBack}
            className="clisten-back-btn"
            style={styles.backButton}
          >
            &larr; {currentIndex === 0 ? "Change Topic" : "Previous"}
          </button>
          <div style={styles.locationTag}>
            <span style={styles.locationDot} aria-hidden="true" />
            Sitting in {locationName}
          </div>
        </div>

        {/* Progress Tracker */}
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.scriptBadge}>{SCRIPT_TITLES[activeScriptKey]}</span>
            <span style={styles.progressText}>
              {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <div style={styles.track}>
            <div style={{ ...styles.fill, width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={styles.card}>
          <span style={styles.questionCategory}>{currentQuestion.title}</span>
          <h1 style={styles.questionText}>{currentQuestion.question}</h1>

          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={5}
            className="clisten-textarea"
            style={styles.textarea}
          />
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="clisten-btn-nav"
          style={styles.cta}
        >
          {currentIndex === questions.length - 1 ? "Finish Session" : "Next Question"}
        </button>

        <p style={styles.footnote}>
          Type it out, or just say what you feel.
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
  progressContainer: {
    width: "100%",
    marginBottom: "20px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  scriptBadge: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#D9C489",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  progressText: {
    fontSize: "12px",
    color: "#7E88AC",
  },
  track: {
    width: "100%",
    height: "4px",
    backgroundColor: "rgba(174, 184, 214, 0.15)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#B99B5B",
    transition: "width 200ms ease-in-out",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(15, 30, 74, 0.6)",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    borderRadius: "16px",
    padding: "24px 20px",
    boxSizing: "border-box",
    marginBottom: "24px",
  },
  questionCategory: {
    fontSize: "12px",
    color: "#B99B5B",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "8px",
  },
  questionText: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: "19px",
    lineHeight: 1.35,
    color: "#F5F6FA",
    margin: "0 0 20px 0",
  },
  textarea: {
    width: "100%",
    backgroundColor: "rgba(10, 23, 53, 0.7)",
    border: "1px solid rgba(174, 184, 214, 0.25)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#F5F6FA",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "15px",
    lineHeight: 1.5,
    resize: "none",
    boxSizing: "border-box",
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