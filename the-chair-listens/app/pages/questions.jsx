import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { checkForSafetyTrigger } from "@/pages/utils/safety.js";
import QuestionCard from "@/components/QuestionCard";
import TextResponse from "@/components/TextResponse";

const SCRIPT_TITLES = {
  men_mental_health: "For Men",
  ally_support: "Ally & Support System",
  fast_track_activations: "Today's Event",
};

const PAGE_BG =
    "bg-[radial-gradient(120%_60%_at_50%_0%,#14265C_0%,#0F1E4A_40%,#0A1735_75%,#081128_100%)]";

export default function QuestionsPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const { script } = router.query;

  const activeScriptKey = SCRIPT_TITLES[script] ? script : "men_mental_health";

  // Prefer the location passed through from earlier pages, fall back to the prop
  const displayLocation = router.query.location || locationName;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [collectedAnswers, setCollectedAnswers] = useState([]);
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  const permissionDeniedRef = useRef(false);
  const isListeningRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastScriptKeyRef = useRef(null);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) setIsSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    async function fetchQuestions() {
      setQuestionsLoading(true);
      try {
        const res = await fetch(`/api/questions?script=${activeScriptKey}`);
        const result = await res.json();
        const mapped = (result.questions || []).map((q) => ({
          id: q.id,
          title: q.title,
          question: q.question_text,
          placeholder: q.placeholder,
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
      } catch (e) {}
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

  // Save all answers to Supabase, then navigate to the summary page with the data
  async function finishSession(answers) {
    try {
      await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
    } catch (err) {
      console.error("Failed to save responses:", err);
    }
    const encodedData = encodeURIComponent(JSON.stringify(answers));
    router.push(
      `/responses?script=${activeScriptKey}&data=${encodedData}&location=${encodeURIComponent(
        displayLocation
      )}`
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
      router.push({ pathname: "/select-script", query: { location: displayLocation } });
    }
  };

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
      if (!recognitionRef.current) recognitionRef.current = initSpeechRecognition();
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

  // Show a loading state until questions have arrived from Supabase
  if (questionsLoading || questions.length === 0) {
    return (
        <main className={`min-h-[100dvh] w-full flex items-center justify-center ${PAGE_BG} p-6 font-sans`}>
          <p className="text-[#AEB8D6]">Loading questions...</p>
        </main>
    );
  }

  if (questions.length === 0) {
    return (
        <main className={`min-h-[100dvh] w-full flex items-center justify-center ${PAGE_BG} p-6 font-sans`}>
          <p className="text-[#AEB8D6] text-center max-w-sm">
            No questions are set up for this category yet. Please try a different option or check back soon.
          </p>
        </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
      <main
          className={`min-h-[100dvh] w-full flex flex-col items-center justify-center ${PAGE_BG} p-5 md:p-8 box-border overflow-x-hidden font-sans`}
      >
        <div className="w-full max-w-[440px] flex flex-col gap-5">
          <div className="w-full flex justify-between items-center">
            <button
                type="button"
                onClick={handleBack}
                className="bg-transparent border-0 text-[#AEB8D6] text-sm font-medium cursor-pointer p-0 hover:text-[#F5F6FA] transition-colors"
            >
              « {currentIndex === 0 ? "Change Topic" : "Previous"}
            </button>
            <div className="inline-flex items-center gap-1.5 text-[#D9C489] text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B99B5B]" aria-hidden="true" />
              Sitting in {displayLocation}
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#D9C489] uppercase tracking-wider">
              {SCRIPT_TITLES[activeScriptKey]}
            </span>
              <span className="text-[#7E88AC]">
              Question {currentIndex + 1} of {questions.length}
            </span>
            </div>
            <div className="w-full h-1 bg-[#AEB8D6]/15 rounded-full overflow-hidden">
              <div
                  className="h-full bg-[#B99B5B] transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <QuestionCard category={currentQuestion.title} question={currentQuestion.question}>
            <TextResponse
                value={currentText}
                onChange={(text) => {
                  setCurrentText(text);
                  checkSafetyAndRedirect(text);
                }}
                placeholder={currentQuestion.placeholder}
                disabled={reflection !== null || loading}
                isListening={isListening}
                onToggleListening={toggleListening}
                isSpeechSupported={isSpeechSupported && !reflection}
            />

            {!reflection && !loading && (
                <button
                    type="button"
                    onClick={handleGetReflection}
                    disabled={!currentText.trim()}
                    className="
                w-full mt-4 py-3.5 px-5 rounded-full
                bg-[#B99B5B] text-[#0A1735] font-semibold text-base
                transition-all duration-150 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-md cursor-pointer hover:bg-[#D9C489]
              "
                >
                  Share &amp; Reflect
                </button>
            )}

            {loading && (
                <div className="flex items-center justify-center gap-2.5 pt-5 pb-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B99B5B] animate-pulse" />
                  <p className="text-[#AEB8D6] text-sm m-0">The Chair is reflecting on your answer...</p>
                </div>
            )}

            {reflection && (
                <div className="mt-5 pt-4 border-t border-dashed border-[#AEB8D6]/25 max-w-full box-border">
                  <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-semibold text-[#B99B5B] uppercase tracking-wide">
                  The Chair's Reflection
                </span>
                    <button
                        type="button"
                        onClick={toggleSpeechSynthesis}
                        className="
                    inline-flex items-center gap-1.5
                    bg-[#B99B5B]/15 border border-[#B99B5B] text-[#D9C489]
                    rounded-2xl px-2.5 py-1 text-xs font-semibold
                    cursor-pointer hover:bg-[#D9C489]/20 transition-colors
                  "
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

                  <p className="text-sm leading-relaxed text-[#F5F6FA] m-0 break-words whitespace-pre-wrap max-h-[260px] overflow-y-auto overflow-x-hidden">
                    {reflection}
                  </p>

                  <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="
                  w-full mt-4 py-3.5 px-5 rounded-full
                  bg-[#B99B5B] text-[#0A1735] font-semibold text-base
                  transition-all duration-150 active:scale-95
                  shadow-md cursor-pointer hover:bg-[#D9C489]
                "
                  >
                    {currentIndex === questions.length - 1 ? "Complete Session" : "Next Question"}
                  </button>
                </div>
            )}
          </QuestionCard>
        </div>
      </main>
  );
}