// Destination: pages/stay-connected.jsx
import { useState } from "react";
import { LINKS } from "@/lib/campaignLinks";

function InstagramIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V23h-4V8z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.5 22v-8.5h2.85l.43-3.3h-3.28V8.05c0-.96.27-1.61 1.64-1.61h1.75V3.5c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.36v2.43H7.24v3.3h2.85V22h3.41z" />
        </svg>
    );
}

export default function StayConnected() {
    const [shareFeedback, setShareFeedback] = useState("");

    async function handleShare() {
        const shareData = {
            title: "The Chair Listens",
            text: "Take a seat. Check in. Start the conversation. Pass it on.",
            url: LINKS.shareUrl,
        };

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // The visitor may have cancelled the native share sheet.
            }
        } else {
            try {
                await navigator.clipboard.writeText(LINKS.shareUrl);
                setShareFeedback("Link copied to clipboard");
                setTimeout(() => setShareFeedback(""), 2500);
            } catch (err) {
                setShareFeedback("Could not copy link");
            }
        }
    }

    return (
        <main className="stay-page">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&family=Pinyon+Script&display=swap');
        .stay-page, .stay-page * { box-sizing: border-box; }
        .stay-page {
          --stay-forest: #2d5046;
          --stay-dark: #203f36;
          --stay-deep: #19362f;
          --stay-mint: #8dcf94;
          --stay-bright: #a5dfa9;
          --stay-cream: #f5f2e8;
          --stay-white: #fbfaf5;
          --stay-ochre: #bc9553;
          --stay-sage: #526b61;
          min-height: 100dvh;
          width: 100%;
          padding: max(18px, env(safe-area-inset-top)) max(13px, env(safe-area-inset-right)) max(30px, env(safe-area-inset-bottom)) max(13px, env(safe-area-inset-left));
          color: var(--stay-white);
          font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
          background: radial-gradient(circle at 100% 0%, rgba(141,207,148,.2), transparent 28%), radial-gradient(circle at 0% 90%, rgba(212,233,237,.1), transparent 25%), var(--stay-forest);
        }
        .stay-shell { width: min(100%, 760px); margin: 0 auto; }
        .stay-topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin:0 0 20px; padding:4px 3px 14px; }
        .stay-brand { display:flex; align-items:center; gap:8px; color:var(--stay-white); font-size:10px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
        .stay-brand-mark { width:9px; height:9px; flex:0 0 9px; border-radius:50%; background:var(--stay-mint); box-shadow:0 0 0 4px rgba(141,207,148,.12), 0 0 18px rgba(141,207,148,.25); }
        .stay-location { display:inline-flex; align-items:center; gap:7px; max-width:55%; min-width:0; padding:8px 12px; border:1px solid rgba(32,63,54,.1); border-radius:999px; background:var(--stay-mint); color:var(--stay-dark); font-size:10px; font-weight:800; letter-spacing:.035em; white-space:nowrap; }
        .stay-pin { display:block; width:13px; height:13px; flex:0 0 13px; }
        .stay-location-text { overflow:hidden; text-overflow:ellipsis; }
        .stay-back { display:inline-flex; align-items:center; gap:8px; margin:0 0 18px 3px; color:rgba(251,250,245,.78); font-size:13px; font-weight:600; text-decoration:none; transition:color 150ms ease; }
        .stay-back:hover { color:var(--stay-bright); }
        .stay-card { position:relative; isolation:isolate; overflow:hidden; border-radius:27px; background:var(--stay-cream); color:var(--stay-dark); box-shadow:0 20px 50px rgba(17,45,37,.25); }
        .stay-card::before, .stay-card::after { content:''; position:absolute; z-index:-1; border-radius:50%; pointer-events:none; }
        .stay-card::before { width:310px; height:310px; top:-180px; right:-140px; background:#d4e9ed; }
        .stay-card::after { width:270px; height:270px; bottom:-190px; left:-145px; background:var(--stay-mint); opacity:.55; }
        .stay-content { position:relative; z-index:1; padding:42px 42px 36px; }
        .stay-eyebrow { display:flex; align-items:center; justify-content:center; gap:9px; margin:0 0 22px; color:var(--stay-sage); font-size:9px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; text-align:center; }
        .stay-eyebrow-line { width:25px; height:1px; flex:0 0 25px; background:var(--stay-ochre); }
        .stay-intro { max-width:600px; margin:0 auto 30px; text-align:center; }
        .stay-title { margin:0; color:var(--stay-dark); font-size:clamp(40px, 7vw, 65px); line-height:.98; letter-spacing:-.055em; font-weight:900; }
        .stay-script { margin:15px 0 12px; color:var(--stay-ochre); font-family:'Pinyon Script', cursive; font-size:38px; line-height:1.08; }
        .stay-body { max-width:490px; margin:0 auto; color:#52645e; font-size:15px; line-height:1.7; }
        .stay-social-panel { padding:24px; border:1px solid rgba(45,80,70,.12); border-radius:22px; background:rgba(251,250,245,.84); box-shadow:0 12px 30px rgba(17,45,37,.06); }
        .stay-follow-label { display:block; margin:0 0 15px; color:var(--stay-sage); font-size:10px; font-weight:800; letter-spacing:.14em; text-align:center; text-transform:uppercase; }
        .stay-icon-row { display:flex; justify-content:center; gap:13px; margin:0 0 24px; }
        .stay-social-icon { display:flex; align-items:center; justify-content:center; width:49px; height:49px; border:1px solid rgba(45,80,70,.22); border-radius:50%; background:rgba(141,207,148,.18); color:var(--stay-forest); text-decoration:none; transition:transform 160ms ease, background 160ms ease, border-color 160ms ease; }
        .stay-social-icon:hover { transform:translateY(-3px); background:rgba(141,207,148,.4); border-color:var(--stay-mint); }
        .stay-share { display:flex; align-items:center; justify-content:center; gap:9px; width:100%; padding:14px 18px; border:0; border-radius:999px; background:var(--stay-mint); color:var(--stay-dark); font:inherit; font-size:13px; font-weight:800; cursor:pointer; box-shadow:0 7px 0 rgba(32,63,54,.1), 0 10px 22px rgba(45,80,70,.1); transition:transform 160ms ease, background 160ms ease, box-shadow 160ms ease; }
        .stay-share:hover { transform:translateY(-2px); background:var(--stay-bright); box-shadow:0 9px 0 rgba(32,63,54,.1), 0 15px 28px rgba(45,80,70,.13); }
        .stay-feedback { margin:12px 0 0; color:var(--stay-sage); font-size:12px; text-align:center; }
        .stay-continue-wrap { display:flex; justify-content:center; padding-top:24px; }
        .stay-continue { display:inline-flex; align-items:center; gap:9px; color:var(--stay-bright); font-size:14px; font-weight:700; text-decoration:none; }
        .stay-continue:hover { text-decoration:underline; text-underline-offset:4px; }
        .stay-back:focus-visible, .stay-social-icon:focus-visible, .stay-share:focus-visible, .stay-continue:focus-visible { outline:3px solid var(--stay-ochre); outline-offset:4px; }
        .stay-footer { margin:22px 0 0; color:rgba(245,242,232,.58); font-size:10px; letter-spacing:.08em; text-align:center; }
        @media (max-width:600px) { .stay-content { padding:32px 20px 24px; } .stay-social-panel { padding:21px 17px; } .stay-title { font-size:clamp(38px, 10vw, 54px); } .stay-script { font-size:34px; } .stay-body { font-size:14px; } }
        @media (prefers-reduced-motion:reduce) { .stay-back, .stay-social-icon, .stay-share { transition:none; } }
      `}</style>

            <div className="stay-shell">
                <header className="stay-topbar">
                    <div className="stay-brand"><span className="stay-brand-mark" aria-hidden="true" />The Chair Listens</div>
                    <div className="stay-location" aria-label="Campaign location">
                        <svg className="stay-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                        </svg>
                        <span className="stay-location-text">The Blue Chair</span>
                    </div>
                </header>

                <a href="/take-action" className="stay-back">‹‹ Back</a>

                <section className="stay-card">
                    <div className="stay-content">
                        <div className="stay-eyebrow"><span className="stay-eyebrow-line" />Stay Connected<span className="stay-eyebrow-line" /></div>
                        <div className="stay-intro">
                            <h1 className="stay-title">The conversation<br />doesn’t end here.</h1>
                            <div className="stay-script">Keep showing up. Keep listening.</div>
                            <p className="stay-body">
                                Follow Factor of Ten and continue the conversation around men’s health, prostate cancer awareness, and early detection. Stay connected with the movement across all Factor of Ten social media platforms. Follow our WhatsApp Channel.
                                Connect with us on our other social media platforms.
                            </p>
                        </div>

                        <section className="stay-social-panel" aria-labelledby="stay-follow-title">
                            <h2 id="stay-follow-title" className="stay-follow-label">Follow Factor of Ten</h2>
                            <div className="stay-icon-row">
                                <a href={LINKS.instagram} aria-label="Factor of Ten on Instagram" className="stay-social-icon"><InstagramIcon /></a>
                                <a href={LINKS.facebook} aria-label="Factor of Ten on Facebook" className="stay-social-icon"><FacebookIcon /></a>
                                <a href={LINKS.linkedin} aria-label="Factor of Ten on LinkedIn" className="stay-social-icon"><LinkedInIcon /></a>
                            </div>
                            <button type="button" onClick={handleShare} className="stay-share">Share the Campaign </button>
                            {shareFeedback && <p role="status" className="stay-feedback">{shareFeedback}</p>}
                        </section>
                    </div>
                </section>

                <div className="stay-continue-wrap">
                    <a href="/thank-you" className="stay-continue">Continue</a>
                </div>
                <p className="stay-footer">The Chair Listens · A quiet place in a noisy world.</p>
            </div>
        </main>
    );
}
