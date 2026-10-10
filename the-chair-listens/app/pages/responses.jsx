import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResponsesPage({ locationName = "Pretoria" }) {
  const router = useRouter();
  const { script, data } = router.query;
  const displayLocation = router.query.location || locationName;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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
            script: script || "men_mental_health",
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

  return (
      <main className="responses-page">
        <div className="responses-shell">
          <header className="topbar">
            <div className="brand" aria-label="The Chair Listens">
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
                <div className="completion-icon" aria-hidden="true">✓</div>
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
                  </div>
              )}

              <footer className="card-footer">
                <span className="footer-rule" />
                <p>You showed up. That matters.</p>
                <span className="footer-rule" />
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
          <p className="page-note">A quiet place in a noisy world.</p>
        </div>

        <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Pinyon+Script&display=swap');

        .responses-page {
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          padding: 28px 20px 42px;
          color: #203f36;
          font-family: "Benton Sans", "Helvetica Neue", Arial, sans-serif;
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
          width: 43px;
          height: 43px;
          margin: 0 auto 14px;
          border: 1px solid rgba(45, 80, 70, 0.12);
          border-radius: 50%;
          background: #dce9df;
          color: #2d5046;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 5px 14px rgba(45, 80, 70, 0.08);
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
          font-family: "Pinyon Script", cursive;
          font-size: 23px;
          white-space: nowrap;
        }

        .footer-rule { width: 27px; height: 1px; background: #bc9553; opacity: 0.7; }

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
        .page-note { margin: 15px 0 0; color: rgba(245, 242, 232, 0.72); font-size: 12px; text-align: center; }

        @keyframes loading {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(340%); }
        }

        @media (max-width: 560px) {
          .responses-page { padding: 18px 13px 30px; }
          .topbar { align-items: flex-start; }
          .brand-mark { padding-top: 8px; font-size: 11px; }
          .location-pill { max-width: 55%; padding: 8px 10px; font-size: 11px; }
          .card-content { padding: 27px 20px 24px; }
          .session-meta { margin-bottom: 25px; }
          .eyebrow { font-size: 9px; }
          .headline { font-size: 41px; }
          .script-line { font-size: 36px; }
          .summary-content { padding: 20px 17px; }
          .summary-text { font-size: 14px; }
          .card-footer { gap: 8px; }
          .card-footer p { font-size: 20px; }
          .footer-rule { width: 18px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-track span { animation: none; }
          .home-button, .take-action-button { transition: none; }
        }
      `}</style>
      </main>
  );
}
