import { useEffect, useState } from "react";

const DID_YOU_KNOW_FACTS = [
    {
        id: 1,
        tag: "Campaign Impact",
        fact: "Over 70% of men say they feel more comfortable sharing their struggles anonymously through community-led voice campaigns.",
    },
    {
        id: 2,
        tag: "Mental Health",
        fact: "Listening activates key neural pathways that lower stress response levels for both the speaker and the listener.",
    },
    {
        id: 3,
        tag: "Community Action",
        fact: "Pinning live location activations increases local engagement and response rates by over 40%.",
    },
];

export default function DidYouKnowModal({ isOpen, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentFact = DID_YOU_KNOW_FACTS[currentIndex];

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose?.();
            if (event.key === "ArrowRight") {
                setCurrentIndex((prev) => (prev + 1) % DID_YOU_KNOW_FACTS.length);
            }
            if (event.key === "ArrowLeft") {
                setCurrentIndex((prev) =>
                    prev === 0 ? DID_YOU_KNOW_FACTS.length - 1 : prev - 1
                );
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % DID_YOU_KNOW_FACTS.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? DID_YOU_KNOW_FACTS.length - 1 : prev - 1
        );
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <style>{`
        @keyframes dykFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dyk-card { animation: dykFadeIn 240ms ease-out both; }
        .dyk-close:hover { color: #a5dfa9 !important; background: rgba(141,207,148,.12) !important; }
        .dyk-nav:hover { border-color: #8dcf94 !important; color: #fbfaf5 !important; background: rgba(141,207,148,.12) !important; }
        .dyk-nav:focus-visible, .dyk-close:focus-visible { outline: 2px solid #a5dfa9; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { .dyk-card { animation: none; } }
      `}</style>

            <section
                className="dyk-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dyk-title"
                style={styles.modalCard}
                onClick={(event) => event.stopPropagation()}
            >
                <div style={styles.topAccent} />
                <header style={styles.modalHeader}>
                    <div>
                        <div style={styles.eyebrow}><span style={styles.sparkleIcon}>✦</span> A moment to learn</div>
                        <h2 id="dyk-title" style={styles.heading}>Did You <span style={styles.headingAccent}>Know?</span></h2>
                    </div>
                    <button
                        type="button"
                        className="dyk-close"
                        onClick={onClose}
                        aria-label="Close Did You Know dialog"
                        style={styles.closeBtn}
                    >
                        ×
                    </button>
                </header>

                <div style={styles.progressTrack} aria-hidden="true">
                    <div style={{ ...styles.progressFill, width: `${((currentIndex + 1) / DID_YOU_KNOW_FACTS.length) * 100}%` }} />
                </div>

                <div style={styles.contentBody}>
                    <span style={styles.factTag}>{currentFact.tag}</span>
                    <p style={styles.factText}>{currentFact.fact}</p>
                    <p style={styles.supportingText}>Every conversation can be a starting point for change.</p>
                </div>

                <footer style={styles.modalFooter}>
                    <span style={styles.counter}><strong style={styles.counterCurrent}>{String(currentIndex + 1).padStart(2, "0")}</strong><span style={styles.counterDivider}>/</span>{String(DID_YOU_KNOW_FACTS.length).padStart(2, "0")}</span>
                    <div style={styles.btnGroup}>
                        <button type="button" className="dyk-nav" onClick={handlePrev} style={styles.navBtn}><span>Previous</span></button>
                        <button type="button" className="dyk-nav" onClick={handleNext} style={styles.nextBtn}><span>Next</span></button>
                    </div>
                </footer>
            </section>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(12, 29, 24, 0.78)",
        backdropFilter: "blur(9px)",
        WebkitBackdropFilter: "blur(9px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },
    modalCard: {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "470px",
        background: "linear-gradient(155deg, #23483d 0%, #19362f 100%)",
        border: "1px solid rgba(141, 207, 148, 0.3)",
        borderRadius: "24px",
        padding: "clamp(22px, 5vw, 30px)",
        boxShadow: "0 28px 80px rgba(0, 0, 0, 0.38)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        color: "#fbfaf5",
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    topAccent: {
        position: "absolute",
        top: 0,
        left: "28px",
        right: "28px",
        height: "3px",
        borderRadius: "0 0 8px 8px",
        background: "linear-gradient(90deg, #bc9553, #a5dfa9, #bc9553)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
    },
    eyebrow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#a5dfa9",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        marginBottom: "10px",
    },
    sparkleIcon: { color: "#bc9553", fontSize: "15px" },
    heading: {
        margin: 0,
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "clamp(27px, 5vw, 34px)",
        lineHeight: 1.1,
        letterSpacing: "-0.04em",
        fontWeight: 500,
        color: "#fbfaf5",
    },
    headingAccent: { color: "#a5dfa9", fontStyle: "italic" },
    closeBtn: {
        flexShrink: 0,
        width: "36px",
        height: "36px",
        display: "grid",
        placeItems: "center",
        background: "rgba(245, 242, 232, 0.06)",
        border: "1px solid rgba(245, 242, 232, 0.15)",
        borderRadius: "50%",
        color: "#d4e9ed",
        fontSize: "23px",
        lineHeight: 1,
        cursor: "pointer",
        transition: "all 150ms ease",
    },
    progressTrack: {
        height: "3px",
        width: "100%",
        background: "rgba(245, 242, 232, 0.12)",
        borderRadius: "99px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: "99px",
        background: "linear-gradient(90deg, #8dcf94, #bc9553)",
        transition: "width 220ms ease",
    },
    contentBody: { padding: "4px 0 2px" },
    factTag: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: "10px",
        lineHeight: 1,
        fontWeight: 700,
        color: "#e5c88f",
        backgroundColor: "rgba(188, 149, 83, 0.12)",
        border: "1px solid rgba(188, 149, 83, 0.28)",
        padding: "8px 11px",
        borderRadius: "999px",
        marginBottom: "16px",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
    },
    factText: {
        fontSize: "clamp(16px, 3vw, 18px)",
        lineHeight: 1.7,
        color: "#f5f2e8",
        margin: 0,
        fontWeight: 400,
    },
    supportingText: {
        fontSize: "12px",
        lineHeight: 1.6,
        color: "#a9bdb2",
        margin: "18px 0 0",
        fontStyle: "italic",
    },
    modalFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        borderTop: "1px solid rgba(245, 242, 232, 0.13)",
        paddingTop: "18px",
    },
    counter: { display: "flex", alignItems: "center", gap: "7px", color: "#9db1a5", fontSize: "12px", letterSpacing: "0.06em" },
    counterCurrent: { color: "#a5dfa9", fontSize: "14px" },
    counterDivider: { color: "#61796d" },
    btnGroup: { display: "flex", gap: "8px" },
    navBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        background: "rgba(245, 242, 232, 0.04)",
        border: "1px solid rgba(245, 242, 232, 0.18)",
        color: "#d4e9ed",
        padding: "10px 13px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 150ms ease",
    },
    nextBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "#a5dfa9",
        border: "1px solid #a5dfa9",
        color: "#19362f",
        padding: "10px 16px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 150ms ease",
    },
};
