import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

/**
 * The Chair Listens — Immediate Feedback Per Question
 */

const QUESTION_BANK = {
  men_mental_health: [
    {
      id: "mmh_1",
      title: "The Silent Load",
      question: "What is something heavy you’ve been carrying lately that you haven't spoken out loud to anyone?",
      placeholder: "Say what's on your mind... type or speak below.",
    },
    {
      id: "mmh_2",
      title: "Where You Go",
      question: "When things get overwhelming, where do you usually retreat or turn to?",
      placeholder: "e.g., Silence, working out, driving, bottling it up...",
    },
    {
      id: "mmh_3",
      title: "What Needs to Change",
      question: "What expectation placed on men feels the most exhausting to maintain right now?",
      placeholder: "e.g., Financial pressure, having to always be strong...",
    },
  ],

  ally_support: [
    {
      id: "ally_1",
      title: "What You Notice",
      question: "What have you observed the man in your life struggling with that he rarely talks about?",
      placeholder: "Share what you notice from the outside...",
    },
    {
      id: "ally_2",
      title: "The Unsaid Words",
      question: "If you knew he would truly listen without feeling defensive, what is one thing you would want him to hear?",
      placeholder: "Write what you wish he knew...",
    },
    {
      id: "ally_3",
      title: "Creating Safe Ground",
      question: "What do you think makes it hardest for men to open up when they are hurting?",
      placeholder: "e.g., Fear of being a burden, lack of safe spaces...",
    },
  ],

  fast_track_activations: [
    {
      id: "fast_1",
      title: "Right Now",
      question: "Sitting in this chair today, what is the primary emotion you are feeling in three words or less?",
      placeholder: "e.g., Tired, hopeful, uncertain...",
    },
    {
      id: "fast_2",
      title: "Today's Message",
      question: "What is one truth you wish more people understood about your daily reality?",
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

  // Derive active script key synchronously
  const activeScriptKey = SCRIPT_TITLES[script] ? script : "men_mental_health";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  
  // Reflection & AI State
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(false);

  // Speech Recognition (Voice Input)
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Text to Speech (Natural Voice Output)
  const [isPlaying, setIsPlaying] = useState(false);

  // Ref to track if script key changed explicitly
  const lastScriptKeyRef = useRef(null);

  // Check speech recognition capability on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  // Handle explicit Script or Index navigation changes ONLY
  useEffect(() => {
    if (lastScriptKeyRef.current !== null && lastScriptKeyRef.current !== activeScriptKey) {
      setCurrentIndex(0);
      setCurrentText("");
      setReflection(null);
    }
    lastScriptKeyRef.current = activeScriptKey;
  }, [activeScriptKey]);

  // Reset input when user manually advances to a new question index
  const handleNextQuestion = () => {
    stopAudio();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentText("");
      setReflection(null);
    } else {
      router.push("/responses");
    }
  };

  const handleBack = () => {
    stopAudio();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setCurrentText("");
      setReflection(null);
    } else {
      router.push("/select-script");
    }
  };

  function stopAudio() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }

  function initSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-ZA";

    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setCurrentText(fullTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        alert("Microphone permission was denied. Please allow microphone access in your browser settings.");
      }
    };

    recognition.onend = () => setIsListening(false);
    return recognition;
  }

  function toggleListening() {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error("Start speech failed:", err);
        }
      }
    }
  }

  async function handleGetReflection() {
    if (!currentText.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setLoading(true);
    stopAudio();

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: activeScriptKey,
          question: currentQuestion.question,
          answer: currentText,
        }),
      });

      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      setReflection(data.text);
    } catch (err) {
      console.error("Reflection error:", err);
      setReflection("Thank you for sharing your thoughts today. Your voice matters.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSpeechSynthesis() {
    if (!reflection || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(reflection);
    utterance.rate = 0.92;
    utterance.pitch = 0.95;

    const voices = synth.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Enhanced") ||
          v.name.includes("Premium"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    synth.speak(utterance);
  }

  const questions = QUESTION_BANK[activeScriptKey];
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <main style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .clisten-btn-nav {
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .clisten-btn-nav:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
        .clisten-btn-nav:active {
          transform: translateY(0px) scale(0.98);
        }
        .clisten-mic-btn.active {
          background-color: #D9534F !important;
          border-color: #FF6B6B !important;
          animation: micPulse 1.2s infinite ease-in-out;
        }
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217, 83, 79, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(217, 83, 79, 0); }
        }
        .clisten-textarea:focus {
          outline: none;
          border-color: #B99B5B !important;
          box-shadow: 0 0 0 2px rgba(185, 155, 91, 0.25);
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
        {/* Top Header */}
        <div style={styles.topRow}>
          <button type="button" onClick={handleBack} style={styles.backButton}>
            &larr; {currentIndex === 0 ? "Change Topic" : "Previous"}
          </button>
          <div style={styles.locationTag}>
            <span style={styles.locationDot} aria-hidden="true" />
            Sitting in {locationName}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.scriptBadge}>{SCRIPT_TITLES[activeScriptKey]}</span>
            <span style={styles.progressText}>
              Question {currentIndex + 1} of {questions.length}
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
            rows={4}
            disabled={reflection !== null || loading}
            className="clisten-textarea"
            style={{
              ...styles.textarea,
              opacity: reflection ? 0.7 : 1,
            }}
          />

          {/* Voice Input Controls */}
          {!reflection && isSpeechSupported && (
            <div style={styles.micRow}>
              <button
                type="button"
                onClick={toggleListening}
                className={`clisten-mic-btn ${isListening ? "active" : ""}`}
                style={styles.micBtn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "8px" }}>
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                {isListening ? "Stop Recording..." : "Speak Answer"}
              </button>
              {isListening && <span style={styles.listeningIndicator}>Listening...</span>}
            </div>
          )}

          {/* Submit Answer Button */}
          {!reflection && !loading && (
            <button
              type="button"
              onClick={handleGetReflection}
              disabled={!currentText.trim()}
              className="clisten-btn-nav"
              style={{
                ...styles.cta,
                marginTop: "16px",
                opacity: currentText.trim() ? 1 : 0.5,
                cursor: currentText.trim() ? "pointer" : "not-allowed",
              }}
            >
              Share & Reflect
            </button>
          )}

          {/* AI Loader */}
          {loading && (
            <div className="pulse-loader" style={styles.loadingBox}>
              <div style={styles.spinnerDot} />
              <p style={styles.loadingText}>The Chair is reflecting on your answer...</p>
            </div>
          )}

          {/* AI Reflection Box */}
          {reflection && (
            <div style={styles.reflectionBox}>
              <div style={styles.reflectionHeader}>
                <span style={styles.reflectionTitle}>The Chair's Reflection</span>
                <button
                  type="button"
                  onClick={toggleSpeechSynthesis}
                  style={styles.audioBtn}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    {isPlaying ? (
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    ) : (
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    )}
                  </svg>
                  {isPlaying ? "Pause" : "Listen"}
                </button>
              </div>

              <p style={styles.reflectionText}>{reflection}</p>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="clisten-btn-nav"
                style={{ ...styles.cta, marginTop: "16px" }}
              >
                {currentIndex === questions.length - 1 ? "Complete Session" : "Next Question"}
              </button>
            </div>
          )}
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
    fontWeight: 600,
    fontSize: "19px",
    lineHeight: 1.35,
    color: "#F5F6FA",
    margin: "0 0 16px 0",
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
  micRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
  },
  micBtn: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "rgba(185, 155, 91, 0.15)",
    border: "1px solid #B99B5B",
    color: "#D9C489",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  listeningIndicator: {
    fontSize: "12px",
    color: "#FF6B6B",
    fontWeight: 500,
  },
  cta: {
    appearance: "none",
    border: "none",
    background: "#B99B5B",
    color: "#0A1735",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    padding: "13px 20px",
    borderRadius: "999px",
    width: "100%",
  },
  loadingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "20px 0 10px 0",
  },
  spinnerDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#B99B5B",
  },
  loadingText: {
    fontSize: "13px",
    color: "#AEB8D6",
    margin: 0,
  },
  reflectionBox: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px dashed rgba(174, 184, 214, 0.25)",
  },
  reflectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  reflectionTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#B99B5B",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  reflectionText: {
    fontSize: "14px",
    lineHeight: 1.55,
    color: "#F5F6FA",
    margin: 0,
  },
  audioBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "rgba(185, 155, 91, 0.15)",
    border: "1px solid #B99B5B",
    color: "#D9C489",
    borderRadius: "16px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
};