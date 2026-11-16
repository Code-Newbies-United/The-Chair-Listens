// Destination: components/AboutFactorOfTen.jsx
import { useEffect, useRef, useState } from "react";

const FOUNDERS = [
    {
        name: "Jonathan Muthige",
        role: "Chairperson & Co-Founder",
        initials: "JM",
        // Put the photo files in /public/founders/
        photo: "/founders/jonathan-muthige.jpg",
    },
    {
        name: "Nwabisa Muthige",
        role: "CEO & Co-Founder",
        initials: "NM",
        photo: "/founders/nwabisa-muthige.jpg",
    },
];

function FounderPhoto({ founder }) {
    const [failed, setFailed] = useState(false);

    return (
        <figure className="about-founder">
            {failed ? (
                <div className="about-founder-fallback" aria-hidden="true">
                    {founder.initials}
                </div>
            ) : (
                <img
                    className="about-founder-photo"
                    src={founder.photo}
                    alt={`Portrait of ${founder.name}`}
                    onError={() => setFailed(true)}
                />
            )}
            <figcaption>
                <strong>{founder.name}</strong>
                <span>{founder.role}</span>
            </figcaption>
        </figure>
    );
}

export default function AboutFactorOfTen({ open, onClose }) {
    const closeRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        function onKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="about-overlay"
            onClick={onClose}
            role="presentation"
        >
            <style jsx global>{`
        .about-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          background: rgba(17, 45, 37, 0.72);
          backdrop-filter: blur(3px);
          animation: about-fade 200ms ease both;
        }

        .about-dialog {
          position: relative;
          width: 100%;
          max-width: 760px;
          max-height: 92dvh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 24px 24px 0 0;
          background: var(--cream);
          color: var(--forest);
          padding: 34px 22px max(28px, env(safe-area-inset-bottom));
          animation: about-rise 260ms ease both;
        }

        .about-close {
          position: sticky;
          top: 0;
          float: right;
          z-index: 2;
          width: 38px;
          height: 38px;
          margin: -12px -6px 0 12px;
          border: 0;
          border-radius: 50%;
          background: var(--forest);
          color: var(--white);
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
        }

        .about-close:hover {
          background: var(--forest-deep);
        }

        .about-close:focus-visible,
        .about-cta:focus-visible {
          outline: 3px solid var(--ochre);
          outline-offset: 3px;
        }

        .about-title {
          margin: 0 0 6px;
          font-size: clamp(30px, 7vw, 44px);
          line-height: 1;
          letter-spacing: -0.045em;
          font-weight: 900;
          color: var(--forest);
        }

        .about-script {
          margin: 0 0 22px;
          color: var(--ochre);
          font-family: "Pinyon Script", cursive;
          font-size: 32px;
          line-height: 1;
        }

        .about-founders {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 0 0 26px;
        }

        .about-founder {
          margin: 0;
          text-align: center;
        }

        .about-founder-photo,
        .about-founder-fallback {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 18px;
          object-fit: cover;
          background: var(--powder-blue);
        }

        .about-founder-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--mint);
          color: var(--forest);
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .about-founder figcaption {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 10px;
          font-size: 13px;
          line-height: 1.35;
        }

        .about-founder figcaption span {
          color: var(--sage);
          font-size: 12px;
        }

        .about-body {
          max-width: 62ch;
        }

        .about-body h3 {
          margin: 22px 0 6px;
          font-size: 17px;
          letter-spacing: -0.02em;
        }

        .about-body p {
          margin: 0 0 12px;
          color: #3f524c;
          font-size: 14px;
          line-height: 1.65;
        }

        .about-quote {
          margin: 22px 0 0;
          padding: 16px 18px;
          border-left: 4px solid var(--ochre);
          border-radius: 0 14px 14px 0;
          background: var(--powder-blue);
          color: var(--forest);
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }

        .about-cta {
          display: block;
          width: 100%;
          margin-top: 24px;
          border: 0;
          border-radius: 100px;
          padding: 14px 20px;
          background: var(--forest);
          color: var(--white);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .about-cta:hover {
          background: var(--forest-deep);
        }

        @keyframes about-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes about-rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (min-width: 700px) {
          .about-overlay {
            align-items: center;
            padding: 24px;
          }

          .about-dialog {
            border-radius: 26px;
            padding: 44px 48px 36px;
          }

          .about-founders {
            gap: 22px;
          }

          .about-body p {
            font-size: 15px;
          }
        }
      `}</style>

            <div
                className="about-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="about-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    ref={closeRef}
                    type="button"
                    className="about-close"
                    onClick={onClose}
                    aria-label="Close about Factor of Ten"
                >
                    ×
                </button>

                <h2 id="about-title" className="about-title">
                    Born from faith, courage and resilience.
                </h2>
                <p className="about-script">The story of Factor of Ten</p>

                <div className="about-founders">
                    {FOUNDERS.map((f) => (
                        <FounderPhoto key={f.name} founder={f} />
                    ))}
                </div>

                <div className="about-body">
                    <h3>A diagnosis that became a calling</h3>
                    <p>
                        In 2023, Jonathan Muthige was diagnosed with Stage 3 aggressive
                        prostate cancer. It began with unexplained shoulder pain on a family
                        holiday, and a PSA test then revealed critically elevated levels.
                    </p>
                    <p>
                        What struck him most was how unprepared and uninformed his family
                        felt. Together with his wife, Nwabisa, and their children, they
                        worked through fear, medical decisions and emotional strain. After
                        robotic surgery and months of recovery, survival became purpose.
                    </p>
                    <p>
                        They saw how many families face the same battle without information,
                        early detection, mental health support or strong care networks. The
                        Factor of Ten Foundation was born from that experience.
                    </p>

                    <h3>More than just a name</h3>
                    <p>
                        Factor of Ten is a belief in exponential impact: small, intentional
                        acts, multiplied by courage and collective responsibility, can
                        change systems, communities and futures.
                    </p>

                    <h3>Where the Foundation works</h3>
                    <p>
                        Prostate cancer awareness, mental health and resilience, engaging
                        individuals and organisations to give a fraction of their time and
                        skills, and community empowerment and advocacy.
                    </p>

                    <p className="about-quote">
                        Small Acts. Tenfold Impact. When education is practical, advocacy
                        is relentless and support is inclusive, impact multiplies.
                    </p>
                </div>

                <button type="button" className="about-cta" onClick={onClose}>
                    Back to The Chair
                </button>
            </div>
        </div>
    );
}