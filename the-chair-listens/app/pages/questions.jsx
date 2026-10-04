import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { checkForSafetyTrigger } from "@/pages/utils/safety.js";
import { useRequireSession, getSessionId, clearSessionId } from "@/lib/session";

const SCRIPT_TITLES = {
  men_mental_health: "For Men",
  ally_support: "Ally & Support System",
  fast_track_activations: "Today's Event",
};

export default function QuestionsPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const sessionReady = useRequireSession(); // redirects to / if no consent session
  const { script, location } = router.query;

  // Fallbacks for initial render prior to router hydration
  const activeScriptKey = SCRIPT_TITLES[script] ? script : "men_mental_health";
  const displayLocation = location || locationName;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");

  // Questions fetched from Supabase via API route
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Collected answers across session
  const [collectedAnswers, setCollectedAnswers] = useState([]);

  // Reflection & AI State
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(false);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  const permissionDeniedRef = useRef(false);
  const isListeningRef = useRef(false);

  // Text-to-Speech State
  const [isPlaying, setIsPlaying] = useState(false);

  // Track script transitions
  const lastScriptKeyRef = useRef(null);

  // Safety trigger check
  const checkSafetyAndRedirect = (text) => {
    if (checkForSafetyTrigger(text)) {
      stopAudio();
      stopListening();
      alert("We are concerned for your safety. Redirecting you to immediate help and support resources.");
      router.push("/emergency");
      return true;
    }
    return false;
  };

  // Check Web Speech API capability on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  // Fetch questions from Supabase API endpoint
  useEffect(() => {
    if (!router.isReady) return;

    async function fetchQuestions() {
      setQuestionsLoading(true);
      try {
        const res = await fetch(`/api/questions?script=${encodeURIComponent(activeScriptKey)}`, {
          cache: "no-store",
        });
        const result = await res.json();

        const mapped = (result.questions || []).map((q) => ({
          id: q.id,
          title: q.title,
          question: q.question_text || q.question,
          placeholder: q.placeholder || "Type or speak your answer here...",
        }));

        setQuestions(mapped);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    }

    fetchQuestions();
  }, [router.isReady, activeScriptKey]);

  // Reset page state when activeScriptKey changes
  useEffect(() => {
    if (lastScriptKeyRef.current !== null && lastScriptKeyRef.current !== activeScriptKey) {
      setCurrentIndex(0);
      setCurrentText("");
      setReflection(null);
      setCollectedAnswers([]);
    }
    lastScriptKeyRef.current = activeScriptKey;
  }, [activeScriptKey]);

  function stopListening() {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }
  }

  function stopAudio() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }

  const handleNextQuestion = () => {
    stopAudio();
    stopListening();

    const currentQuestion = questions[currentIndex];
    const updatedAnswers = [
      ...collectedAnswers,
      {
        questionId: currentQuestion.id,
        title: currentQuestion.title,
        question: currentQuestion.question,
        answer: currentText,
      },
    ];
    setCollectedAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentText("");
      setReflection(null);
    } else {
      finishSession(updatedAnswers);
    }
  };

  async function finishSession(answers) {
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          script: activeScriptKey,
          location: displayLocation,
          session_id: getSessionId(),
        }),
      });

      // 403 = the server has no valid consent for this session (missing or expired).
      // Send the person back to give consent again. (FIX-10 will add proper retry.)
      if (res.status === 403) {
        clearSessionId();
        router.replace("/?consent=required");
        return;
      }
    } catch (err) {
      console.error("Failed to save responses:", err);
    }

    const encodedData = encodeURIComponent(JSON.stringify(answers));
    router.push(
        `/responses?script=${activeScriptKey}&data=${encodedData}&location=${encodeURIComponent(displayLocation)}`
    );
  }

  const handleBack = () => {
    stopAudio();
    stopListening();

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevSavedAnswer = collectedAnswers[prevIndex]?.answer || "";

      setCollectedAnswers((prev) => prev.slice(0, prevIndex));
      setCurrentIndex(prevIndex);
      setCurrentText(prevSavedAnswer);
      setReflection(null);
    } else {
      router.push({
        pathname: "/select-script",
        query: { location: displayLocation },
      });
    }
  };

  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
      checkSafetyAndRedirect(fullTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        permissionDeniedRef.current = true;
        stopListening();
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current && !permissionDeniedRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to restart speech recognition:", e);
        }
      } else {
        stopListening();
      }
    };

    return recognition;
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }

      if (recognitionRef.current) {
        try {
          permissionDeniedRef.current = false;
          isListeningRef.current = true;
          setIsListening(true);
          recognitionRef.current.start();
        } catch (err) {
          console.error("Start speech failed:", err);
          stopListening();
        }
      }
    }
  }

  async function handleGetReflection() {
    if (!currentText.trim()) return;
    if (checkSafetyAndRedirect(currentText)) return;

    stopListening();
    stopAudio();
    setLoading(true);

    const currentQuestion = questions[currentIndex];

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: activeScriptKey,
          question: currentQuestion?.question,
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
    const naturalVoice =
        voices.find(
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

  if (!sessionReady) return null;

  if (questionsLoading) {
    return (
        <main style={styles.page}>
          <p style={{ color: "#AEB8D6" }}>Loading questions...</p>
        </main>
    );
  }

  if (questions.length === 0) {
    return (
        <main style={styles.page}>
          <p style={{ color: "#AEB8D6" }}>
            No questions are set up for this category yet. Please try a different option or check back soon.
          </p>
        </main>
    );
  }

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
          <div style={styles.topRow}>
            <button type="button" onClick={handleBack} style={styles.backButton}>
              « {currentIndex === 0 ? "Change Topic" : "Previous"}
            </button>
            <div style={styles.locationTag}>
              <span style={styles.locationDot} aria-hidden="true" />
              Sitting in {displayLocation}
            </div>
          </div>

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

          <div style={styles.card}>
            <span style={styles.questionCategory}>{currentQuestion.title}</span>
            <h1 style={styles.questionText}>{currentQuestion.question}</h1>

            <textarea
                value={currentText}
                onChange={(e) => {
                  const text = e.target.value;
                  setCurrentText(text);
                  checkSafetyAndRedirect(text);
                }}
                placeholder={currentQuestion.placeholder}
                rows={4}
                disabled={reflection !== null || loading}
                className="clisten-textarea"
                style={{
                  ...styles.textarea,
                  opacity: reflection ? 0.7 : 1,
                }}
            />

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

            {loading && (
                <div className="pulse-loader" style={styles.loadingBox}>
                  <div style={styles.spinnerDot} />
                  <p style={styles.loadingText}>The Chair is reflecting on your answer...</p>
                </div>
            )}

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
    background: "radial-gradient(120% 60% at 50% 0%, #14265C 0%, #0F1E4A 40%, #0A1735 75%, #081128 100%)",
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