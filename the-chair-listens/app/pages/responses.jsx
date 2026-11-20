// Destination: pages/responses.jsx  (replaces the old copy of questions.jsx)
// Flow: questions -> insight -> responses (Moment of Reflection) -> take-action -> stay-connected
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const SCRIPT_TITLES = {
    men_mental_health: "For Men",
    ally_support: "Ally & Support System",
    fast_track_activations: "Today's Event",
};

const FALLBACK_REFLECTION = {
    body: "Thank you for taking the time to pause and share your thoughts today.",
    takeaways: [
        "Your experiences and feelings are valid.",
        "Taking time for self-reflection is an important step forward.",
    ],
    crisis: false,
};

// Query values may have been encoded twice on the way in, so decode defensively.
function safeDecode(value) {
    if (typeof value !== "string") return "";
    try {
        return decodeURIComponent(value);
    } catch (_) {
        return value;
    }
}

function safeParseJSON(value) {
    if (!value) return null;
    try {
        return JSON.parse(safeDecode(value));
    } catch (_) {
        return null;
    }
}

// /api/session-reflection returns { overallReflection, takeaways: string[], crisis? }.
// It also returns the same shape (without crisis) with a 500 if the AI is down.
function normalizeReflection(raw) {
    if (!raw || typeof raw !== "object") return null;

    const body = typeof raw.overallReflection === "string" ? raw.overallReflection.trim() : "";
    const takeaways = (Array.isArray(raw.takeaways) ? raw.takeaways : [])
        .filter((t) => typeof t === "string" && t.trim())
        .map((t) => t.trim())
        .slice(0, 3);

    if (!body && !takeaways.length) return null;
    return { body, takeaways, crisis: raw.crisis === true };
}

export default function ResponsesPage({ locationName = "Pretoria" }) {
    const router = useRouter();
    const [reflection, setReflection] = useState(null);
    const [loading, setLoading] = useState(true);

    const script =
        typeof router.query.script === "string" ? safeDecode(router.query.script) : "men_mental_health";
    const trackTitle = SCRIPT_TITLES[script] || "For Men";
    const location =
        typeof router.query.location === "string" ? safeDecode(router.query.location) : locationName;

    // Keep the same params so Back and Continue don't lose the session context.
    const carryQuery = useMemo(() => {
        const query = {};
        ["script", "data", "location", "summary"].forEach((key) => {
            if (typeof router.query[key] === "string") query[key] = router.query[key];
        });
        return query;
    }, [router.query]);

    useEffect(() => {
        if (!router.isReady) return;
        let cancelled = false;

        const load = async () => {
            // 1. Use the summary already generated when the questions were finished.
            const passed = normalizeReflection(safeParseJSON(router.query.summary));
            if (passed) {
                if (!cancelled) {
                    setReflection(passed);
                    setLoading(false);
                }
                return;
            }

            // 2. Otherwise try to generate it from the answers.
            const answers = safeParseJSON(router.query.data);
            if (Array.isArray(answers) && answers.length) {
                try {
                    const res = await fetch("/api/session-reflection", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ script, answers }),
                    });
                    if (res.ok) {
                        const generated = normalizeReflection(await res.json());
                        if (generated && !cancelled) {
                            setReflection(generated);
                            setLoading(false);
                            return;
                        }
                    }
                } catch (err) {
                    console.error("Reflection generation error:", err);
                }
            }

            // 3. Never block the flow: show a general closing message.
            if (!cancelled) {
                setReflection(FALLBACK_REFLECTION);
                setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    if (!router.isReady) return null;

    const goBack = () => router.push({ pathname: "/insight", query: carryQuery });
    const goNext = () => router.push({ pathname: "/take-action", query: carryQuery });

    return (
        <main className="reflect-page">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&family=Pinyon+Script&display=swap');
        :root {
          --rf-forest: #2d5046;
          --rf-forest-dark: #203f36;
          --rf-mint: #8dcf94;
          --rf-mint-bright: #a5dfa9;
          --rf-blue: #d4e9ed;
          --rf-cream: #f5f2e8;
          --rf-white: #fbfaf5;
          --rf-ochre: #bc9553;
          --rf-sage: #526b61;
        }
        .reflect-page, .reflect-page * { box-sizing: border-box; }
        .reflect-page {
          min-height: 100dvh;
          width: 100%;
          padding: max(18px, env(safe-area-inset-top)) max(13px, env(safe-area-inset-right)) max(30px, env(safe-area-inset-bottom)) max(13px, env(safe-area-inset-left));
          color: var(--rf-white);
          font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(circle at 100% 0%, rgba(141,207,148,.2), transparent 28%), radial-gradient(circle at 0% 90%, rgba(212,233,237,.1), transparent 25%), var(--rf-forest);
        }
        .rf-shell { width: min(100%, 760px); margin: 0 auto; }
        .rf-topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; padding:4px 3px 14px; }
        .rf-brand { display:flex; align-items:center; gap:8px; font-size:10px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
        .rf-brand-logo { width:34px; height:34px; flex:0 0 34px; border-radius:50%; object-fit:cover; border:1px solid rgba(245,242,232,.55); }
        .rf-brand-mark { width:9px; height:9px; flex:0 0 9px; border-radius:50%; background:var(--rf-mint); box-shadow:0 0 0 4px rgba(141,207,148,.12), 0 0 18px rgba(141,207,148,.25); }
        .rf-location { display:inline-flex; align-items:center; gap:6px; max-width:55%; padding:7px 11px; border-radius:999px; background:var(--rf-mint); color:var(--rf-forest-dark); font-size:9px; font-weight:800; letter-spacing:.04em; }
        .rf-location-dot { width:5px; height:5px; flex:0 0 5px; border-radius:50%; background:var(--rf-forest); }
        .rf-back { display:inline-flex; align-items:center; gap:8px; margin:0 0 18px 3px; padding:0; border:0; background:transparent; color:rgba(251,250,245,.78); font:inherit; font-size:13px; font-weight:600; cursor:pointer; }
        .rf-back:hover { color:var(--rf-mint-bright); }
        .rf-card { position:relative; isolation:isolate; overflow:hidden; border-radius:27px; background:var(--rf-cream); color:var(--rf-forest-dark); box-shadow:0 20px 50px rgba(17,45,37,.25); }
        .rf-card::before, .rf-card::after { content:""; position:absolute; z-index:-1; border-radius:50%; pointer-events:none; }
        .rf-card::before { width:310px; height:310px; top:-180px; right:-140px; background:var(--rf-blue); }
        .rf-card::after { width:270px; height:270px; bottom:-190px; left:-145px; background:var(--rf-mint); opacity:.65; }
        .rf-content { position:relative; z-index:1; padding:42px 42px 34px; }
        .rf-eyebrow { display:flex; align-items:center; justify-content:center; gap:9px; margin:0 0 20px; color:var(--rf-sage); font-size:9px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; text-align:center; }
        .rf-eyebrow-line { width:25px; height:1px; flex:0 0 25px; background:var(--rf-ochre); }
        .rf-intro { max-width:610px; margin:0 auto 28px; text-align:center; }
        .rf-headline { margin:0; color:var(--rf-forest-dark); font-size:clamp(40px, 8vw, 66px); line-height:.93; letter-spacing:-.06em; font-weight:900; }
        .rf-script { margin:17px 0 0; color:var(--rf-ochre); font-family:"Pinyon Script", cursive; font-size:36px; line-height:1.05; }
        .rf-panel { padding:26px; border:1px solid rgba(45,80,70,.12); border-radius:22px; background:rgba(251,250,245,.82); box-shadow:0 12px 30px rgba(17,45,37,.06); }
        .rf-body { margin:0; color:#3f524c; font-size:16px; line-height:1.75; white-space:pre-line; }
        .rf-takeaways { display:flex; flex-direction:column; gap:12px; margin:22px 0 0; padding:20px 0 0; border-top:1px solid rgba(45,80,70,.12); list-style:none; }
        .rf-takeaways li { display:flex; align-items:flex-start; gap:10px; color:var(--rf-forest-dark); font-size:14px; line-height:1.65; font-weight:600; }
        .rf-takeaways li::before { content:"✦"; flex:0 0 auto; margin-top:1px; color:var(--rf-ochre); font-size:13px; }
        .rf-support { display:flex; align-items:center; justify-content:center; margin:22px 0 0; padding:14px 20px; border-radius:999px; background:var(--rf-forest-dark); color:var(--rf-white); font-size:14px; font-weight:800; text-decoration:none; }
        .rf-support:focus-visible { outline:3px solid var(--rf-ochre); outline-offset:4px; }
        .rf-loading { display:flex; align-items:center; justify-content:center; gap:7px; min-height:120px; }
        .rf-loading span { width:9px; height:9px; border-radius:50%; background:var(--rf-forest); animation: rfPulse 1s ease-in-out infinite; }
        .rf-loading span:nth-child(2) { animation-delay:.15s; }
        .rf-loading span:nth-child(3) { animation-delay:.3s; }
        @keyframes rfPulse { 0%,100% { opacity:.25; transform:scale(.8); } 50% { opacity:1; transform:scale(1); } }
        .rf-after { display:flex; flex-direction:column; align-items:center; padding-top:24px; }
        .rf-continue { display:inline-flex; align-items:center; justify-content:center; width:min(100%, 360px); padding:15px 24px; border:0; border-radius:999px; background:var(--rf-mint); color:var(--rf-forest-dark); font:inherit; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 7px 0 rgba(32,63,54,.18), 0 10px 22px rgba(17,45,37,.2); transition:transform 160ms ease, background 160ms ease; }
        .rf-continue:hover:not(:disabled) { transform:translateY(-2px); background:var(--rf-mint-bright); }
        .rf-continue:disabled { opacity:.5; cursor:default; }
        .rf-continue:focus-visible, .rf-back:focus-visible { outline:3px solid var(--rf-ochre); outline-offset:4px; }
        .rf-footer { margin:24px 0 0; padding-top:20px; border-top:1px solid rgba(245,242,232,.16); display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; }
        .rf-footer-brand { color:var(--rf-mint-bright); font-size:11px; font-weight:800; letter-spacing:.15em; }
        .rf-footer-tagline { color:rgba(245,242,232,.58); font-size:11px; }
        @media (max-width:600px) { .rf-content { padding:32px 20px 25px; } .rf-panel { padding:21px 17px; } .rf-body { font-size:15px; } .rf-script { font-size:32px; } }
        @media (prefers-reduced-motion:reduce) { .rf-continue { transition:none; } .rf-loading span { animation:none; opacity:.7; } }
      `}</style>

            <div className="rf-shell">
                <header className="rf-topbar">
                    <div className="rf-brand">
                        <img className="rf-brand-logo" src="/logos/factor-of-ten-logo.jpg" alt="Factor of Ten Foundation logo" />
                        <span className="rf-brand-mark" aria-hidden="true" />
                        The Chair Listens
                    </div>
                    <div className="rf-location">
                        <span className="rf-location-dot" aria-hidden="true" />
                        {location}
                    </div>
                </header>

                <button type="button" className="rf-back" onClick={goBack}>⮜ Back</button>

                <section className="rf-card">
                    <div className="rf-content">
                        <div className="rf-eyebrow">
                            <span className="rf-eyebrow-line" />
                            Moment of Reflection
                            <span className="rf-eyebrow-line" />
                        </div>

                        <div className="rf-intro">
                            <h1 className="rf-headline">What you shared today.</h1>
                            <div className="rf-script">{trackTitle}</div>
                        </div>

                        <section className="rf-panel" aria-live="polite" aria-busy={loading}>
                            {loading ? (
                                <div className="rf-loading" role="status" aria-label="Preparing your reflection">
                                    <span /><span /><span />
                                </div>
                            ) : (
                                <>
                                    {reflection?.body && <p className="rf-body">{reflection.body}</p>}
                                    {reflection?.takeaways?.length > 0 && (
                                        <ul className="rf-takeaways" aria-label="Key takeaways from your session">
                                            {reflection.takeaways.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {reflection?.crisis && (
                                        <a href="/emergency" className="rf-support">
                                            Get support now
                                        </a>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </section>

                <div className="rf-after">
                    <button type="button" className="rf-continue" onClick={goNext} disabled={loading}>
                        Continue
                    </button>
                </div>

                <footer className="rf-footer">
                    <span className="rf-footer-brand">FACTOR OF TEN</span>
                    <span className="rf-footer-tagline">Know more. Ask more. Check sooner.</span>
                </footer>
            </div>
        </main>
    );
}
