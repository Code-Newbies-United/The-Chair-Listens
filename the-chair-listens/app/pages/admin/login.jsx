// Destination: pages/admin/login.jsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/admin/dashboard");
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleLogin();
    }

    const disabled = loading || !password.trim();

    return (
        <main className="admin-page">
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap");

                :root {
                    --forest: #2d5046;
                    --forest-dark: #203f36;
                    --forest-deep: #19362f;

                    --mint: #8dcf94;
                    --mint-bright: #a5dfa9;

                    --powder-blue: #d4e9ed;
                    --powder-blue-dark: #b8dbe0;

                    --chair-blue: #315da8;
                    --chair-blue-dark: #24498c;
                    --chair-blue-light: #4775c5;

                    --cream: #f5f2e8;
                    --white: #fbfaf5;

                    --ochre: #bc9553;
                    --ochre-light: #d1b071;

                    --sage: #526b61;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    background: var(--forest);
                    min-height: 100vh;
                    font-family: "Plus Jakarta Sans", "Benton Sans", "Helvetica Neue", Arial, sans-serif;
                }

                body {
                    overflow-x: hidden;
                }

                button,
                input {
                    font: inherit;
                }

                /* ==================================================
                    PAGE
                ================================================== */

                .admin-page {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        radial-gradient(
                            circle at 100% 0%,
                            rgba(141, 207, 148, 0.2),
                            transparent 28%
                        ),
                        radial-gradient(
                            circle at 0% 90%,
                            rgba(212, 233, 237, 0.1),
                            transparent 25%
                        ),
                        var(--forest);
                    color: var(--white);
                    padding:
                        max(16px, env(safe-area-inset-top))
                        max(16px, env(safe-area-inset-right))
                        max(24px, env(safe-area-inset-bottom))
                        max(16px, env(safe-area-inset-left));
                }

                .admin-shell {
                    width: 100%;
                    max-width: 420px;
                    margin: 0 auto;
                }

                /* ==================================================
                    HEADER
                ================================================== */

                .admin-topbar {
                    min-height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 4px 6px 14px;
                }

                .admin-brand {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--white);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.13em;
                    text-transform: uppercase;
                }

                .admin-brand-logo {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 1px solid rgba(251, 250, 245, 0.55);
                }

                .admin-brand-mark {
                    width: 9px;
                    height: 9px;
                    flex: 0 0 auto;
                    border-radius: 50%;
                    background: var(--mint);
                    box-shadow:
                        0 0 0 4px rgba(141, 207, 148, 0.12),
                        0 0 18px rgba(141, 207, 148, 0.25);
                }

                .admin-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                    color: var(--forest-dark);
                    background: var(--mint);
                    border-radius: 100px;
                    padding: 6px 12px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                .admin-pill-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: var(--forest);
                }

                /* ==================================================
                    HERO CARD
                ================================================== */

                .admin-hero {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border-radius: 28px;
                    background: var(--cream);
                    color: var(--forest);
                    isolation: isolate;
                    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
                }

                .admin-hero::before {
                    content: "";
                    position: absolute;
                    width: 260px;
                    height: 260px;
                    border-radius: 50%;
                    background: var(--powder-blue);
                    top: -140px;
                    right: -110px;
                    z-index: -1;
                }

                .admin-hero::after {
                    content: "";
                    position: absolute;
                    width: 210px;
                    height: 210px;
                    border-radius: 50%;
                    background: var(--mint);
                    bottom: -130px;
                    left: -90px;
                    z-index: -1;
                }

                .admin-hero-copy {
                    padding: 32px 24px 28px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    position: relative;
                    z-index: 2;
                }

                .admin-eyebrow {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    margin-bottom: 16px;
                    color: var(--sage);
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                }

                .admin-eyebrow-line {
                    width: 25px;
                    height: 1px;
                    background: var(--ochre);
                }

                .admin-title {
                    margin: 0;
                    font-size: clamp(48px, 14vw, 62px);
                    line-height: 0.88;
                    letter-spacing: -0.05em;
                    font-weight: 900;
                    color: var(--forest);
                }

                .admin-title span {
                    display: block;
                    color: var(--mint);
                }

                .admin-script {
                    margin: 16px 0 20px;
                    color: var(--ochre);
                    font-family: "Pinyon Script", cursive;
                    font-size: 38px;
                    line-height: 1;
                }

                /* ==================================================
                    ACTION CARD (form)
                ================================================== */

                .admin-action {
                    position: relative;
                    z-index: 5;
                    width: 100%;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    border-radius: 22px;
                    background: var(--forest-dark);
                    box-shadow: 0 12px 28px rgba(17, 45, 37, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    text-align: left;
                }

                .admin-label {
                    color: var(--mint);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                }

                .admin-input {
                    width: 100%;
                    min-height: 52px;
                    padding: 14px 16px;
                    border: 1px solid rgba(212, 233, 237, 0.25);
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.07);
                    color: var(--white);
                    font-size: 16px;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }

                .admin-input::placeholder {
                    color: rgba(220, 233, 223, 0.45);
                }

                .admin-input:focus {
                    outline: none;
                    border-color: var(--mint);
                    box-shadow: 0 0 0 3px rgba(141, 207, 148, 0.25);
                }

                .admin-error {
                    margin: -4px 0 0;
                    color: #ffb0a3;
                    font-size: 12.5px;
                    line-height: 1.4;
                    text-align: left;
                }

                .admin-button {
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition:
                        transform 160ms ease,
                        background 160ms ease,
                        box-shadow 160ms ease,
                        opacity 160ms ease;
                }

                .admin-button:hover:not(:disabled) {
                    background: var(--mint-bright);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(141, 207, 148, 0.18);
                }

                .admin-button:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .admin-button:focus-visible {
                    outline: 2px solid var(--white);
                    outline-offset: 3px;
                }

                .admin-button:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                /* ==================================================
                    FOOTER
                ================================================== */

                .admin-footer {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    padding: 24px 4px 8px;
                    color: rgba(255, 255, 255, 0.45);
                    font-size: 9px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    text-align: center;
                    font-weight: 600;
                }

                @media (max-width: 360px) {
                    .admin-hero-copy {
                        padding-left: 18px;
                        padding-right: 18px;
                    }
                    .admin-title {
                        font-size: 44px;
                    }
                    .admin-script {
                        font-size: 32px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        scroll-behavior: auto !important;
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <div className="admin-shell">
                {/* HEADER */}
                <header className="admin-topbar">
                    <div className="admin-brand">
                        <img
                            className="admin-brand-logo"
                            src="/logos/factor-of-ten-logo-1.jpg"
                            alt="Factor of Ten Foundation logo"
                        />
                        <span className="admin-brand-mark" />
                        The Chair Listens
                    </div>
                    <div className="admin-pill">
                        Admin
                    </div>
                </header>

                {/* HERO */}
                <section className="admin-hero">
                    <div className="admin-hero-copy">
                        <div className="admin-eyebrow">
                            <span className="admin-eyebrow-line" />
                            Team access
                            <span className="admin-eyebrow-line" />
                        </div>

                        <h1 className="admin-title">
                            Admin
                            <span className="">Login</span>
                        </h1>

                        <div className="admin-script">Welcome back.</div>

                        {/* FORM */}
                        <div className="admin-action">
                            <label className="admin-label" htmlFor="admin-password">
                                Password
                            </label>

                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter password"
                                className="admin-input"
                                autoComplete="current-password"
                                autoFocus
                            />

                            {error && (
                                <p className="admin-error" role="alert">
                                    {error}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={disabled}
                                className="admin-button"
                            >
                                {loading ? "Checking..." : "Log in"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="admin-footer">
                    <span>FACTOR OF TEN</span>
                    <span>Authorised team only.</span>
                </footer>
            </div>
        </main>
    );
}