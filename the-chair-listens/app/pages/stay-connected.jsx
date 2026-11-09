// Destination: pages/stay-connected.jsx
import { useState } from "react";
import { useRouter } from "next/router";
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

function EmailIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="m4 7.5 8 6 8-6" />
        </svg>
    );
}

export default function StayConnected() {
    const router = useRouter();
    const displayLocation = router.query.location || "Pretoria";
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
        .stay-brand-logo { width:34px; height:34px; flex:0 0 34px; border-radius:50%; object-fit:cover; border:1px solid rgba(245,242,232,.55); }
        .stay-brand-mark { width:9px; height:9px; flex:0 0 9px; border-radius:50%; background:var(--stay-mint); box-shadow:0 0 0 4px rgba(141,207,148,.12), 0 0 18px rgba(141,207,148,.25); }
        .stay-location { display:inline-flex; align-items:center; gap:6px; flex-shrink:0; color:var(--stay-dark); background:var(--stay-mint); border-radius:100px; padding:7px 10px; font-size:9px; font-weight:800; letter-spacing:.04em; }
        .stay-location-dot { width:5px; height:5px; border-radius:50%; background:var(--stay-forest); }
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
        .stay-whatsapp-pill { display:flex; align-items:center; justify-content:center; gap:10px; width:fit-content; max-width:100%; margin:0 auto 22px; padding:12px 22px; border:1px solid rgba(45,80,70,.12); border-radius:999px; background:var(--stay-mint); color:var(--stay-dark); font-size:13px; font-weight:800; line-height:1.3; text-align:center; text-decoration:none; box-shadow:0 7px 0 rgba(32,63,54,.08), 0 10px 22px rgba(45,80,70,.1); transition:transform 160ms ease, background 160ms ease, box-shadow 160ms ease; }
        .stay-whatsapp-pill:hover { transform:translateY(-2px); background:var(--stay-bright); box-shadow:0 9px 0 rgba(32,63,54,.08), 0 15px 28px rgba(45,80,70,.13); }
        .stay-whatsapp-pill svg { width:19px; height:19px; flex:0 0 19px; }
        .stay-follow-label { display:block; margin:0 0 15px; color:var(--stay-sage); font-size:10px; font-weight:800; letter-spacing:.14em; text-align:center; text-transform:uppercase; }
        .stay-icon-row { display:flex; justify-content:center; gap:13px; margin:0 0 24px; }
        .stay-social-icon { display:flex; align-items:center; justify-content:center; width:49px; height:49px; border:1px solid rgba(45,80,70,.22); border-radius:50%; background:rgba(141,207,148,.18); color:var(--stay-forest); text-decoration:none; transition:transform 160ms ease, background 160ms ease, border-color 160ms ease; }
        .stay-social-icon:hover { transform:translateY(-3px); background:rgba(141,207,148,.4); border-color:var(--stay-mint); }

        /* Tooltips */
        .stay-social-icon { position: relative; }
        .stay-social-icon::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translate(-50%, 4px);
          padding: 7px 11px;
          border-radius: 8px;
          background: var(--stay-dark);
          color: var(--stay-white);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 150ms ease, transform 150ms ease;
          box-shadow: 0 6px 16px rgba(17, 45, 37, 0.25);
          z-index: 10;
        }
        .stay-social-icon::before {
          content: "";
          position: absolute;
          bottom: calc(100% + 4px);
          left: 50%;
          transform: translate(-50%, 4px);
          border: 6px solid transparent;
          border-top-color: var(--stay-dark);
          border-bottom: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 150ms ease, transform 150ms ease;
          z-index: 10;
        }
        .stay-social-icon:hover::after,
        .stay-social-icon:focus-visible::after,
        .stay-social-icon:hover::before,
        .stay-social-icon:focus-visible::before {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        .stay-share { display:flex; align-items:center; justify-content:center; gap:9px; width:100%; padding:14px 18px; border:0; border-radius:999px; background:var(--stay-mint); color:var(--stay-dark); font:inherit; font-size:13px; font-weight:800; cursor:pointer; box-shadow:0 7px 0 rgba(32,63,54,.1), 0 10px 22px rgba(45,80,70,.1); transition:transform 160ms ease, background 160ms ease, box-shadow 160ms ease; }
        .stay-share:hover { transform:translateY(-2px); background:var(--stay-bright); box-shadow:0 9px 0 rgba(32,63,54,.1), 0 15px 28px rgba(45,80,70,.13); }
        .stay-feedback { margin:12px 0 0; color:var(--stay-sage); font-size:12px; text-align:center; }
        .stay-continue-wrap { display:flex; justify-content:center; padding-top:24px; }
        .stay-continue { display:inline-flex; align-items:center; gap:9px; padding:12px 24px; border:1.5px solid rgba(251, 250, 245, 0.35); border-radius:999px; background:transparent; color:var(--stay-bright); font-size:14px; font-weight:700; text-decoration:none; transition:border-color 150ms ease, background 150ms ease, transform 150ms ease; }
        .stay-continue:hover { border-color:var(--stay-bright); background:rgba(141, 207, 148, 0.1); transform:translateY(-2px); }
        .stay-back:focus-visible, .stay-whatsapp-pill:focus-visible, .stay-social-icon:focus-visible, .stay-share:focus-visible, .stay-continue:focus-visible { outline:3px solid var(--stay-ochre); outline-offset:4px; }
        .stay-footer { margin:24px 0 0; padding-top:20px; border-top:1px solid rgba(245,242,232,.16); display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; }
        .stay-footer-brand { color:var(--stay-bright); font-size:11px; font-weight:800; letter-spacing:.15em; }
        .stay-footer-tagline { color:rgba(245,242,232,.58); font-size:11px; }
        @media (max-width:390px) { .stay-brand-logo { width:29px; height:29px; flex-basis:29px; } }
        @media (max-width:600px) { .stay-content { padding:32px 20px 24px; } .stay-social-panel { padding:21px 17px; } .stay-title { font-size:clamp(38px, 10vw, 54px); } .stay-script { font-size:34px; } .stay-body { font-size:14px; } }
        @media (prefers-reduced-motion:reduce) { .stay-back, .stay-whatsapp-pill, .stay-social-icon, .stay-share, .stay-continue, .stay-social-icon::after, .stay-social-icon::before { transition:none; } }
      `}</style>

            <div className="stay-shell">
                <header className="stay-topbar">
                    <div className="stay-brand">
                        <img className="stay-brand-logo" src="/logos/factor-of-ten-logo.jpg" alt="Factor of Ten Foundation logo" />
                        <span className="stay-brand-mark" aria-hidden="true" />
                        The Chair Listens
                    </div>
                    <div className="stay-location" aria-label="Campaign location">
                        <span className="stay-location-dot" />
                        {displayLocation}
                    </div>
                </header>

                <a href="/take-action" className="stay-back">⮜ Back</a>

                <section className="stay-card">
                    <div className="stay-content">
                        <div className="stay-eyebrow"><span className="stay-eyebrow-line" />Stay Connected<span className="stay-eyebrow-line" /></div>
                        <div className="stay-intro">
                            <h1 className="stay-title">The conversation<br />doesn’t end here.</h1>
                            <div className="stay-script">Keep showing up. Keep listening.</div>
                            <p className="stay-body">
                                Follow Factor of Ten and continue the conversation around men’s health, prostate cancer awareness, and early detection. Stay connected with the movement across all Factor of Ten social media platforms.
                            </p>
                        </div>

                        <section className="stay-social-panel" aria-labelledby="stay-follow-title">
                            <a
                                href="https://wa.me/27630282393"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="stay-whatsapp-pill"
                                aria-label="Chat with Factor of Ten on WhatsApp"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M20.52 3.48A11.83 11.83 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.88c0 2.1.55 4.15 1.6 5.96L.12 24l6.32-1.66a11.9 11.9 0 0 0 5.66 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.15-3.47-8.42ZM12.1 21.77h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.75.98 1-3.66-.24-.38a9.84 9.84 0 0 1-1.51-5.24c0-5.45 4.44-9.89 9.9-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.88-9.89 9.88Zm5.43-7.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                                </svg>
                                Connect with us on WhatsApp
                            </a>
                            <h2 id="stay-follow-title" className="stay-follow-label">Follow Factor of Ten</h2>
                            <div className="stay-icon-row">
                                <a href={LINKS.instagram} aria-label="Factor of Ten on Instagram" data-tooltip="Follow us on Instagram" className="stay-social-icon"><InstagramIcon /></a>
                                <a href={LINKS.facebook} aria-label="Factor of Ten on Facebook" data-tooltip="Follow us on Facebook" className="stay-social-icon"><FacebookIcon /></a>
                                <a href={LINKS.linkedin} aria-label="Factor of Ten on LinkedIn" data-tooltip="Connect on LinkedIn" className="stay-social-icon"><LinkedInIcon /></a>
                                <a href={LINKS.email} aria-label="Factor of Ten email" data-tooltip="Send us an email" className="stay-social-icon"><EmailIcon /></a>
                            </div>
                            <button type="button" onClick={handleShare} className="stay-share">Share the Campaign</button>
                            {shareFeedback && <p role="status" className="stay-feedback">{shareFeedback}</p>}
                        </section>
                    </div>
                </section>

                <div className="stay-continue-wrap">
                    <a href="/thank-you" className="stay-continue">Continue</a>
                </div>

                <footer className="stay-footer">
                    <span className="stay-footer-brand">FACTOR OF TEN</span>
                    <span className="stay-footer-tagline">Know more. Ask more. Check sooner.</span>
                </footer>
            </div>
        </main>
    );
}