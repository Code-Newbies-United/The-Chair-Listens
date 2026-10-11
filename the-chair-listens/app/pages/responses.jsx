import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResponsesPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const { script, data } = router.query;
  const displayLocation = router.query.location || locationName;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const currentScript = script || "men_mental_health";

  useEffect(() => {
    if (!router.isReady) return;

    async function fetchSessionSummary() {
      let parsedAnswers = [];
      if (data) {
        try {
          parsedAnswers = JSON.parse(decodeURIComponent(data));
        } catch (e) {
          console.error("Failed to parse answers", e);
        }
      }

      try {
        const res = await fetch("/api/session-reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script: currentScript,
            answers: parsedAnswers,
          }),
        });

        const result = await res.json();
        setSummary(result);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setSummary({
          overallReflection:
            "Thank you for taking the time to share your perspective today.",
          takeaways: [
            "Acknowledging your journey is an important step forward.",
            "Your voice contributes meaningfully to our collective healing.",
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSessionSummary();
  }, [router.isReady, script, data]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.length > 1000) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setMessage("");
    } catch (err) {
      console.error("Error submitting message:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="responses-page">
      <div className="responses-shell">
        <header className="topbar">
          <div className="brand" aria-label="The Chair Listens">
            <img
              className="brand-logo"
              src="/logos/factor-of-ten-logo.jpg"
              alt="Factor of Ten Foundation logo"
            />
            <span className="brand-mark" aria-hidden="true" />
            <span>The Chair Listens</span>
          </div>
          <div className="location-pill">
            <span className="location-dot" />
            {displayLocation}
          </div>
        </header>

        <section className="reflection-card">
          <div className="decor-circle decor-circle-blue" aria-hidden="true" />
          <div className="decor-circle decor-circle-mint" aria-hidden="true" />

          <div className="card-content">
            <div className="session-meta">
              <div className="eyebrow">
                <span className="eyebrow-line" aria-hidden="true" />
                <span>A moment to reflect</span>
                <span className="eyebrow-line" aria-hidden="true" />
              </div>
            </div>

            <div className="intro">
              <div className="completion-icon" aria-hidden="true">
                <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                  <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="script-line">Session complete</div>
              <h1 className="headline">
                Your
                <span className="headline-accent">Reflection</span>
              </h1>
              <p className="intro-copy">
                Thank you for making space for your thoughts, your story, and your voice.
              </p>
            </div>

            {loading ? (
              <div className="loading-panel" role="status" aria-live="polite">
                <div className="chair-icon" aria-hidden="true">🪑</div>
                <div className="loading-track"><span /></div>
                <p>The Chair is bringing your reflection together...</p>
              </div>
            ) : (
              <div className="summary-content">
                <section className="summary-section">
                  <div className="section-heading">
                    <span className="section-icon" aria-hidden="true">✧</span>
                    <h2>Summary</h2>
                  </div>
                  <p className="summary-text">
                    {summary?.overallReflection ||
                      "Thank you for taking the time to share your perspective today."}
                  </p>
                </section>

                <div className="section-divider" />

                <section className="summary-section takeaways-section">
                  <div className="section-heading">
                    <span className="section-icon" aria-hidden="true">✦</span>
                    <h2>Key Takeaways</h2>
                  </div>
                  {summary?.takeaways?.length ? (
                    <ul className="takeaway-list">
                      {summary.takeaways.map((item, index) => (
                        <li key={index} className="takeaway-item">
                          <span className="takeaway-bullet" aria-hidden="true">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="summary-text">
                      Your reflections are part of the conversation and can help create understanding.
                    </p>
                  )}
                </section>

                <div className="section-divider" />

                <section className="summary-section message-section">
                  <div className="section-heading">
                    <span className="section-icon" aria-hidden="true">✎</span>
                    <h2>Leave a Message for the Community</h2>
                  </div>

                  {submitStatus === "success" ? (
                    <div className="success-message">
                      <p>Thank you. Your message has been shared with the community.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleMessageSubmit} className="message-form">
                      <textarea
                        className="message-input"
                        placeholder="Share a thought, a word of encouragement, or a piece of your story..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={1000}
                        rows={4}
                        disabled={isSubmitting}
                      />
                      <div className="message-footer">
                        <span className={`char-count ${message.length > 900 ? "warning" : ""}`}>
                          {message.length} / 1000
                        </span>
                        <button
                          type="submit"
                          className="submit-message-button"
                          disabled={isSubmitting || !message.trim() || message.length > 1000}
                        >
                          {isSubmitting ? "Sending..." : "Share Message"}
                        </button>
                      </div>
                      {submitStatus === "error" && (
                        <p className="error-text">Something went wrong. Please try again.</p>
                      )}
                    </form>
                  )}
                </section>
              </div>
            )}

            <footer className="card-footer">
              <p>You showed up. That matters.</p>
            </footer>
          </div>
        </section>

        <button
          type="button"
          onClick={() => router.push("/take-action")}
          className="take-action-button"
        >
          <span aria-hidden="true">✦</span>
          <span>Take Action</span>
          <span className="button-arrow" aria-hidden="true"></span>
        </button>
        <button type="button" onClick={() => router.push("/")} className="home-button">
          <span>Return to Start</span>
          <span className="button-arrow" aria-hidden="true"></span>
        </button>

        <footer className="responses-footer">
          <span className="responses-footer-brand">FACTOR OF TEN</span>
          <span className="responses-footer-tagline">Know more. Ask more. Check sooner.</span>
        </footer>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Pinyon+Script&display=swap');

        .responses-page {
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          padding: 28px 20px 42px;
          color: #203f36;
          font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
          background:
            radial-gradient(circle at 100% 0%, rgba(141, 207, 148, 0.2), transparent 28%),
            radial-gradient(circle at 0% 90%, rgba(212, 233, 237, 0.1), transparent 25%),
            #2d5046;
        }

        .responses-shell {
          width: min(100%, 680px);
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fbfaf5;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .brand-logo {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(245, 242, 232, 0.55);
        }

        .brand-mark {
          width: 9px;
          height: 9px;
          flex: 0 0 9px;
          border-radius: 50%;
          background: #8dcf94;
          box-shadow: 0 0 0 4px rgba(141, 207, 148, 0.12),
                    0 0 18px rgba(141, 207, 148, 0.25);
        }

        .location-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 7px 10px;
          border-radius: 100px;
          background: #8dcf94;
          color: #203f36;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .location-dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #2d5046;
        }

        .reflection-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: 27px;
          background: #f5f2e8;
          box-shadow: 0 20px 50px rgba(17, 45, 37, 0.3);
        }

        .card-content {
          position: relative;
          z-index: 1;
          padding: 34px 42px 28px;
        }

        .decor-circle {
          position: absolute;
          z-index: -1;
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

        .session-meta {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 28px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #526b61;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
          line-height: 1.4;
          text-transform: uppercase;
          text-align: center;
        }

        .eyebrow-line {
          width: 25px;
          height: 1px;
          flex: 0 0 25px;
          background: #bc9553;
        }

        .intro { max-width: 500px; margin: 0 auto; text-align: center; }

        .completion-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: rgba(141, 207, 148, .28);
          color: #2d5046;
          border: 1px solid rgba(45, 80, 70, 0.12);
        }

        .script-line {
          margin: 5px 0 19px;
          color: #bc9553;
          font-family: "Pinyon Script", cursive;
          font-size: 40px;
          line-height: 1;
        }

        .headline {
          max-width: 760px;
          margin: 0;
          color: #203f36;
          font-size: clamp(41px, 10vw, 72px);
          line-height: 0.88;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .headline-accent {
          display: block;
          color: #8dcf94;
        }

        .intro-copy {
          max-width: 390px;
          margin: 17px auto 0;
          color: #52645e;
          font-size: 14px;
          line-height: 1.7;
        }

        .loading-panel {
          margin-top: 30px;
          padding: 27px 20px;
          border: 1px solid rgba(45, 80, 70, 0.08);
          border-radius: 20px;
          background: rgba(251, 250, 245, 0.8);
          text-align: center;
        }

        .chair-icon { margin-bottom: 10px; font-size: 31px; }
        .loading-panel p { margin: 12px 0 0; color: #52645e; font-size: 13px; }

        .loading-track {
          width: min(100%, 190px);
          height: 5px;
          overflow: hidden;
          margin: 0 auto;
          border-radius: 999px;
          background: #dce9df;
        }

        .loading-track span {
          display: block;
          width: 42%;
          height: 100%;
          border-radius: inherit;
          background: #8dcf94;
          animation: loading 1.4s ease-in-out infinite;
        }

        .summary-content {
          margin-top: 29px;
          padding: 25px;
          border: 1px solid rgba(45, 80, 70, 0.08);
          border-radius: 21px;
          background: rgba(251, 250, 245, 0.8);
          box-shadow: 0 12px 30px rgba(17, 45, 37, 0.06);
        }

        .section-heading { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
        .section-icon { color: #bc9553; font-size: 19px; }
        h2 {
          margin: 0;
          color: #2d5046;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .summary-text {
          margin: 0;
          color: #52645e;
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .section-divider { height: 1px; margin: 23px 0; background: rgba(45, 80, 70, 0.13); }
        .takeaway-list { display: flex; flex-direction: column; gap: 13px; margin: 0; padding: 0; list-style: none; }
        .takeaway-item { display: flex; align-items: flex-start; gap: 11px; color: #31504a; font-size: 14px; line-height: 1.65; }
        .takeaway-bullet { flex: 0 0 auto; margin-top: 2px; color: #bc9553; font-size: 13px; }

        .message-section { margin-top: 5px; }

        .message-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          border: 1px solid rgba(45, 80, 70, 0.15);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.6);
          color: #203f36;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
          resize: vertical;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .message-input:focus {
          outline: none;
          border-color: #8dcf94;
          box-shadow: 0 0 0 3px rgba(141, 207, 148, 0.2);
          background: #fff;
        }

        .message-input::placeholder {
          color: #8ba39a;
        }

        .message-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .char-count {
          font-size: 11px;
          color: #8ba39a;
          font-weight: 600;
        }

        .char-count.warning {
          color: #bc9553;
        }

        .submit-message-button {
          padding: 8px 16px;
          border: none;
          border-radius: 999px;
          background: #2d5046;
          color: #fbfaf5;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, opacity 0.2s ease;
        }

        .submit-message-button:hover:not(:disabled) {
          background: #203f36;
        }

        .submit-message-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .success-message {
          padding: 15px;
          border-radius: 12px;
          background: #dce9df;
          color: #2d5046;
          font-size: 14px;
          text-align: center;
          font-weight: 500;
        }

        .success-message p { margin: 0; }

        .error-text {
          margin: 0;
          color: #d9534f;
          font-size: 12px;
          text-align: right;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
        }

        .card-footer p {
          margin: 0;
          color: #526b61;
          font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .take-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          margin-top: 23px;
          padding: 15px 22px;
          border: 1px solid rgba(245, 242, 232, 0.28);
          border-radius: 999px;
          background: rgba(245, 242, 232, 0.08);
          color: #fbfaf5;
          font: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
        }

        .take-action-button:hover {
          transform: translateY(-2px);
          background: rgba(141, 207, 148, 0.16);
          border-color: #8dcf94;
        }

        .take-action-button:focus-visible {
          outline: 3px solid #d4e9ed;
          outline-offset: 4px;
        }

        .home-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          width: 100%;
          margin-top: 23px;
          padding: 15px 22px;
          border: 0;
          border-radius: 999px;
          background: #8dcf94;
          color: #203f36;
          font: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(141, 207, 148, 0.18);
          transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .home-button:hover { transform: translateY(-2px); background: #a5dfa9; box-shadow: 0 10px 24px rgba(17, 45, 37, 0.18); }
        .home-button:focus-visible { outline: 3px solid #d4e9ed; outline-offset: 4px; }
        .button-arrow { font-size: 19px; line-height: 1; }

        .responses-footer {
          margin: 24px 0 0;
          padding-top: 20px;
          border-top: 1px solid rgba(245,242,232,.16);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
        }
        .responses-footer-brand { color: #a5dfa9; font-size: 11px; font-weight: 800; letter-spacing: .15em; }
        .responses-footer-tagline { color: rgba(245,242,232,.58); font-size: 11px; }

        @keyframes loading {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(340%); }
        }

        @media (max-width: 390px) {
          .brand-logo { width: 29px; height: 29px; flex-basis: 29px; }
        }

        @media (max-width: 560px) {
          .responses-page { padding: 18px 13px 30px; }
          .topbar { align-items: flex-start; }
          .location-pill { max-width: 55%; padding: 8px 10px; font-size: 11px; }
          .card-content { padding: 27px 20px 24px; }
          .session-meta { margin-bottom: 25px; }
          .eyebrow { font-size: 9px; }
          .headline { font-size: 41px; }
          .script-line { font-size: 36px; }
          .summary-content { padding: 20px 17px; }
          .summary-text { font-size: 14px; }
          .card-footer { gap: 8px; }
          .message-footer { flex-direction: column; align-items: flex-end; gap: 8px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-track span { animation: none; }
          .home-button, .take-action-button { transition: none; }
        }
      `}</style>
    </main>
  );
}