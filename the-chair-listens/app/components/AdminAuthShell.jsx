// Shared look for the admin onboarding pages (accept-invite, set-password).
export default function AdminAuthShell({ eyebrow = "Team access", title, script, children }) {
  return (
    <main className="aas-page">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap");
        :root {
          --forest: #2d5046;
          --forest-dark: #203f36;
          --mint: #8dcf94;
          --mint-bright: #a5dfa9;
          --powder-blue: #d4e9ed;
          --cream: #f5f2e8;
          --white: #fbfaf5;
          --ochre: #bc9553;
          --sage: #526b61;
        }
        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          background: var(--forest);
          min-height: 100vh;
          font-family: "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif;
        }
        button, input { font: inherit; }
        .aas-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--forest);
          color: var(--white);
          padding: max(16px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom));
        }
        .aas-shell { width: 100%; max-width: 420px; }
        .aas-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 6px 14px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }
        .aas-pill {
          color: var(--forest-dark);
          background: var(--mint);
          border-radius: 100px;
          padding: 6px 12px;
          font-size: 10px;
        }
        .aas-card {
          border-radius: 28px;
          background: var(--cream);
          color: var(--forest);
          padding: 32px 24px 28px;
          text-align: center;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
        }
        .aas-eyebrow {
          margin-bottom: 14px;
          color: var(--sage);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .aas-title {
          margin: 0;
          font-size: clamp(36px, 11vw, 48px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          font-weight: 900;
        }
        .aas-script {
          margin: 12px 0 20px;
          color: var(--ochre);
          font-family: "Pinyon Script", cursive;
          font-size: 32px;
          line-height: 1;
        }
        .aas-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
          border-radius: 22px;
          background: var(--forest-dark);
          color: var(--white);
          text-align: left;
        }
        .aas-label {
          color: var(--mint);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .aas-help { margin: 0; font-size: 12.5px; line-height: 1.4; color: rgba(251, 250, 245, 0.7); }
        .aas-input {
          width: 100%;
          min-height: 52px;
          padding: 14px 16px;
          border: 1px solid rgba(212, 233, 237, 0.25);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.07);
          color: var(--white);
          font-size: 16px;
        }
        .aas-input:focus {
          outline: none;
          border-color: var(--mint);
          box-shadow: 0 0 0 3px rgba(141, 207, 148, 0.25);
        }
        .aas-error { margin: 0; color: #ffb0a3; font-size: 12.5px; line-height: 1.4; }
        .aas-button {
          width: 100%;
          min-height: 52px;
          border: 0;
          border-radius: 100px;
          padding: 15px 20px;
          background: var(--mint);
          color: var(--forest-dark);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }
        .aas-button:hover:not(:disabled) { background: var(--mint-bright); }
        .aas-button:disabled { opacity: 0.35; cursor: not-allowed; }
        .aas-footer {
          padding: 24px 4px 8px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          font-weight: 600;
        }
      `}</style>

      <div className="aas-shell">
        <header className="aas-topbar">
          <span>The Chair Listens</span>
          <span className="aas-pill">Admin</span>
        </header>
        <section className="aas-card">
          <div className="aas-eyebrow">{eyebrow}</div>
          <h1 className="aas-title">{title}</h1>
          {script && <div className="aas-script">{script}</div>}
          {children}
        </section>
        <footer className="aas-footer">Factor of Ten · Authorised team only.</footer>
      </div>
    </main>
  );
}
