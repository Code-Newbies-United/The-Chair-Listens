// Destination: pages/thank-you.jsx
import { LINKS } from "@/lib/campaignLinks";

// This is the final page in the flow: Reflection -> Take Action -> Stay Connected -> Thank You

// Add logo files to /public/logos/ then reference them here.
const PARTNERS = [
    { name: "Partner 1", logo: "/logos/partner-1.png" },
    { name: "Partner 2", logo: "/logos/partner-2.png" },
    { name: "Partner 3", logo: "/logos/partner-3.png" },
];

export default function ThankYou() {
    function handleDone() {
        // Best-effort close — browsers only allow script-initiated close()
        // on tabs/windows that were themselves opened via script, so this
        // will silently fail for a normal tab opened by scanning a QR code
        // or tapping a link. If it's blocked, we fall back to sending the
        // visitor back to the landing page instead of leaving them stuck.
        window.close();
        window.location.href = "/";
    }

    return (
        <main style={styles.page}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&display=swap');
        .clisten-cta {
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .clisten-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
        }
        .clisten-cta:active {
          transform: translateY(0px) scale(0.98);
        }
        .clisten-cta-outline:hover {
          background-color: rgba(185, 155, 91, 0.12) !important;
        }
        .clisten-partner-tile {
          transition: border-color 160ms ease, background-color 160ms ease;
        }
        .clisten-partner-tile:hover {
          background-color: rgba(185, 155, 91, 0.06);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.28);
        }
        .clisten-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: clistenMarquee 16s linear infinite;
        }
        .clisten-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes clistenMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .clisten-marquee-track { animation: none; }
        }
      `}</style>

            <div style={styles.frame}>
                <a href="/stay-connected" style={styles.back}>
                    « Back
                </a>

                <section style={styles.heroSection}>
                    <h1 style={styles.heroTitle}>The Chair has listened.</h1>
                    <p style={styles.heroBody}>
                        Thank you for taking a seat and checking in. Your voice matters,
                        and every conversation can help encourage another.
                    </p>

                    <p style={styles.disclaimer}>
                        If this conversation raised a concern about your physical or
                        mental health, please speak to a qualified healthcare
                        professional. Looking after your health is an act of
                        responsibility.
                    </p>

                    <p style={styles.tagline}>
                        You took a seat. You checked in. Start the conversation. Pass it on.
                    </p>

                    <div style={styles.buttonRow}>
                        <a
                            href={LINKS.learnMore}
                            className="clisten-cta clisten-cta-outline"
                            style={styles.outlineButton}
                        >
                            Learn More
                        </a>
                        <button
                            type="button"
                            onClick={handleDone}
                            className="clisten-cta"
                            style={styles.filledButton}
                        >
                            Done
                        </button>
                    </div>
                </section>

                {/* Partner logos, scrolling in an infinite loop. The list is
                    rendered twice back-to-back so the marquee can loop
                    seamlessly at -50% translateX. */}
                <section style={styles.partnersSection}>
                    <span style={styles.partnersKicker}>In Partnership With</span>
                    <div style={styles.marqueeViewport}>
                        <div className="clisten-marquee-track">
                            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                                <div
                                    key={`${partner.name}-${i}`}
                                    className="clisten-partner-tile"
                                    style={styles.partnerTile}
                                >
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        style={styles.partnerLogo}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer style={styles.footer}>
                    <span style={styles.footerBrand}>FACTOR OF TEN</span>
                    <span style={styles.footerTagline}>
            Know more. Ask more. Check sooner.
          </span>
                </footer>
            </div>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "radial-gradient(120% 60% at 50% 0%, #14265C 0%, #0F1E4A 40%, #0A1735 75%, #081128 100%)",
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: "32px 20px",
        boxSizing: "border-box",
    },
    frame: {
        width: "100%",
        maxWidth: "440px",
    },
    back: {
        display: "inline-block",
        color: "#AEB8D6",
        fontSize: "14px",
        textDecoration: "none",
        marginBottom: "24px",
    },
    heroSection: {
        textAlign: "center",
    },
    heroTitle: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 700,
        fontSize: "28px",
        color: "#F5F6FA",
        margin: "0 0 16px 0",
    },
    heroBody: {
        fontSize: "15px",
        lineHeight: 1.6,
        color: "#D7DCEE",
        margin: "0 0 16px 0",
    },
    disclaimer: {
        fontSize: "13px",
        lineHeight: 1.6,
        color: "#AEB8D6",
        margin: "0 0 24px 0",
    },
    tagline: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: "16px",
        fontStyle: "italic",
        color: "#D9C489",
        margin: "0 0 24px 0",
    },
    buttonRow: {
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    outlineButton: {
        display: "inline-block",
        padding: "11px 20px",
        minWidth: "128px",
        textAlign: "center",
        borderRadius: "999px",
        border: "1.5px solid #B99B5B",
        color: "#D9C489",
        fontSize: "13.5px",
        fontWeight: 600,
        textDecoration: "none",
        cursor: "pointer",
        background: "transparent",
    },
    filledButton: {
        display: "inline-block",
        padding: "11px 20px",
        minWidth: "128px",
        textAlign: "center",
        borderRadius: "999px",
        border: "none",
        background: "#B99B5B",
        color: "#0A1735",
        fontSize: "13.5px",
        fontWeight: 700,
        textDecoration: "none",
        cursor: "pointer",
    },
    partnersSection: {
        marginTop: "40px",
        textAlign: "center",
    },
    partnersKicker: {
        display: "block",
        fontSize: "11.5px",
        fontWeight: 600,
        color: "#7E88AC",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "14px",
    },
    marqueeViewport: {
        width: "100%",
        overflow: "hidden",
        maskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
    },
    partnerTile: {
        flexShrink: 0,
        width: "110px",
        aspectRatio: "3 / 2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    },
    partnerLogo: {
        maxWidth: "75%",
        maxHeight: "75%",
        objectFit: "contain",
    },
    footer: {
        textAlign: "center",
        marginTop: "32px",
        paddingTop: "24px",
        borderTop: "1px solid rgba(174, 184, 214, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    footerBrand: {
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: "#D9C489",
    },
    footerTagline: {
        fontSize: "12px",
        color: "#7E88AC",
    },
};