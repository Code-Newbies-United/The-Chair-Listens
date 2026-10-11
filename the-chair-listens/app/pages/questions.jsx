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

const CHAIR_BACKGROUND_STYLE = {
  background:
      "radial-gradient(circle at 100% 0%, rgba(141, 207, 148, 0.2), transparent 28%), radial-gradient(circle at 0% 90%, rgba(212, 233, 237, 0.1), transparent 25%), #2D5046",
  backgroundColor: "#2D5046",
};

export default function QuestionsPage({ locationName = "Pretoria" }) {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSession, setSavingSession] = useState(false);
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lastScriptKeyRef = useRef(null);

  const script =
      typeof router.query.script === "string" && SCRIPT_TITLES[router.query.script]
          ? router.query.script
          : "men_mental_health";

  const location =
      typeof router.query.location === "string"
          ? router.query.location
          : locationName;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const progress =
      totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // 1. Fetch Questions from API
  useEffect(() => {
    if (!router.isReady) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);

        const response = await fetch(
            `/api/questions?script=${encodeURIComponent(script)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();

        const formattedQuestions = Array.isArray(data.questions)
            ? data.questions.map((item) => ({
              id: item.id,
              category: item.title || "Reflection",
              title: item.title || "Reflection",
              question: item.question_text || "",
              placeholder:
                  item.placeholder ||
                  "Take your time. Say what feels true.",
            }))
            : [];

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [router.isReady, script]);

  // Reset state when switching scripts
  useEffect(() => {
    if (lastScriptKeyRef.current !== null && lastScriptKeyRef.current !== script) {
      setCurrentIndex(0);
      setCurrentText("");
      setReflection("");
      setAnswers([]);
    }
    lastScriptKeyRef.current = script;
  }, [script]);

  // Speech Synthesis Controls for AI Reflection
  const speakText = (text) => {
    if (typeof window === "undefined" || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
        voices.find(
            (voice) =>
                /en-ZA/i.test(voice.lang) &&
                /natural|google|enhanced|premium/i.test(voice.name)
        ) ||
        voices.find((voice) => /en-ZA/i.test(voice.lang)) ||
        voices.find((voice) => /^en/i.test(voice.lang));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const checkSafetyAndRedirect = (text) => {
    if (!text?.trim()) return false;

    const safetyResult = checkForSafetyTrigger(text);
    if (!safetyResult) return false;

    stopSpeaking();

    alert(
        safetyResult.message ||
        "It sounds like you may need some immediate support. Please reach out to someone who can help."
    );

    router.push("/emergency");
    return true;
  };

  // 2. Fetch Single Question AI Reflection via /api/groq
  const handleGetReflection = async () => {
    if (!currentText.trim() || !currentQuestion) return;

    if (checkSafetyAndRedirect(currentText)) return;

    try {
      setReflectionLoading(true);

      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script,
          question: currentQuestion.question,
          answer: currentText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reflection");
      }

      const data = await response.json();

      setReflection(
          data.text ||
          data.reflection ||
          data.message ||
          "Thank you for sharing that. Take a moment to sit with what you have said."
      );
    } catch (error) {
      console.error("Reflection error:", error);

      setReflection(
          "Thank you for taking the time to answer. There is value in giving yourself space to notice what is really going on."
      );
    } finally {
      setReflectionLoading(false);
    }
  };

  // 3. Complete Session: Save to /api/responses & Fetch /api/session-reflection
  const finishSession = async (finalAnswers) => {
    if (savingSession) return;

    try {
      setSavingSession(true);

      // Save raw responses to database
      await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script,
          location,
          answers: finalAnswers,
        }),
      });

      // Generate overall AI session summary
      let summaryData = null;
      try {
        const summaryRes = await fetch("/api/session-reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ script, answers: finalAnswers }),
        });

        if (summaryRes.ok) {
          summaryData = await summaryRes.json();
        }
      } catch (sumErr) {
        console.error("Session summary generation error:", sumErr);
      }

      const encodedData = encodeURIComponent(
          JSON.stringify(finalAnswers)
      );

      const queryParams = {
        script: encodeURIComponent(script),
        data: encodedData,
        location: encodeURIComponent(location),
      };

      if (summaryData) {
        queryParams.summary = encodeURIComponent(JSON.stringify(summaryData));
      }

      const queryString = new URLSearchParams(queryParams).toString();
      await router.push(`/responses?${queryString}`);
    } catch (error) {
      console.error("Unable to save responses:", error);
      setSavingSession(false);
      alert("We couldn't save your responses just yet. Please try again.");
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuestion || savingSession) return;

    const trimmedAnswer = currentText.trim();
    if (!trimmedAnswer) return;

    if (checkSafetyAndRedirect(trimmedAnswer)) return;

    const newAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: trimmedAnswer,
    };

    const updatedAnswers = [...answers, newAnswer];

    setAnswers(updatedAnswers);
    setReflection("");
    stopSpeaking();

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((previous) => previous + 1);
      setCurrentText("");
      return;
    }

    finishSession(updatedAnswers);
  };

  const handleBack = () => {
    if (savingSession) return;

    stopSpeaking();

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const previousAnswer = answers[prevIndex];

      setCurrentIndex(prevIndex);
      setCurrentText(previousAnswer?.answer || "");
      setReflection("");
      return;
    }

    router.push(
        `/select-script?location=${encodeURIComponent(location)}`
    );
  };

  useEffect(() => {
    setReflection("");
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  if (loading) {
    return (
        <main
            className="questions-page loading-page"
            style={CHAIR_BACKGROUND_STYLE}
        >
          <div className="loading-card">
            <span className="script-text">One moment.</span>
            <h1>Preparing your questions</h1>
            <p>Take a breath. Your space is almost ready.</p>

            <div className="loading-dots" aria-label="Loading">
              <span />
              <span />
              <span />
            </div>
          </div>

          <style jsx>{`
          .questions-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 28px;
            font-family: "Benton Sans", "Helvetica Neue", Arial, sans-serif;
          }

          .loading-card {
            width: min(100%, 520px);
            padding: 48px 36px;
            border-radius: 27px;
            background: #f5f2e8;
            text-align: center;
            box-shadow: 0 20px 50px rgba(17, 45, 37, 0.28);
          }

          .script-text {
            display: block;
            margin-bottom: 8px;
            color: #bc9553;
            font-family: "Pinyon Script", cursive;
            font-size: 34px;
          }

          .loading-card h1 {
            margin: 0;
            color: #203f36;
            font-size: clamp(28px, 6vw, 42px);
            line-height: 1.05;
          }

          .loading-card p {
            margin: 16px 0 0;
            color: #52645e;
            line-height: 1.6;
          }

          .loading-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 28px;
          }

          .loading-dots span {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #8dcf94;
            animation: pulse 1.2s ease-in-out infinite;
          }

          .loading-dots span:nth-child(2) {
            animation-delay: 0.15s;
          }

          .loading-dots span:nth-child(3) {
            animation-delay: 0.3s;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.35;
              transform: translateY(0);
            }

            50% {
              opacity: 1;
              transform: translateY(-5px);
            }
          }
        `}</style>
        </main>
    );
  }

  if (!questions.length) {
    return (
        <main
            className="questions-page empty-page"
            style={CHAIR_BACKGROUND_STYLE}
        >
          <div className="empty-card">
            <span className="script-text">A quiet pause.</span>

            <h1>Nothing here yet.</h1>

            <p>
              We couldn't find any questions for this path. Please choose
              another reflection.
            </p>

            <button
                type="button"
                onClick={() =>
                    router.push(
                        `/select-script?location=${encodeURIComponent(location)}`
                    )
                }
            >
              Choose another path
            </button>
          </div>

          <style jsx>{`
          .questions-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 28px;
            font-family: "Benton Sans", "Helvetica Neue", Arial, sans-serif;
          }

          .empty-card {
            width: min(100%, 520px);
            padding: 48px 36px;
            border-radius: 27px;
            background: #f5f2e8;
            text-align: center;
            box-shadow: 0 20px 50px rgba(17, 45, 37, 0.28);
          }

          .script-text {
            display: block;
            margin-bottom: 8px;
            color: #bc9553;
            font-family: "Pinyon Script", cursive;
            font-size: 34px;
          }

          .empty-card h1 {
            margin: 0;
            color: #203f36;
            font-size: 36px;
          }

          .empty-card p {
            margin: 16px auto 26px;
            max-width: 400px;
            color: #52645e;
            line-height: 1.65;
          }

          .empty-card button {
            border: 0;
            border-radius: 999px;
            padding: 14px 22px;
            background: #8dcf94;
            color: #203f36;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
            transition:
              transform 180ms ease,
              background 180ms ease;
          }

          .empty-card button:hover {
            background: #a5dfa9;
            transform: translateY(-2px);
          }
        `}</style>
        </main>
    );
  }

  return (
      <main className="questions-page" style={CHAIR_BACKGROUND_STYLE}>
        <div className="questions-shell">
          <header className="topbar">
            <button
                type="button"
                className="back-button"
                onClick={handleBack}
                disabled={savingSession}
                aria-label="Go back"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>

            <div className="location-pill">
              <span className="location-dot" />
              {location}
            </div>
          </header>

          <section className="question-shell">
            <div className="decor-circle decor-circle-blue" />
            <div className="decor-circle decor-circle-mint" />

            <div className="question-inner">
              <div className="intro">
              <span className="eyebrow">
                {SCRIPT_TITLES[script] || "Reflection"}
              </span>

                <h1>
                  Take a moment.
                  <span className="chair-script">Tell the Chair.</span>
                </h1>

                <p>
                  There is no right answer. Just say what feels true for you.
                </p>
              </div>

              <div className="progress-area">
                <div className="progress-labels">
                <span>
                  Question {currentIndex + 1} of {totalQuestions}
                </span>

                  <span>{Math.round(progress)}%</span>
                </div>

                <div className="progress-track">
                  <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="content-card">
                <QuestionCard
                    category={currentQuestion.category}
                    question={currentQuestion.question}
                />

                <TextResponse
                    value={currentText}
                    onChange={setCurrentText}
                    placeholder={currentQuestion.placeholder}
                    disabled={savingSession}
                />

                <div className="action-row">
                  <button
                      type="button"
                      className="reflection-button"
                      onClick={handleGetReflection}
                      disabled={
                          !currentText.trim() ||
                          reflectionLoading ||
                          savingSession
                      }
                  >
                    {reflectionLoading
                        ? "Sitting with it..."
                        : "Share & Reflect"}
                  </button>
                </div>

                {reflectionLoading && (
                    <div
                        className="reflection-loading"
                        aria-label="Generating reflection"
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                )}

                {reflection && !reflectionLoading && (
                    <div className="reflection-card">
                  <span className="reflection-script">
                    A thought for you.
                  </span>

                      <p>{reflection}</p>

                      <button
                          type="button"
                          className="listen-button"
                          onClick={() =>
                              isSpeaking
                                  ? stopSpeaking()
                                  : speakText(reflection)
                          }
                      >
                    <span aria-hidden="true">
                      {isSpeaking ? "■" : "▶"}
                    </span>

                        {isSpeaking ? "Stop listening" : "Listen"}
                      </button>
                    </div>
                )}
              </div>

              <div className="navigation-row">
                <button
                    type="button"
                    className="next-button"
                    onClick={handleNextQuestion}
                    disabled={!currentText.trim() || savingSession}
                >
                  {savingSession
                      ? "Saving your reflection..."
                      : currentIndex === totalQuestions - 1
                          ? "Complete reflection"
                          : "Continue"}

                  {!savingSession && (
                      <span aria-hidden="true">→</span>
                  )}
                </button>
              </div>

              <footer className="page-footer">
                <span>A quiet place in a noisy world.</span>
              </footer>
            </div>
          </section>
        </div>

        <style jsx>{`
        .questions-page {
          min-height: 100vh;
          padding: 26px 20px 42px;
          color: #203f36;
          font-family: "Benton Sans", "Helvetica Neue", Arial, sans-serif;
        }

        .questions-shell {
          width: min(100%, 680px);
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 0;
          background: transparent;
          color: #f5f2e8;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
          padding: 8px 0;
        }

        .back-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .back-button span:first-child {
          font-size: 22px;
          line-height: 1;
        }

        .location-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(245, 242, 232, 0.95);
          color: #52645e;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 8px 18px rgba(17, 45, 37, 0.12);
        }

        .location-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8dcf94;
        }

        .question-shell {
          position: relative;
          overflow: hidden;
          border-radius: 27px;
          background: #f5f2e8;
          box-shadow: 0 20px 50px rgba(17, 45, 37, 0.3);
        }

        .question-inner {
          position: relative;
          z-index: 2;
          padding: 46px 42px 30px;
        }

        .decor-circle {
          position: absolute;
          z-index: 0;
          border-radius: 50%;
          pointer-events: none;
        }

        .decor-circle-blue {
          top: -105px;
          right: -95px;
          width: 230px;
          height: 230px;
          background: #d4e9ed;
          opacity: 0.85;
        }

        .decor-circle-mint {
          bottom: -115px;
          left: -100px;
          width: 220px;
          height: 220px;
          background: #8dcf94;
          opacity: 0.22;
        }

        .intro {
          position: relative;
          z-index: 2;
          max-width: 540px;
          margin: 0 auto;
          text-align: center;
        }

        .eyebrow {
          display: inline-block;
          margin-bottom: 8px;
          color: #bc9553;
          font-family: "Pinyon Script", cursive;
          font-size: 31px;
          line-height: 1;
        }

        .intro h1 {
          margin: 0;
          color: #203f36;
          font-size: clamp(32px, 7vw, 48px);
          line-height: 0.98;
          letter-spacing: -0.035em;
        }

        .intro h1 .chair-script {
          display: block;
          margin-top: 5px;
          color: #2d5046;
          font-family: "Pinyon Script", cursive;
          font-size: 1.18em;
          font-weight: 400;
          letter-spacing: 0;
        }

        .intro p {
          max-width: 430px;
          margin: 18px auto 0;
          color: #52645e;
          font-size: 15px;
          line-height: 1.7;
        }

        .progress-area {
          position: relative;
          z-index: 2;
          margin-top: 34px;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 8px;
          color: #526b61;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .progress-labels span:last-child {
          color: #bc9553;
        }

        .progress-track {
          height: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: #dce9df;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #8dcf94;
          transition: width 350ms ease;
        }

        .content-card {
          position: relative;
          z-index: 2;
          margin-top: 25px;
          padding: 25px;
          border: 1px solid rgba(45, 80, 70, 0.08);
          border-radius: 21px;
          background: rgba(251, 250, 245, 0.8);
          box-shadow: 0 12px 30px rgba(17, 45, 37, 0.08);
        }

        .action-row {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .reflection-button {
          min-width: 170px;
          border: 0;
          border-radius: 999px;
          padding: 13px 20px;
          background: #8dcf94;
          color: #203f36;
          font: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(141, 207, 148, 0.18);
          transition:
            transform 180ms ease,
            background 180ms ease,
            opacity 180ms ease;
        }

        .reflection-button:hover:not(:disabled) {
          background: #a5dfa9;
          transform: translateY(-2px);
        }

        .reflection-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .reflection-loading {
          display: flex;
          justify-content: center;
          gap: 7px;
          margin-top: 22px;
        }

        .reflection-loading span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #bc9553;
          animation: reflectionPulse 1s ease-in-out infinite;
        }

        .reflection-loading span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .reflection-loading span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes reflectionPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }

          50% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }

        .reflection-card {
          margin-top: 25px;
          padding: 24px;
          border-radius: 18px;
          background: #d4e9ed;
          color: #203f36;
        }

        .reflection-script {
          display: block;
          margin-bottom: 8px;
          color: #315da8;
          font-family: "Pinyon Script", cursive;
          font-size: 29px;
        }

        .reflection-card p {
          margin: 0;
          color: #31504a;
          font-size: 15px;
          line-height: 1.75;
        }

        .listen-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          border: 0;
          border-radius: 999px;
          padding: 10px 15px;
          background: #bc9553;
          color: #fffaf0;
          font: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform 180ms ease,
            background 180ms ease;
        }

        .listen-button:hover {
          background: #d1b071;
          transform: translateY(-1px);
        }

        .navigation-row {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: flex-end;
          margin-top: 22px;
        }

        .next-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 0;
          border-radius: 999px;
          padding: 14px 20px;
          background: #203f36;
          color: #f5f2e8;
          font: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform 180ms ease,
            background 180ms ease,
            opacity 180ms ease;
        }

        .next-button:hover:not(:disabled) {
          background: #2d5046;
          transform: translateY(-2px);
        }

        .next-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .next-button span {
          font-size: 18px;
          line-height: 1;
        }

        .page-footer {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding-top: 28px;
          text-align: center;
        }

        .page-footer strong {
          color: #2d5046;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .page-footer span {
          color: #52645e;
          font-size: 11px;
        }

        @media (max-width: 600px) {
          .questions-page {
            padding: 16px 12px 28px;
          }

          .question-inner {
            padding: 34px 20px 24px;
          }

          .content-card {
            padding: 17px;
            border-radius: 18px;
          }

          .intro h1 {
            font-size: 34px;
          }

          .intro p {
            font-size: 14px;
          }

          .navigation-row {
            justify-content: stretch;
          }

          .next-button {
            width: 100%;
          }

          .topbar {
            margin-bottom: 12px;
          }

          .back-button {
            font-size: 13px;
          }

          .location-pill {
            font-size: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-dots span,
          .reflection-loading span {
            animation: none;
          }

          .progress-fill,
          .reflection-button,
          .listen-button,
          .next-button {
            transition: none;
          }
        }
      `}</style>
      </main>
  );
}