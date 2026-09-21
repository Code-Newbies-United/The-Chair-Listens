// Destination: pages/take-action.jsx
import { useState, useEffect } from "react";
import { LINKS } from "@/lib/campaignLinks";
import DidYouKnowModal from "@/components/DidYouKnowModal";

export default function TakeAction() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Automatically show the pop-up at the bottom after 1.5s delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsModalOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

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
      `}</style>

            <div style={styles.frame}>
                <a href="/responses" style={styles.back}>
                    « Back
                </a>

                <section style={styles.section}>
                    <span style={styles.kicker}>Take Action</span>
                    <p style={styles.sectionIntro}>
                        The conversation doesn't have to end when you leave the Blue
                        Chair.
                    </p>
                </section>

                <section style={styles.pledgeCard}>
                    <h1 style={styles.sectionTitle}>Take the Factor of Ten Pledge</h1>
                    <ul style={styles.pledgeList}>
                        <li>One conversation could change everything.</li>
                        <li>
                            By signing the petition, participants are encouraged to take
                            the Factor of Ten Pledge, a commitment to start ten
                            conversations with the men in their lives about their health.
                        </li>
                        <li>A father. A brother. A partner. A son. A friend. A colleague.</li>
                        <li>
                            Your signature is more than a signature. It's a commitment to
                            start the conversation.
                        </li>
                    </ul>
                    <a
                        href={LINKS.petition}
                        className="clisten-cta"
                        style={{ ...styles.filledButton, width: "90%", textAlign: "center" }}
                    >
                        Sign the Factor of Ten Petition
                    </a>
                    <p style={styles.smallLink}>
                        <a href={LINKS.visitpage} style={styles.textLink}>
                            Visit the Factor of Ten page
                        </a>
                    </p>
                </section>

                {/* Trigger to manually view "Did You Know?" banner again */}
                <div style={styles.dykWrapper}>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        style={styles.dykTriggerBtn}
                    >
                        💡 Did You Know?
                    </button>
                </div>

                <a href="/stay-connected" style={styles.continueLink}>
                    Continue
                </a>
            </div>

            {/* Bottom Pop-Up Banner */}
            <DidYouKnowModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                variant="bottom-sheet"
            />
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
        padding: "32px 20px 80px",
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
        marginBottom: "20px",
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
    sectionIntro: {
        fontSize: "14.5px",
        color: "#AEB8D6",
        margin: 0,
    },
    sectionTitle: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: "19px",
        color: "#F5F6FA",
        margin: "0 0 12px 0",
    },
    pledgeCard: {
        backgroundColor: "rgba(15, 30, 74, 0.6)",
        border: "1.5px solid rgba(174, 184, 214, 0.2)",
        borderRadius: "16px",
        padding: "24px 20px",
        marginBottom: "24px",
    },
    pledgeList: {
        margin: "0 0 20px 0",
        paddingLeft: "20px",
        color: "#D7DCEE",
        fontSize: "13.5px",
        lineHeight: 1.7,
    },
    filledButton: {
        display: "inline-block",
        padding: "13px 20px",
        borderRadius: "999px",
        border: "none",
        background: "#B99B5B",
        color: "#0A1735",
        fontSize: "14px",
        fontWeight: 700,
        textDecoration: "none",
        cursor: "pointer",
    },
    smallLink: {
        textAlign: "center",
        marginTop: "12px",
    },
    textLink: {
        color: "#8FA6D9",
        fontSize: "12.5px",
        textDecoration: "underline",
    },
    dykWrapper: {
        textAlign: "center",
        marginBottom: "20px",
    },
    dykTriggerBtn: {
        background: "rgba(185, 155, 91, 0.12)",
        border: "1px solid #B99B5B",
        borderRadius: "999px",
        padding: "8px 18px",
        color: "#D9C489",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },
    continueLink: {
        display: "block",
        textAlign: "center",
        color: "#D9C489",
        fontSize: "14px",
        fontWeight: 600,
        textDecoration: "none",
    },
};