// Destination: components/DidYouKnowModal.jsx
import { useState } from "react";

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

    if (!isOpen) return null;

    const currentFact = DID_YOU_KNOW_FACTS[currentIndex];

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
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .dyk-card {
          animation: fadeInModal 200ms ease-out forwards;
        }
        .dyk-btn:hover {
          background: rgba(185, 155, 91, 0.2) !important;
          border-color: #B99B5B !important;
          color: #F5F6FA !important;
        }
      `}</style>

            <div
                className="dyk-card"
                style={styles.modalCard}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div style={styles.modalHeader}>
                    <div style={styles.badge}>
                        <span style={styles.sparkleIcon}>💡</span> Did You Know?
                    </div>
                    <button type="button" onClick={onClose} style={styles.closeBtn}>
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div style={styles.contentBody}>
                    <span style={styles.factTag}>{currentFact.tag}</span>
                    <p style={styles.factText}>{currentFact.fact}</p>
                </div>

                {/* Footer / Controls */}
                <div style={styles.modalFooter}>
          <span style={styles.counter}>
            {currentIndex + 1} of {DID_YOU_KNOW_FACTS.length}
          </span>
                    <div style={styles.btnGroup}>
                        <button
                            type="button"
                            className="dyk-btn"
                            onClick={handlePrev}
                            style={styles.navBtn}
                        >
                            ← Prev
                        </button>
                        <button
                            type="button"
                            className="dyk-btn"
                            onClick={handleNext}
                            style={styles.navBtn}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(8, 17, 40, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },
    modalCard: {
        width: "100%",
        maxWidth: "440px",
        backgroundColor: "#0A1735",
        border: "1.5px solid rgba(185, 155, 91, 0.4)",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        fontWeight: 700,
        color: "#B99B5B",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
    },
    sparkleIcon: {
        fontSize: "14px",
    },
    closeBtn: {
        background: "none",
        border: "none",
        color: "#AEB8D6",
        fontSize: "16px",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "6px",
    },
    contentBody: {
        padding: "12px 0",
    },
    factTag: {
        display: "inline-block",
        fontSize: "11px",
        fontWeight: 600,
        color: "#D9C489",
        backgroundColor: "rgba(185, 155, 91, 0.15)",
        padding: "3px 8px",
        borderRadius: "6px",
        marginBottom: "10px",
    },
    factText: {
        fontSize: "15px",
        lineHeight: "1.5",
        color: "#F5F6FA",
        margin: 0,
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    modalFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(174, 184, 214, 0.15)",
        paddingTop: "14px",
    },
    counter: {
        fontSize: "12px",
        color: "#7E88AC",
    },
    btnGroup: {
        display: "flex",
        gap: "8px",
    },
    navBtn: {
        background: "rgba(15, 30, 74, 0.6)",
        border: "1px solid rgba(174, 184, 214, 0.2)",
        color: "#AEB8D6",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 150ms ease",
    },
};