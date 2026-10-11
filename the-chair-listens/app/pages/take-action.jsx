// Destination: pages/take-action.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LINKS } from "@/lib/campaignLinks";
import DidYouKnowModal from "@/components/DidYouKnowModal";

export default function TakeAction() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Show the campaign fact sheet after a short delay; users can dismiss it.
    useEffect(() => {
        const timer = setTimeout(() => setIsModalOpen(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="take-action-page">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&family=Pinyon+Script&display=swap');
        :root {
          --ta-forest: #2d5046;
          --ta-forest-dark: #203f36;
          --ta-mint: #8dcf94;
          --ta-mint-bright: #a5dfa9;
          --ta-blue: #d4e9ed;
          --ta-cream: #f5f2e8;
          --ta-white: #fbfaf5;
          --ta-ochre: #bc9553;
          --ta-sage: #526b61;
        }
        .take-action-page, .take-action-page * { box-sizing: border-box; }
        .take-action-page {
          min-height: 100dvh;
          width: 100%;
          padding: max(18px, env(safe-area-inset-top)) max(13px, env(safe-area-inset-right)) max(30px, env(safe-area-inset-bottom)) max(13px, env(safe-area-inset-left));
          color: var(--ta-white);
          font-family: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(circle at 100% 0%, rgba(141,207,148,.2), transparent 28%), radial-gradient(circle at 0% 90%, rgba(212,233,237,.1), transparent 25%), var(--ta-forest);
        }
        .ta-shell { width: min(100%, 760px); margin: 0 auto; }
        .ta-topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; padding:4px 3px 14px; }
        .ta-brand { display:flex; align-items:center; gap:8px; color:var(--ta-white); font-size:10px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
        .ta-brand-mark { width:9px; height:9px; flex:0 0 9px; border-radius:50%; background:var(--ta-mint); box-shadow:0 0 0 4px rgba(141,207,148,.12), 0 0 18px rgba(141,207,148,.25); }
        .ta-location { display:inline-flex; align-items:center; gap:6px; max-width:55%; padding:7px 11px; border-radius:999px; background:var(--ta-mint); color:var(--ta-forest-dark); font-size:9px; font-weight:800; letter-spacing:.04em; }
        .ta-location-dot { width:5px; height:5px; flex:0 0 5px; border-radius:50%; background:var(--ta-forest); }
        .ta-back { display:inline-flex; align-items:center; gap:8px; margin:0 0 18px 3px; color:rgba(251,250,245,.78); font-size:13px; font-weight:600; text-decoration:none; }
        .ta-back:hover { color:var(--ta-mint-bright); }
        .ta-card { position:relative; isolation:isolate; overflow:hidden; border-radius:27px; background:var(--ta-cream); color:var(--ta-forest-dark); box-shadow:0 20px 50px rgba(17,45,37,.25); }
        .ta-card::before, .ta-card::after { content:""; position:absolute; z-index:-1; border-radius:50%; pointer-events:none; }
        .ta-card::before { width:310px; height:310px; top:-180px; right:-140px; background:var(--ta-blue); }
        .ta-card::after { width:270px; height:270px; bottom:-190px; left:-145px; background:var(--ta-mint); opacity:.65; }
        .ta-content { position:relative; z-index:1; padding:42px 42px 34px; }
        .ta-eyebrow { display:flex; align-items:center; justify-content:center; gap:9px; margin:0 0 20px; color:var(--ta-sage); font-size:9px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; text-align:center; }
        .ta-eyebrow-line { width:25px; height:1px; flex:0 0 25px; background:var(--ta-ochre); }
        .ta-intro { max-width:610px; margin:0 auto 28px; text-align:center; }
        .ta-headline { margin:0; color:var(--ta-forest-dark); font-size:clamp(43px, 8vw, 72px); line-height:.91; letter-spacing:-.06em; font-weight:900; }
        .ta-headline span { display:block; color:var(--ta-mint); }
        .ta-script { margin:17px 0 10px; color:var(--ta-ochre); font-family:"Pinyon Script", cursive; font-size:38px; line-height:1.05; }
        .ta-copy { max-width:470px; margin:0 auto; color:#52645e; font-size:15px; line-height:1.65; }
        .ta-pledge { padding:25px; border:1px solid rgba(45,80,70,.12); border-radius:22px; background:rgba(251,250,245,.82); box-shadow:0 12px 30px rgba(17,45,37,.06); }
        .ta-pledge h2 { margin:0 0 15px; color:var(--ta-forest); font-size:19px; line-height:1.25; font-weight:800; letter-spacing:-.025em; }
        .ta-pledge-list { display:flex; flex-direction:column; gap:12px; margin:0 0 23px; padding:0; list-style:none; color:#52645e; font-size:14px; line-height:1.7; }
        .ta-pledge-list li { display:flex; align-items:flex-start; gap:10px; }
        .ta-pledge-list li::before { content:"✦"; flex:0 0 auto; margin-top:1px; color:var(--ta-ochre); font-size:13px; }
        .ta-primary { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:15px 20px; border:0; border-radius:999px; background:var(--ta-mint); color:var(--ta-forest-dark); font:inherit; font-size:14px; font-weight:800; text-align:center; text-decoration:none; cursor:pointer; box-shadow:0 7px 0 rgba(32,63,54,.1), 0 10px 22px rgba(45,80,70,.12); transition:transform 160ms ease, background 160ms ease, box-shadow 160ms ease; }
        .ta-primary:hover { transform:translateY(-2px); background:var(--ta-mint-bright); box-shadow:0 9px 0 rgba(32,63,54,.1), 0 15px 28px rgba(45,80,70,.15); }
        .ta-primary:focus-visible, .ta-secondary:focus-visible, .ta-continue:focus-visible { outline:3px solid var(--ta-ochre); outline-offset:4px; }
        .ta-text-link { display:block; width:fit-content; margin:15px auto 0; color:var(--ta-sage); font-size:12px; font-weight:700; text-decoration:underline; text-underline-offset:3px; }
        .ta-after { display:flex; flex-direction:column; align-items:center; gap:16px; padding-top:24px; }
        .ta-secondary { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 18px; border:1px solid rgba(245,242,232,.35); border-radius:999px; background:rgba(245,242,232,.08); color:var(--ta-white); font:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:background 160ms ease, border-color 160ms ease; }
        .ta-secondary:hover { background:rgba(141,207,148,.15); border-color:var(--ta-mint); }
        .ta-continue { display:inline-flex; align-items:center; gap:9px; color:var(--ta-mint-bright); font-size:14px; font-weight:700; text-decoration:none; }
        .ta-continue:hover { text-decoration:underline; text-underline-offset:4px; }
        .ta-footer { margin:22px 0 0; color:rgba(245,242,232,.58); font-size:10px; letter-spacing:.08em; text-align:center; }
        @media (max-width:600px) { .ta-content { padding:32px 20px 25px; } .ta-pledge { padding:21px 17px; } .ta-pledge h2 { font-size:18px; } .ta-copy { font-size:14px; } .ta-script { font-size:34px; } .ta-headline { font-size:clamp(41px, 11vw, 58px); } }
        @media (prefers-reduced-motion:reduce) { .ta-primary, .ta-secondary { transition:none; } }
      `}</style>

            <div className="ta-shell">
                <header className="ta-topbar">
                    <div className="ta-brand"><span className="ta-brand-mark" aria-hidden="true" />The Chair Listens</div>
                    <div className="ta-location"><span className="ta-location-dot" aria-hidden="true" />Take the next step</div>
                </header>

                <a href="/responses" className="ta-back">‹‹ Back to your reflection</a>

                <section className="ta-card">
                    <div className="ta-content">
                        <div className="ta-eyebrow"><span className="ta-eyebrow-line" />Take Action<span className="ta-eyebrow-line" /></div>
                        <div className="ta-intro">
                            <h1 className="ta-headline">The conversation<span>continues.</span></h1>
                            <div className="ta-script">Small steps. Real change.</div>
                            <p className="ta-copy">The conversation doesn’t have to end when you leave the Blue Chair. Carry it with you, one meaningful conversation at a time.</p>
                        </div>

                        <section className="ta-pledge" aria-labelledby="factor-ten-title">
                            <h2 id="factor-ten-title">Take the Factor of Ten Pledge</h2>
                            <ul className="ta-pledge-list">
                                <li>One conversation could change everything.</li>
                                <li>By signing the petition, participants are encouraged to take the Factor of Ten Pledge: a commitment to start ten conversations with the men in their lives about their health.</li>
                                <li>A father. A brother. A partner. A son. A friend. A colleague.</li>
                                <li>Your signature is more than a signature. It’s a commitment to start the conversation.</li>
                            </ul>
                            <a href={LINKS.petition} className="ta-primary">Sign the Factor of Ten Petition <span aria-hidden="true">→</span></a>
                            <a href={LINKS.visitpage} className="ta-text-link">Visit the Factor of Ten page</a>
                        </section>
                    </div>
                </section>

                <div className="ta-after">
                    <button type="button" className="ta-secondary" onClick={() => setIsModalOpen(true)}> Did You Know?</button>
                    <a href="/stay-connected" className="ta-continue">Continue</a>
                </div>
                <p className="ta-footer">The Chair Listens · A quiet place in a noisy world.</p>
            </div>

            <DidYouKnowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant="bottom-sheet" />
        </main>
    );
}
