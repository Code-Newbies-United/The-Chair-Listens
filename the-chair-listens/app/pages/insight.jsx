// Destination: pages/insight.jsx
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const SCRIPT_TITLES = {
    men_mental_health: "For Men",
    ally_support: "Ally & Support System",
    fast_track_activations: "Today's Event",
};

const COLORS = {
    forest: "#2D5046",
    dark: "#203F36",
    deep: "#19362F",
    mint: "#8DCF94",
    brightMint: "#A5DFA9",
    cream: "#F5F2E8",
    white: "#FBFAF5",
    blue: "#D4E9ED",
    ochre: "#BC9553",
    sage: "#526B61",
};

const INTERACTIVE_CARDS = [
    {
        id: 1,
        type: "quiz",
        badge: "PROSTATE CHECK · 01",
        question: "Roughly how big is a healthy prostate gland in a younger man?",
        options: [
            { label: "Size of a pea", correct: false },
            { label: "Size of a walnut", correct: true },
            { label: "Size of a tennis ball", correct: false },
        ],
        feedback:
            "Spot on! A healthy prostate is about the size and shape of a walnut, sitting just below the bladder—though it naturally grows as men age.",
    },
    {
        id: 2,
        type: "dyk",
        badge: "DID YOU KNOW? · 01",
        headline: "Early prostate changes rarely shout.",
        fact: "Most men with early-stage prostate cancer have zero noticeable symptoms. Waiting until something hurts means waiting too long—a simple conversation and PSA blood test can catch changes years earlier.",
        actionLabel: "Got it — Next →",
    },
    {
        id: 3,
        type: "quiz",
        badge: "PROSTATE CHECK · 02",
        question: "What does a PSA test actually involve?",
        options: [
            { label: "A quick, routine blood draw", correct: true },
            { label: "An overnight hospital stay", correct: false },
            { label: "A painful surgical biopsy", correct: false },
        ],
        feedback:
            "Yes! A Prostate-Specific Antigen (PSA) test is just a standard blood test from your arm. Quick, simple, and a great starting point with your doctor.",
    },
    {
        id: 4,
        type: "dyk",
        badge: "DID YOU KNOW? · 02",
        headline: "Family history & ancestry matter.",
        fact: "Black men and men with a father or brother who had prostate cancer face a significantly higher risk—and often develop it earlier. Starting the screening conversation around age 40–45 is a smart move.",
        actionLabel: "Good to know — Next →",
    },
    {
        id: 5,
        type: "quiz",
        badge: "PROSTATE CHECK · 03",
        question: "If you're supporting a brother, partner, or friend, what helps most?",
        options: [
            { label: "Lecturing them until they book a doctor", correct: false },
            { label: "Normalising the chat & offering to go with them", correct: true },
            { label: "Waiting for them to bring it up first", correct: false },
        ],
        feedback:
            "Exactly. A casual check-in, sharing what you learned today, or offering a lift to the clinic removes half the hesitation.",
    },
];

function playCelebrationChime() {
    if (typeof window === "undefined") return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const context = new AudioContext();
        const now = context.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.type = "triangle";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.001, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.09 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
            osc.connect(gain);
            gain.connect(context.destination);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.38);
        });
        window.setTimeout(() => context.close().catch(() => {}), 1000);
    } catch (e) {
        // Audio optional
    }
}

export default function InsightPage({ locationName = "Pretoria" }) {
    const router = useRouter();

    // Stages: "popup" -> "interactive" -> "contribute"
    const [stage, setStage] = useState("popup");
    const [cardIndex, setCardIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);

    // Contributor & suggestion form state
    const [suggestion, setSuggestion] = useState("");
    const [contributorName, setContributorName] = useState("");
    const [contributorTitle, setContributorTitle] = useState("");
    const [savingContribution, setSavingContribution] = useState(false);
    const [contributionSaved, setContributionSaved] = useState(false);

    const script =
        typeof router.query.script === "string"
            ? router.query.script
            : "men_mental_health";
    const trackTitle = SCRIPT_TITLES[script] || "For Men";
    const location =
        typeof router.query.location === "string"
            ? decodeURIComponent(router.query.location)
            : locationName;

    const reflectionQuery = useMemo(() => {
        const query = {};
        ["script", "data", "location", "summary"].forEach((key) => {
            if (typeof router.query[key] === "string") query[key] = router.query[key];
        });
        return query;
    }, [router.query]);

    const handleAcceptPopup = () => {
        playCelebrationChime();
        setStage("interactive");
    };

    const handleNextCard = () => {
        setSelectedOption(null);
        if (cardIndex < INTERACTIVE_CARDS.length - 1) {
            setCardIndex((prev) => prev + 1);
        } else {
            setStage("contribute");
        }
    };

    // Button 1: Submit Name, Title & Suggestion
    const handleSaveContribution = async () => {
        if (savingContribution || contributionSaved) return;

        const cleanName = contributorName.trim();
        const cleanTitle = contributorTitle.trim();
        const cleanSuggestion = suggestion.trim();

        if (!cleanName && !cleanSuggestion) return;

        setSavingContribution(true);

        if (cleanName) {
            try {
                const existing = JSON.parse(
                    window.localStorage.getItem("chair_contributors") || "[]"
                );
                const updated = [
                    {
                        id: Date.now(),
                        name: cleanName,
                        title: cleanTitle || "Community Voice",
                        location,
                        suggestion: cleanSuggestion,
                    },
                    ...existing,
                ].slice(0, 20);
                window.localStorage.setItem(
                    "chair_contributors",
                    JSON.stringify(updated)
                );
            } catch (err) {
                console.error("Failed to save contributor locally:", err);
            }
        }

        try {
            await fetch("/api/contributors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: cleanName,
                    title: cleanTitle,
                    suggestion: cleanSuggestion,
                    script,
                    location,
                }),
            });
        } catch (_) {
            // Fail gracefully if backend route is not yet created
        } finally {
            setSavingContribution(false);
            setContributionSaved(true);
        }
    };

    // Button 2: Continue directly to Moment of Reflection
    const handleContinueToReflection = () => {
        router.push({ pathname: "/responses", query: reflectionQuery });
    };

    if (!router.isReady) return null;

    const currentCard = INTERACTIVE_CARDS[cardIndex];
    const hasContributionInput =
        contributorName.trim().length > 0 || suggestion.trim().length > 0;

    return (
        <main
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                color: COLORS.white,
                background: `radial-gradient(circle at 85% 15%, rgba(141,207,148,0.18), transparent 35%), ${COLORS.forest}`,
                fontFamily: "'Plus Jakarta Sans', 'Benton Sans', sans-serif",
                padding: "0 5%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* Top Bar */}
            <header
                style={{
                    height: "82px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(245,242,232,.14)",
                    zIndex: 2,
                }}
            >
                <a
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: COLORS.white,
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                    }}
                >
                    <Image
                        src="/logos/factor-of-ten-logo.jpg"
                        alt="Factor of Ten"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    <span>The Chair Listens</span>
                </a>
                <div
                    style={{
                        border: "1px solid rgba(245,242,232,.25)",
                        borderRadius: "30px",
                        padding: "8px 14px",
                        fontSize: "12px",
                        color: COLORS.cream,
                    }}
                >
                    <span style={{ color: COLORS.mint, marginRight: "6px" }}>●</span>
                    {location}
                </div>
            </header>

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "36px 0",
                    zIndex: 2,
                }}
            >
                {/* STAGE 1: EXCITING POP-UP MODAL */}
                {stage === "popup" && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="pivot-popup-title"
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(13, 32, 27, 0.82)",
                            backdropFilter: "blur(8px)",
                            display: "grid",
                            placeItems: "center",
                            padding: "20px",
                            zIndex: 50,
                        }}
                    >
                        <div
                            style={{
                                width: "min(100%, 500px)",
                                background: COLORS.cream,
                                color: COLORS.deep,
                                borderRadius: "32px",
                                padding: "40px 32px 34px",
                                textAlign: "center",
                                boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
                                border: `3px solid ${COLORS.mint}`,
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: COLORS.deep,
                                    color: COLORS.brightMint,
                                    padding: "7px 16px",
                                    borderRadius: "999px",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    marginBottom: "18px",
                                }}
                            >
                                <span>✦</span> {trackTitle} · Unlocked <span>✦</span>
                            </div>

                            <h1
                                id="pivot-popup-title"
                                style={{
                                    fontSize: "clamp(30px, 6vw, 40px)",
                                    lineHeight: 1.06,
                                    fontWeight: 800,
                                    letterSpacing: "-0.03em",
                                    margin: "0 0 14px",
                                    color: COLORS.deep,
                                }}
                            >
                                Are you ready to talk about{" "}
                                <span style={{ color: "#1f82dc" }}>prostate cancer?</span>
                            </h1>

                            <p
                                style={{
                                    fontSize: "15px",
                                    lineHeight: 1.6,
                                    color: COLORS.sage,
                                    margin: "0 auto 28px",
                                    maxWidth: "380px",
                                }}
                            >
                                Before we reveal your personal reflection, take 60 seconds to
                                bust myths, test your knowledge, and help shape The Chair.
                            </p>

                            <button
                                type="button"
                                onClick={handleAcceptPopup}
                                style={{
                                    width: "100%",
                                    border: 0,
                                    borderRadius: "999px",
                                    background: COLORS.mint,
                                    color: COLORS.deep,
                                    padding: "17px 24px",
                                    fontSize: "16px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    boxShadow: "0 12px 28px rgba(45, 80, 70, 0.25)",
                                }}
                            >
                                Yes, Let’s Do This! →
                            </button>
                        </div>
                    </div>
                )}

                {/* STAGE 2: MIXED INTERACTIVE QUIZ & DID YOU KNOW CARDS */}
                {stage === "interactive" && (
                    <section
                        style={{
                            width: "min(100%, 620px)",
                            background: COLORS.cream,
                            color: COLORS.deep,
                            borderRadius: "30px",
                            padding: "34px 28px",
                            boxShadow: "0 24px 60px rgba(10, 28, 23, 0.35)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "12px",
                            }}
                        >
              <span
                  style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      color:
                          currentCard.type === "dyk" ? COLORS.ochre : "#1f82dc",
                  }}
              >
                {currentCard.badge}
              </span>
                            <span
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    color: COLORS.sage,
                                }}
                            >
                {cardIndex + 1} / {INTERACTIVE_CARDS.length}
              </span>
                        </div>

                        <div
                            style={{
                                height: "6px",
                                background: "#dce9df",
                                borderRadius: "999px",
                                overflow: "hidden",
                                marginBottom: "26px",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${((cardIndex + 1) / INTERACTIVE_CARDS.length) * 100}%`,
                                    background:
                                        currentCard.type === "dyk" ? COLORS.ochre : COLORS.mint,
                                    transition: "width 0.3s ease",
                                }}
                            />
                        </div>

                        {currentCard.type === "quiz" ? (
                            <div>
                                <h2
                                    style={{
                                        fontSize: "clamp(22px, 4vw, 28px)",
                                        lineHeight: 1.2,
                                        fontWeight: 800,
                                        margin: "0 0 22px",
                                        color: COLORS.deep,
                                    }}
                                >
                                    {currentCard.question}
                                </h2>

                                <div style={{ display: "grid", gap: "12px" }}>
                                    {currentCard.options.map((opt, idx) => {
                                        const isPicked = selectedOption === idx;
                                        const showResult = selectedOption !== null;
                                        let bg = COLORS.white;
                                        let border = "2px solid rgba(45, 80, 70, 0.14)";

                                        if (showResult) {
                                            if (opt.correct) {
                                                bg = "#d4f3d8";
                                                border = "2px solid #2d8a4e";
                                            } else if (isPicked && !opt.correct) {
                                                bg = "#fbe0dc";
                                                border = "2px solid #c94a38";
                                            }
                                        }

                                        return (
                                            <button
                                                key={opt.label}
                                                type="button"
                                                disabled={showResult}
                                                onClick={() => setSelectedOption(idx)}
                                                style={{
                                                    width: "100%",
                                                    textAlign: "left",
                                                    padding: "16px 18px",
                                                    borderRadius: "16px",
                                                    background: bg,
                                                    border,
                                                    color: COLORS.deep,
                                                    fontSize: "15px",
                                                    fontWeight: 700,
                                                    cursor: showResult ? "default" : "pointer",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span>{opt.label}</span>
                                                {showResult && opt.correct && <span>✓</span>}
                                                {showResult && isPicked && !opt.correct && <span>✕</span>}
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedOption !== null && (
                                    <div
                                        style={{
                                            marginTop: "20px",
                                            padding: "18px",
                                            borderRadius: "16px",
                                            background: COLORS.blue,
                                            color: COLORS.deep,
                                            fontSize: "14px",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        <strong>Takeaway: </strong>
                                        {currentCard.feedback}
                                    </div>
                                )}

                                <div
                                    style={{
                                        marginTop: "24px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <button
                                        type="button"
                                        disabled={selectedOption === null}
                                        onClick={handleNextCard}
                                        style={{
                                            border: 0,
                                            borderRadius: "999px",
                                            padding: "14px 24px",
                                            background:
                                                selectedOption !== null ? COLORS.deep : "#b9c5c0",
                                            color: COLORS.cream,
                                            fontSize: "14px",
                                            fontWeight: 800,
                                            cursor: selectedOption !== null ? "pointer" : "not-allowed",
                                        }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div
                                    style={{
                                        padding: "24px",
                                        borderRadius: "20px",
                                        background: "rgba(188, 149, 83, 0.14)",
                                        border: "1.5px solid rgba(188, 149, 83, 0.4)",
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontSize: "clamp(24px, 4vw, 30px)",
                                            lineHeight: 1.15,
                                            fontWeight: 800,
                                            margin: "0 0 14px",
                                            color: COLORS.deep,
                                        }}
                                    >
                                        {currentCard.headline}
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            lineHeight: 1.7,
                                            color: "#2c4940",
                                            margin: 0,
                                        }}
                                    >
                                        {currentCard.fact}
                                    </p>
                                </div>

                                <div
                                    style={{
                                        marginTop: "24px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={handleNextCard}
                                        style={{
                                            border: 0,
                                            borderRadius: "999px",
                                            padding: "14px 24px",
                                            background: COLORS.ochre,
                                            color: COLORS.white,
                                            fontSize: "14px",
                                            fontWeight: 800,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {currentCard.actionLabel}
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* STAGE 3: HELP SHAPE THE CHAIR (TWO DISTINCT BUTTONS) */}
                {stage === "contribute" && (
                    <section
                        style={{
                            width: "min(100%, 600px)",
                            background: COLORS.cream,
                            color: COLORS.deep,
                            borderRadius: "30px",
                            padding: "36px 30px",
                            boxShadow: "0 24px 60px rgba(10, 28, 23, 0.35)",
                        }}
                    >
            <span
                style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: COLORS.ochre,
                    marginBottom: "8px",
                }}
            >
              HELP SHAPE THE CHAIR
            </span>

                        <h2
                            style={{
                                fontSize: "clamp(24px, 4.5vw, 32px)",
                                lineHeight: 1.12,
                                fontWeight: 800,
                                margin: "0 0 10px",
                            }}
                        >
                            What should we ask or add next?
                        </h2>

                        <p
                            style={{
                                fontSize: "14px",
                                lineHeight: 1.6,
                                color: COLORS.sage,
                                margin: "0 0 20px",
                            }}
                        >
                            Tell us a question you wish more men were asked, or a feature
                            that would help your community.
                        </p>

                        <textarea
                            rows={3}
                            value={suggestion}
                            disabled={contributionSaved}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder="e.g., Ask men what stops them from booking their first check-up..."
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                borderRadius: "16px",
                                border: "1.5px solid rgba(45, 80, 70, 0.2)",
                                background: contributionSaved ? "#ebe8de" : COLORS.white,
                                color: COLORS.deep,
                                fontSize: "14px",
                                fontFamily: "inherit",
                                resize: "vertical",
                                marginBottom: "22px",
                            }}
                        />

                        <div
                            style={{
                                padding: "18px",
                                borderRadius: "18px",
                                background: "rgba(141, 207, 148, 0.18)",
                                border: "1px solid rgba(45, 80, 70, 0.12)",
                                marginBottom: "24px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 800,
                                    margin: "0 0 4px",
                                    color: COLORS.deep,
                                }}
                            >
                                Leave your mark (Optional)
                            </p>
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: COLORS.sage,
                                    margin: "0 0 14px",
                                }}
                            >
                                Add your name and who you are to appear on our Community Wall on
                                the home page.
                            </p>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "10px",
                                }}
                            >
                                <input
                                    type="text"
                                    value={contributorName}
                                    disabled={contributionSaved}
                                    onChange={(e) => setContributorName(e.target.value)}
                                    placeholder="Your name (e.g. Thabo M.)"
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(45, 80, 70, 0.2)",
                                        background: contributionSaved ? "#ebe8de" : COLORS.white,
                                        color: COLORS.deep,
                                        fontSize: "13px",
                                    }}
                                />
                                <input
                                    type="text"
                                    value={contributorTitle}
                                    disabled={contributionSaved}
                                    onChange={(e) => setContributorTitle(e.target.value)}
                                    placeholder="Title (e.g. Brother, Coach, Survivor)"
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(45, 80, 70, 0.2)",
                                        background: contributionSaved ? "#ebe8de" : COLORS.white,
                                        color: COLORS.deep,
                                        fontSize: "13px",
                                    }}
                                />
                            </div>

                            {/* BUTTON 1: Submit Name & Title */}
                            <div style={{ marginTop: "14px" }}>
                                <button
                                    type="button"
                                    onClick={handleSaveContribution}
                                    disabled={
                                        !hasContributionInput ||
                                        savingContribution ||
                                        contributionSaved
                                    }
                                    style={{
                                        width: "100%",
                                        border: `2px solid ${
                                            contributionSaved ? "#2d8a4e" : COLORS.ochre
                                        }`,
                                        borderRadius: "999px",
                                        background: contributionSaved
                                            ? "#d4f3d8"
                                            : COLORS.ochre,
                                        color: contributionSaved ? "#1d5c32" : COLORS.white,
                                        padding: "13px 20px",
                                        fontSize: "14px",
                                        fontWeight: 800,
                                        cursor:
                                            !hasContributionInput ||
                                            savingContribution ||
                                            contributionSaved
                                                ? "default"
                                                : "pointer",
                                        opacity:
                                            !hasContributionInput && !contributionSaved ? 0.5 : 1,
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {savingContribution
                                        ? "Saving your name..."
                                        : contributionSaved
                                            ? "✓ Submitted! You're on the Community Wall"
                                            : "Submit Name & Title"}
                                </button>
                            </div>
                        </div>

                        {/* BUTTON 2: Continue to Moment of Reflection */}
                        <button
                            type="button"
                            onClick={handleContinueToReflection}
                            style={{
                                width: "100%",
                                border: 0,
                                borderRadius: "999px",
                                background: COLORS.mint,
                                color: COLORS.deep,
                                padding: "16px 24px",
                                fontSize: "15px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow: "0 10px 24px rgba(45, 80, 70, 0.16)",
                            }}
                        >
                            Continue to Moment of Reflection →
                        </button>
                    </section>
                )}
            </div>

            {/* Footer */}
            <footer
                style={{
                    height: "52px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(245,242,232,.12)",
                    color: "rgba(245,242,232,.45)",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                }}
            >
                <span>FACTOR OF TEN</span>
                <span>THE CHAIR LISTENS</span>
            </footer>
        </main>
    );
}