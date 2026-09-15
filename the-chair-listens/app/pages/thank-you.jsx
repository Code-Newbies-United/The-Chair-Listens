// Destination: pages/thank-you.jsx
import { useState } from "react";
import { LINKS } from "@/lib/campaignLinks";

// This is the final page in the flow: Reflection -> Take Action -> Stay Connected -> Thank You

export default function ThankYou() {
    const [shareFeedback, setShareFeedback] = useState("");

    async function handleShare() {
        const shareData = {
            title: "The Chair Listens",
            text: "You took a seat. You checked in. Start the conversation. Pass it on.",
            url: LINKS.shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled the share sheet — not an error worth surfacing
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
                            onClick={handleShare}
                            className="clisten-cta clisten-cta-outline"
                            style={styles.outlineButton}
                        >
                            Share
                        </button>
                        <a href="/" className="clisten-cta" style={styles.filledButton}>
                            Done
                        </a>
                    </div>
                    {shareFeedback && <p style={styles.shareFeedback}>{shareFeedback}</p>}
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
        padding: "11px 18px",
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
        borderRadius: "999px",
        border: "none",
        background: "#B99B5B",
        color: "#0A1735",
        fontSize: "13.5px",
        fontWeight: 700,
        textDecoration: "none",
        cursor: "pointer",
    },
    shareFeedback: {
        marginTop: "10px",
        fontSize: "12.5px",
        color: "#8FD19E",
    },
    footer: {
        textAlign: "center",
        marginTop: "40px",
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