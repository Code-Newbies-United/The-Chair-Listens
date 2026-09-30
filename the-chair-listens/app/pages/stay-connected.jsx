// Destination: pages/stay-connected.jsx
import { useState } from "react";
import { LINKS } from "@/lib/campaignLinks";

function InstagramIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V23h-4V8z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 22v-8.5h2.85l.43-3.3h-3.28V8.05c0-.96.27-1.61 1.64-1.61h1.75V3.5c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.36v2.43H7.24v3.3h2.85V22h3.41z" />
        </svg>
    );
}

function WhatsAppIcon(){
    return (
         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.77 14.04c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.97s.73-2.11 1-2.4c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.3-.13.58.17.29.75 1.24 1.61 2 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.65.78 1.93.92.29.14.48.22.55.34.07.13.07.72-.17 1.4z"/>
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
        .clisten-social-icon {
          transition: transform 160ms ease, background-color 160ms ease;
        }
        .clisten-social-icon:hover {
          transform: translateY(-2px);
          background-color: rgba(185, 155, 91, 0.22) !important;
        }
      `}</style>

            <div style={styles.frame}>
                <a href="/take-action" style={styles.back}>
                    « Back
                </a>

                <section style={styles.section}>
                    <span style={styles.kicker}>Stay Connected</span>
                    <h1 style={styles.sectionTitle}>The conversation doesn't end here.</h1>
                    <p style={styles.sectionBody}>
                        Follow Factor of Ten and continue the conversation around men's
                        health, prostate cancer awareness, and early detection. Stay
                        connected with the movement across all Factor of Ten social
                        media platforms.
                    </p>

                    <span style={styles.followLabel}>Follow Factor of Ten</span>
                    <div style={styles.iconRow}>
                        <a
                            href={LINKS.instagram}
                            aria-label="Factor of Ten on Instagram"
                            className="clisten-social-icon"
                            style={styles.iconCircle}
                        >
                            <InstagramIcon />
                        </a>
                        <a
                            href={LINKS.facebook}
                            aria-label="Factor of Ten on Facebook"
                            className="clisten-social-icon"
                            style={styles.iconCircle}
                        >
                            <FacebookIcon />
                        </a>
                        <a
                            href={LINKS.linkedin}
                            aria-label="Factor of Ten on LinkedIn"
                            className="clisten-social-icon"
                            style={styles.iconCircle}
                        >
                            <LinkedInIcon />
                        </a>

                        <a
                            href={LINKS.whatsapp}
                            aria-label="Factor of Ten on WhatsApp"
                            className="clisten-social-icon"
                            style={styles.iconCircle}
                        >
                            <WhatsAppIcon />
                        </a>

                    </div>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="clisten-cta clisten-cta-outline"
                        style={styles.shareButton}
                    >
                        Share the Campaign
                    </button>
                    {shareFeedback && <p style={styles.shareFeedback}>{shareFeedback}</p>}
                </section>

                <a href="/thank-you" style={styles.continueLink}>
                    Continue
                </a>
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
        padding: "32px 20px 56px",
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
    section: {
        marginBottom: "8px",
    },
    kicker: {
        display: "block",
        fontSize: "12px",
        fontWeight: 700,
        color: "#B99B5B",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "8px",
    },
    sectionTitle: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: "19px",
        color: "#F5F6FA",
        margin: "0 0 12px 0",
    },
    sectionBody: {
        fontSize: "14px",
        lineHeight: 1.6,
        color: "#AEB8D6",
        marginBottom: "20px",
    },
    followLabel: {
        display: "block",
        fontSize: "12.5px",
        fontWeight: 600,
        color: "#D9C489",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: "center",
        marginBottom: "14px",
    },
    iconRow: {
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        marginBottom: "24px",
    },
    iconCircle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1.5px solid #B99B5B",
        color: "#D9C489",
        backgroundColor: "rgba(185, 155, 91, 0.12)",
        textDecoration: "none",
    },
    shareButton: {
        display: "block",
        width: "100%",
        textAlign: "center",
        padding: "12px 18px",
        borderRadius: "999px",
        border: "1.5px solid #B99B5B",
        color: "#D9C489",
        fontSize: "13.5px",
        fontWeight: 600,
        background: "transparent",
        cursor: "pointer",
        boxSizing: "border-box",
    },
    shareFeedback: {
        marginTop: "10px",
        fontSize: "12.5px",
        color: "#8FD19E",
    },
    continueLink: {
        display: "block",
        textAlign: "center",
        color: "#D9C489",
        fontSize: "14px",
        fontWeight: 600,
        textDecoration: "none",
        marginTop: "32px",
    },
};