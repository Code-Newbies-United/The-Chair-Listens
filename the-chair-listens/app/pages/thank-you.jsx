// Destination: pages/thank-you.jsx
import { useRouter } from "next/router";
import { LINKS } from "@/lib/campaignLinks";

// Add real partner logo files to /public/logos/ and update these paths before launch.
const PARTNERS = [
    { name: "Partner 1", logo: "/logos/partner-1.png" },
    { name: "Partner 2", logo: "/logos/partner-2.png" },
    { name: "Partner 3", logo: "/logos/partner-3.png" },
];

function LocationPin() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 10c0 5.2-8 12-8 12S4 15.2 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export default function ThankYou() {
    const router = useRouter();
    const displayLocation = router.query.location || "The Blue Chair";

    function handleDone() {
        // A normal browser tab usually cannot be closed by script; return to the start instead.
        window.close();
        window.location.href = "/";
    }

    return (
        <main className="ty-page">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&family=Pinyon+Script&display=swap');
        :root {
          --ty-forest: #2d5046;
          --ty-dark: #203f36;
          --ty-deep: #19362f;
          --ty-mint: #8dcf94;
          --ty-mint-bright: #a5dfa9;
          --ty-blue: #d4e9ed;
          --ty-cream: #f5f2e8;
          --ty-white: #fbfaf5;
          --ty-ochre: #bc9553;
          --ty-sage: #526b61;
        }
        .ty-page, .ty-page * { box-sizing: border-box; }
        .ty-page {
          min-height: 100dvh; width: 100%; padding: max(18px, env(safe-area-inset-top)) max(13px, env(safe-area-inset-right)) max(30px, env(safe-area-inset-bottom)) max(13px, env(safe-area-inset-left));
          color: var(--ty-white); font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
          background: radial-gradient(circle at 100% 0%, rgba(141,207,148,.2), transparent 28%), radial-gradient(circle at 0% 90%, rgba(212,233,237,.1), transparent 25%), var(--ty-forest);
        }
        .ty-shell { width: min(100%, 760px); margin: 0 auto; }
        .ty-topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:20px; padding:4px 3px 14px; }
        .ty-brand { display:flex; align-items:center; gap:8px; color:var(--ty-white); font-size:10px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
        .ty-brand-mark { width:9px; height:9px; flex:0 0 9px; border-radius:50%; background:var(--ty-mint); box-shadow:0 0 0 4px rgba(141,207,148,.12), 0 0 18px rgba(141,207,148,.25); }
        .ty-location { display:inline-flex; align-items:center; gap:7px; max-width:55%; min-width:0; padding:8px 12px; border:1px solid rgba(32,63,54,.08); border-radius:999px; background:var(--ty-mint); color:var(--ty-dark); font-size:10px; font-weight:800; letter-spacing:.035em; box-shadow:0 5px 14px rgba(17,45,37,.12); }
        .ty-location-label { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .ty-back { display:inline-flex; align-items:center; gap:8px; margin:0 0 18px 3px; color:rgba(251,250,245,.78); font-size:13px; font-weight:600; text-decoration:none; }
        .ty-back:hover { color:var(--ty-mint-bright); }
        .ty-card { position:relative; isolation:isolate; overflow:hidden; border-radius:27px; background:var(--ty-cream); color:var(--ty-dark); box-shadow:0 20px 50px rgba(17,45,37,.25); }
        .ty-card::before, .ty-card::after { content:''; position:absolute; z-index:-1; border-radius:50%; pointer-events:none; }
        .ty-card::before { width:320px; height:320px; top:-195px; right:-145px; background:var(--ty-blue); }
        .ty-card::after { width:270px; height:270px; bottom:-190px; left:-145px; background:var(--ty-mint); opacity:.62; }
        .ty-content { position:relative; z-index:1; padding:clamp(28px, 6vw, 46px); text-align:center; }
        .ty-eyebrow { display:flex; align-items:center; justify-content:center; gap:9px; margin:0 0 22px; color:var(--ty-sage); font-size:9px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
        .ty-line { width:25px; height:1px; flex:0 0 25px; background:var(--ty-ochre); }
        .ty-check { display:flex; align-items:center; justify-content:center; width:58px; height:58px; margin:0 auto 20px; border-radius:50%; background:rgba(141,207,148,.28); color:var(--ty-forest); border:1px solid rgba(45,80,70,.12); }
        .ty-title { max-width:620px; margin:0 auto; color:var(--ty-dark); font-size:clamp(38px, 7.8vw, 66px); line-height:.98; letter-spacing:-.055em; font-weight:900; }
        .ty-title span { display:block; color:var(--ty-forest); }
        .ty-script { margin:16px 0 18px; color:var(--ty-ochre); font-family:'Pinyon Script', cursive; font-size:clamp(31px, 5vw, 42px); line-height:1.1; }
        .ty-body { max-width:520px; margin:0 auto 18px; color:#52645e; font-size:15px; line-height:1.7; }
        .ty-disclaimer { max-width:510px; margin:0 auto 22px; padding:14px 16px; border:1px solid rgba(45,80,70,.12); border-radius:16px; background:rgba(251,250,245,.72); color:#52645e; font-size:12px; line-height:1.65; text-align:left; }
        .ty-tagline { margin:0 auto 25px; color:var(--ty-sage); font-size:14px; line-height:1.7; font-weight:700; }
        .ty-buttons { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; }
        .ty-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-width:145px; padding:13px 20px; border-radius:999px; font:inherit; font-size:13px; font-weight:800; text-align:center; text-decoration:none; cursor:pointer; transition:transform 160ms ease, background 160ms ease, box-shadow 160ms ease; }
        .ty-button:hover { transform:translateY(-2px); }
        .ty-button:active { transform:translateY(0) scale(.98); }
        .ty-button:focus-visible { outline:3px solid var(--ty-ochre); outline-offset:4px; }
        .ty-outline { border:1.5px solid rgba(45,80,70,.35); color:var(--ty-forest); background:rgba(251,250,245,.45); }
        .ty-outline:hover { background:rgba(141,207,148,.16); border-color:var(--ty-forest); }
        .ty-filled { border:1px solid var(--ty-mint); background:var(--ty-mint); color:var(--ty-dark); box-shadow:0 7px 0 rgba(32,63,54,.08), 0 10px 22px rgba(45,80,70,.12); }
        .ty-filled:hover { background:var(--ty-mint-bright); box-shadow:0 10px 24px rgba(45,80,70,.16); }
        .ty-partners { margin-top:28px; padding:23px 0 4px; text-align:center; }
        .ty-partners-kicker { display:flex; align-items:center; justify-content:center; gap:9px; margin-bottom:15px; color:rgba(245,242,232,.72); font-size:9px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
        .ty-marquee { width:100%; overflow:hidden; padding:3px 0 10px; mask-image:linear-gradient(90deg, transparent, black 10%, black 90%, transparent); -webkit-mask-image:linear-gradient(90deg, transparent, black 10%, black 90%, transparent); }
        .ty-marquee-track { display:flex; gap:14px; width:max-content; animation:tyMarquee 20s linear infinite; }
        .ty-marquee-track:hover { animation-play-state:paused; }
        @keyframes tyMarquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        .ty-partner { flex:0 0 130px; width:130px; height:78px; display:flex; align-items:center; justify-content:center; padding:12px; border:1px solid rgba(245,242,232,.15); border-radius:15px; background:rgba(245,242,232,.07); transition:border-color 160ms ease, background 160ms ease; }
        .ty-partner:hover { border-color:rgba(141,207,148,.65); background:rgba(245,242,232,.11); }
        .ty-partner img { max-width:100%; max-height:100%; object-fit:contain; }
        .ty-footer { margin:24px 0 0; padding-top:20px; border-top:1px solid rgba(245,242,232,.16); display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; }
        .ty-footer-brand { color:var(--ty-mint-bright); font-size:11px; font-weight:800; letter-spacing:.15em; }
        .ty-footer-tagline { color:rgba(245,242,232,.58); font-size:11px; }
        @media (max-width:520px) { .ty-topbar { margin-bottom:15px; } .ty-content { padding:30px 20px 26px; } .ty-body { font-size:14px; } .ty-disclaimer { font-size:12px; } .ty-button { flex:1 1 140px; } .ty-partner { flex-basis:112px; width:112px; height:70px; } }
        @media (prefers-reduced-motion:reduce) { .ty-button, .ty-partner { transition:none; } .ty-marquee-track { animation:none; } }
      `}</style>

            <div className="ty-shell">
                <header className="ty-topbar">
                    <div className="ty-brand"><span className="ty-brand-mark" aria-hidden="true" />The Chair Listens</div>
                    <div className="ty-location" title={String(displayLocation)}>
                        <LocationPin />
                        <span className="ty-location-label">{displayLocation}</span>
                    </div>
                </header>

                <a href="/stay-connected" className="ty-back">‹‹ Back</a>

                <section className="ty-card" aria-labelledby="ty-title">
                    <div className="ty-content">
                        <div className="ty-eyebrow"><span className="ty-line" />Thank You<span className="ty-line" /></div>
                        <div className="ty-check" aria-hidden="true">
                            <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <h1 className="ty-title" id="ty-title">The Chair has <span>listened.</span></h1>
                        <p className="ty-script">Your voice matters.</p>
                        <p className="ty-body">
                            Thank you for taking a seat and checking in. Your voice matters, and every conversation can help encourage another.
                        </p>
                        <p className="ty-disclaimer">
                            If this conversation raised a concern about your physical or mental health, please speak to a qualified healthcare professional. Looking after your health is an act of responsibility.
                        </p>
                        <p className="ty-tagline">You took a seat. You checked in.<br />Start the conversation. Pass it on.</p>
                        <div className="ty-buttons">
                            <a href={LINKS.learnMore !== "#" ? LINKS.learnMore : LINKS.visitpage} className="ty-button ty-outline">Learn More <span aria-hidden="true"></span></a>
                            <button type="button" onClick={handleDone} className="ty-button ty-filled">Done <span aria-hidden="true"></span></button>
                        </div>
                    </div>
                </section>

                <section className="ty-partners" aria-label="Campaign partners">
                    <div className="ty-partners-kicker"><span className="ty-line" />In Partnership With<span className="ty-line" /></div>
                    <div className="ty-marquee">
                        <div className="ty-marquee-track">
                            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                                <div key={`${partner.name}-${i}`} className="ty-partner">
                                    <img src={partner.logo} alt={partner.name} loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="ty-footer">
                    <span className="ty-footer-brand">FACTOR OF TEN</span>
                    <span className="ty-footer-tagline">Know more. Ask more. Check sooner.</span>
                </footer>
            </div>
        </main>
    );
}
