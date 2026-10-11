import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * The Chair Listens — Prostate & Mental Health Knowledge Check Quiz
 * Questions are fetched from /api/quiz-questions.
 */

export default function QuizPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const displayLocation = router.query.location || locationName;

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
    if (option.is_correct) setScore((prev) => prev + 1);
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

  if (questionsLoading) {
    return (
        <main className="quiz-page">
          <div className="quiz-shell quiz-message">Loading quiz...</div>
          <QuizStyles />
        </main>
    );
  }

  if (questions.length === 0) {
    return (
        <main className="quiz-page">
          <QuizStyles />
          <div className="quiz-shell quiz-message">
            <p>The quiz isn't set up yet. Please check back soon.</p>
            <button type="button" onClick={handleBack} className="quiz-outline-button">← Back to pathways</button>
          </div>
        </main>
    );
  }

  const currentQ = questions[currentIndex];

  return (
      <main className="quiz-page">
        <QuizStyles />
        <div className="quiz-shell">
          <header className="quiz-topbar">
            <div className="quiz-brand">
              <img
                  className="quiz-brand-logo"
                  src="/logos/factor-of-ten-logo.jpg"
                  alt="Factor of Ten Foundation logo"
              />
              <span className="quiz-brand-mark" />
              The Chair Listens
            </div>
            <div className="quiz-location-pill"><span className="quiz-location-dot" />{displayLocation}</div>
          </header>

          <div className="quiz-nav-row">
            {!isFinished && <span className="quiz-progress-label">Question {currentIndex + 1} of {questions.length}</span>}
          </div>

          {!isFinished ? (
              <section className="quiz-card">
                <div className="quiz-eyebrow"><span className="quiz-eyebrow-line" />A space to pause<span className="quiz-eyebrow-line" /></div>
                <span className="quiz-badge">Knowledge check</span>
                <h1 className="quiz-question">{currentQ.question_text}</h1>

                <div className="quiz-options">
                  {(currentQ.options || []).map((option, idx) => {
                    let stateClass = "";
                    if (showExplanation) {
                      if (option.is_correct) stateClass = "is-correct";
                      else if (option === selectedOption) stateClass = "is-incorrect";
                    }
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(option)}
                            disabled={showExplanation}
                            className={`quiz-option ${stateClass}`}
                        >
                          <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                          <span>{option.text}</span>
                        </button>
                    );
                  })}
                </div>

                {showExplanation && (
                    <div className="quiz-explanation">
                      <span className="quiz-explanation-label">A little more to know</span>
                      <p>{currentQ.explanation}</p>
                      <button type="button" onClick={handleNext} className="quiz-cta">
                        {currentIndex + 1 === questions.length ? "See results" : "Next question"}
                      </button>
                    </div>
                )}
              </section>
          ) : (
              <section className="quiz-card quiz-results-card">
                <div className="quiz-eyebrow"><span className="quiz-eyebrow-line" />Knowledge check complete<span className="quiz-eyebrow-line" /></div>
                <h1 className="quiz-question">Your results</h1>
                <div className="quiz-score">
                  <span className="quiz-score-number">{score} / {questions.length}</span>
                  <small className="quiz-score-label">correct answers</small>
                </div>
                <p className="quiz-subtext">Understanding prostate and mental health is a critical first step. Share what you learn with brothers, fathers, and friends.</p>
                <button type="button" onClick={handleBack} className="quiz-cta">Return to pathways</button>
              </section>
          )}

          <div className="quiz-bottom-actions">
            <button type="button" onClick={handleBack} className="quiz-outline-button">Exit Quiz</button>
          </div>

          <footer className="quiz-footer">
            <span className="quiz-footer-brand">FACTOR OF TEN</span>
            <span className="quiz-footer-tagline">Know more. Ask more. Check sooner.</span>
          </footer>
        </div>
      </main>
  );
}

function QuizStyles() {
  return (
      <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
      :root {
        --quiz-forest: #2d5046;
        --quiz-forest-dark: #203f36;
        --quiz-forest-deep: #19362f;
        --quiz-mint: #8dcf94;
        --quiz-mint-bright: #a5dfa9;
        --quiz-blue: #d4e9ed;
        --quiz-cream: #f5f2e8;
        --quiz-white: #fbfaf5;
        --quiz-ochre: #bc9553;
        --quiz-sage: #526b61;
      }
      .quiz-page, .quiz-page * { box-sizing: border-box; }
      .quiz-page {
        min-height: 100dvh; width: 100%; display: flex; justify-content: center;
        background: radial-gradient(circle at 100% 0%, rgba(141,207,148,.2), transparent 28%),
          radial-gradient(circle at 0% 90%, rgba(212,233,237,.1), transparent 25%), var(--quiz-forest);
        color: var(--quiz-white); font-family: "Benton Sans", "Helvetica Neue", Arial, sans-serif;
        padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
      }
      .quiz-shell { width: 100%; max-width: 760px; min-height: calc(100dvh - 48px); margin: 0 auto; display:flex; flex-direction:column; }
      .quiz-topbar { min-height: 48px; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:4px 3px 14px; }
      .quiz-brand { display:flex; align-items:center; gap:8px; color:var(--quiz-white); font-size:10px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
      .quiz-brand-logo { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(245, 242, 232, 0.55); }
      .quiz-brand-mark { width:9px; height:9px; flex:0 0 auto; border-radius:50%; background:var(--quiz-mint); box-shadow:0 0 0 4px rgba(141,207,148,.12), 0 0 18px rgba(141,207,148,.25); }
      .quiz-location-pill { display:flex; align-items:center; gap:6px; flex-shrink:0; color:var(--quiz-forest-dark); background:var(--quiz-mint); border-radius:100px; padding:7px 11px; font-size:10px; font-weight:800; letter-spacing:.04em; max-width:58%; overflow-wrap:anywhere; }
      .quiz-location-dot { width:5px; height:5px; flex:0 0 auto; border-radius:50%; background:var(--quiz-forest); }
      .quiz-nav-row { display:flex; align-items:center; justify-content:space-between; gap:12px; margin:6px 3px 18px; }
      
      .quiz-outline-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        margin: 0 auto;
        padding: 12px 24px;
        border: 0.33px solid rgba(251, 250, 245, 0.35);
        border-radius: 100px;
        background: transparent;
        color: var(--quiz-white);
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
      }
      .quiz-outline-button:hover {
        border-color: var(--quiz-mint);
        background: rgba(141, 207, 148, 0.12);
        color: var(--quiz-mint-bright);
      }
      .quiz-outline-button:focus-visible { outline: 2px solid var(--quiz-ochre); outline-offset: 3px; }

      .quiz-bottom-actions { display:flex; justify-content:center; margin-top: 20px; }
      .quiz-progress-label { color:rgba(251,250,245,.7); font-size:11px; font-weight:700; letter-spacing:.04em; }
      .quiz-card { position:relative; overflow:hidden; isolation:isolate; padding:clamp(23px,5vw,42px); border-radius:27px; background:var(--quiz-cream); color:var(--quiz-forest); box-shadow:0 18px 50px rgba(17,45,37,.16); }
      .quiz-card::before { content:""; position:absolute; z-index:-1; width:230px; height:230px; border-radius:50%; background:var(--quiz-blue); top:-155px; right:-105px; }
      .quiz-card::after { content:""; position:absolute; z-index:-1; width:170px; height:170px; border-radius:50%; background:var(--quiz-mint); opacity:.55; bottom:-125px; left:-95px; }
      .quiz-eyebrow { display:flex; align-items:center; justify-content:center; gap:9px; margin-bottom:20px; color:var(--quiz-sage); font-size:9px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; text-align:center; }
      .quiz-eyebrow-line { width:25px; height:1px; flex:0 0 25px; background:var(--quiz-ochre); }
      .quiz-badge { display:inline-block; margin-bottom:12px; padding:7px 10px; border-radius:100px; background:rgba(45,80,70,.08); color:var(--quiz-sage); font-size:9px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
      .quiz-question { margin:0 0 24px; font-size:clamp(23px,4vw,32px); line-height:1.18; font-weight:850; letter-spacing:-.045em; color:var(--quiz-forest); text-align:center; }
      .quiz-options { display:flex; flex-direction:column; gap:10px; width:100%; }
      .quiz-option { display:flex; align-items:center; gap:13px; width:100%; min-height:58px; padding:13px 15px; border:1.5px solid rgba(45,80,70,.17); border-radius:14px; background:rgba(255,255,255,.62); color:var(--quiz-forest); font-family:inherit; font-size:14px; line-height:1.45; font-weight:600; text-align:left; cursor:pointer; transition:border-color 160ms ease, background 160ms ease, transform 160ms ease; }
      .quiz-option:not(:disabled):hover { transform:translateY(-1px); border-color:var(--quiz-ochre); background:var(--quiz-white); }
      .quiz-option:focus-visible, .quiz-cta:focus-visible { outline:2px solid var(--quiz-ochre); outline-offset:3px; }
      .quiz-option:disabled { cursor:default; }
      .quiz-option-letter { display:flex; align-items:center; justify-content:center; width:28px; height:28px; flex:0 0 28px; border-radius:50%; background:rgba(45,80,70,.08); color:var(--quiz-sage); font-size:11px; font-weight:800; }
      .quiz-option.is-correct { border-color:#3e8053; background:rgba(141,207,148,.28); }
      .quiz-option.is-correct .quiz-option-letter { background:#3e8053; color:white; }
      .quiz-option.is-incorrect { border-color:#b95c51; background:rgba(185,92,81,.12); }
      .quiz-option.is-incorrect .quiz-option-letter { background:#b95c51; color:white; }
      .quiz-explanation { width:100%; margin-top:22px; padding-top:20px; border-top:1px solid rgba(45,80,70,.15); }
      .quiz-explanation-label { display:block; margin-bottom:8px; color:var(--quiz-sage); font-size:9px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
      .quiz-explanation p { margin:0 0 22px; color:#52645e; font-size:14px; line-height:1.65; text-align:left; white-space:pre-line; }
      .quiz-cta { display:block; width:100%; max-width:320px; margin:0 auto; padding:15px 22px; border:0; border-radius:100px; background:var(--quiz-mint); color:var(--quiz-forest-dark); font-family:inherit; font-size:13px; font-weight:800; cursor:pointer; transition:transform 160ms ease, background 160ms ease, box-shadow 160ms ease; }
      .quiz-cta:hover { transform:translateY(-2px); background:var(--quiz-mint-bright); box-shadow:0 8px 20px rgba(45,80,70,.14); }
      .quiz-cta:active { transform:scale(.98); }
      .quiz-results-card { text-align:center; padding-top:clamp(32px,6vw,54px); padding-bottom:clamp(32px,6vw,54px); }
      
      .quiz-score { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; margin: 12px 0 18px; color: var(--quiz-sage); font-weight: 700; text-align: center; }
      .quiz-score-number { color: var(--quiz-forest); font-size: clamp(52px, 10vw, 72px); line-height: 1; letter-spacing: -0.06em; font-weight: 900; }
      .quiz-score-label { display: block; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--quiz-sage); }

      .quiz-subtext { max-width:470px; margin:0 auto 28px; color:#52645e; font-size:14px; line-height:1.65; }
      .quiz-footnote { display:flex; align-items:center; justify-content:center; gap:8px; margin:17px 8px 0; color:rgba(251,250,245,.58); font-size:10px; line-height:1.5; text-align:center; }
      .quiz-footnote-dot { width:5px; height:5px; flex:0 0 auto; border-radius:50%; background:var(--quiz-mint); }
      .quiz-message { display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:50vh; color:var(--quiz-white); font-size:14px; text-align:center; }
      .quiz-message p { line-height:1.6; }
      
      .quiz-footer {
        margin: 28px 0 0;
        padding-top: 20px;
        border-top: 1px solid rgba(245, 242, 232, 0.16);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        text-align: center;
      }
      .quiz-footer-brand { color: var(--quiz-mint-bright); font-size: 11px; font-weight: 800; letter-spacing: 0.15em; }
      .quiz-footer-tagline { color: rgba(245, 242, 232, 0.58); font-size: 11px; }

      @media (max-width:420px) { .quiz-card { border-radius:22px; } .quiz-topbar { gap:8px; } .quiz-brand { font-size:9px; letter-spacing:.1em; } .quiz-location-pill { font-size:9px; padding:7px 9px; } .quiz-option { font-size:13px; } }
      @media (prefers-reduced-motion:reduce) { .quiz-page *, .quiz-page *::before, .quiz-page *::after { transition-duration:.01ms !important; animation-duration:.01ms !important; animation-iteration-count:1 !important; } }
    `}</style>
  );
}