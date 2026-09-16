// Destination: pages/admin/questions.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { requireAdminSSR } from "@/lib/requireAdminSSR";

export const getServerSideProps = requireAdminSSR();

const SCRIPTS = [
    { key: "men_mental_health", label: "For Men" },
    { key: "ally_support", label: "Ally & Support" },
    { key: "fast_track_activations", label: "Today's Event" },
];

export default function Questions() {
    const [tab, setTab] = useState("reflection"); // "reflection" | "quiz"
    const [activeScript, setActiveScript] = useState(SCRIPTS[0].key);

    async function handleLogout() {
        await fetch("/api/admin-logout", { method: "POST" });
        window.location.href = "/admin/login";
    }

    return (
        <main style={styles.page}>
            <div style={styles.frame}>
                <div style={styles.topRow}>
                    <Link href="/admin/dashboard" style={styles.back}>
                        « Back to Dashboard
                    </Link>
                    <button type="button" onClick={handleLogout} style={styles.logoutButton}>
                        Log out
                    </button>
                </div>

                <h1 style={styles.title}>Manage Questions</h1>

                <div style={styles.tabRow}>
                    <button
                        type="button"
                        onClick={() => setTab("reflection")}
                        style={tab === "reflection" ? styles.tabActive : styles.tab}
                    >
                        Reflection Questions
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("quiz")}
                        style={tab === "quiz" ? styles.tabActive : styles.tab}
                    >
                        Quiz Questions
                    </button>
                </div>

                {tab === "reflection" ? (
                    <>
                        <div style={styles.scriptRow}>
                            {SCRIPTS.map((s) => (
                                <button
                                    key={s.key}
                                    type="button"
                                    onClick={() => setActiveScript(s.key)}
                                    style={activeScript === s.key ? styles.scriptPillActive : styles.scriptPill}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <ReflectionQuestions scriptKey={activeScript} />
                    </>
                ) : (
                    <QuizQuestions />
                )}
            </div>
        </main>
    );
}

function ReflectionQuestions({ scriptKey }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const [saving, setSaving] = useState(false);

    function load() {
        setLoading(true);
        fetch(`/api/admin/questions?script=${scriptKey}`)
            .then((res) => res.json())
            .then((data) => setQuestions(data.questions || []))
            .catch((err) => {
                console.error(err);
                setError("Failed to load questions.");
            })
            .finally(() => setLoading(false));
    }

    useEffect(load, [scriptKey]);

    async function handleAdd(e) {
        e.preventDefault();
        setError("");
        if (!questionText.trim()) {
            setError("Question text is required.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    script_key: scriptKey,
                    title,
                    question_text: questionText,
                    placeholder,
                    sort_order: questions.length,
                }),
            });
            if (!res.ok) throw new Error("Failed to add question");
            setTitle("");
            setQuestionText("");
            setPlaceholder("");
            load();
        } catch (err) {
            console.error(err);
            setError("Failed to add question.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Remove this question? This can't be undone.")) return;
        try {
            const res = await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            load();
        } catch (err) {
            console.error(err);
            setError("Failed to remove question.");
        }
    }

    return (
        <div>
            {loading ? (
                <p style={styles.muted}>Loading...</p>
            ) : questions.length === 0 ? (
                <p style={styles.muted}>No questions yet for this category.</p>
            ) : (
                <ul style={styles.list}>
                    {questions.map((q) => (
                        <li key={q.id} style={styles.listItem}>
                            <div>
                                <div style={styles.listItemTitle}>{q.title || "Untitled"}</div>
                                <div style={styles.listItemText}>{q.question_text}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(q.id)}
                                style={styles.deleteButton}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleAdd} style={styles.form}>
                <h3 style={styles.formTitle}>Add a Question</h3>
                <input
                    type="text"
                    placeholder="Title (e.g. 'The Silent Load')"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                />
                <textarea
                    placeholder="Question text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={3}
                    style={styles.textarea}
                />
                <input
                    type="text"
                    placeholder="Placeholder text shown in the answer box"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    style={styles.input}
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" disabled={saving} style={styles.addButton}>
                    {saving ? "Adding..." : "Add Question"}
                </button>
            </form>
        </div>
    );
}

const emptyOption = () => ({ text: "", is_correct: false });

function QuizQuestions() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState([emptyOption(), emptyOption()]);
    const [explanation, setExplanation] = useState("");
    const [saving, setSaving] = useState(false);

    function load() {
        setLoading(true);
        fetch("/api/admin/quiz-questions")
            .then((res) => res.json())
            .then((data) => setQuestions(data.questions || []))
            .catch((err) => {
                console.error(err);
                setError("Failed to load quiz questions.");
            })
            .finally(() => setLoading(false));
    }

    useEffect(load, []);

    function updateOptionText(index, text) {
        setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, text } : o)));
    }

    function setCorrectOption(index) {
        // Single-correct-answer model, matching the existing quiz UI
        setOptions((prev) => prev.map((o, i) => ({ ...o, is_correct: i === index })));
    }

    function addOption() {
        if (options.length >= 6) return; // sane upper bound
        setOptions((prev) => [...prev, emptyOption()]);
    }

    function removeOption(index) {
        if (options.length <= 2) return; // never go below 2
        setOptions((prev) => prev.filter((_, i) => i !== index));
    }

    function resetForm() {
        setQuestionText("");
        setOptions([emptyOption(), emptyOption()]);
        setExplanation("");
    }

    async function handleAdd(e) {
        e.preventDefault();
        setError("");

        const cleaned = options.map((o) => ({ ...o, text: o.text.trim() })).filter((o) => o.text);

        if (!questionText.trim()) {
            setError("Question text is required.");
            return;
        }
        if (cleaned.length < 2) {
            setError("At least 2 non-empty options are required.");
            return;
        }
        if (!cleaned.some((o) => o.is_correct)) {
            setError("Mark one option as the correct answer.");
            return;
        }
        if (!explanation.trim()) {
            setError("Explanation is required.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/quiz-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question_text: questionText,
                    options: cleaned,
                    explanation,
                    sort_order: questions.length,
                }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || "Failed to add");
            }
            resetForm();
            load();
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to add quiz question.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Remove this quiz question? This can't be undone.")) return;
        try {
            const res = await fetch(`/api/admin/quiz-questions?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            load();
        } catch (err) {
            console.error(err);
            setError("Failed to remove quiz question.");
        }
    }

    return (
        <div>
            {loading ? (
                <p style={styles.muted}>Loading...</p>
            ) : questions.length === 0 ? (
                <p style={styles.muted}>No quiz questions yet.</p>
            ) : (
                <ul style={styles.list}>
                    {questions.map((q) => (
                        <li key={q.id} style={styles.listItem}>
                            <div>
                                <div style={styles.listItemText}>{q.question_text}</div>
                                <ul style={styles.optionPreviewList}>
                                    {(q.options || []).map((o, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                ...styles.optionPreviewItem,
                                                color: o.is_correct ? "#8FD19E" : "#AEB8D6",
                                            }}
                                        >
                                            {o.is_correct ? "✓ " : "– "}
                                            {o.text}
                                        </li>
                                    ))}
                                </ul>
                                <div style={styles.listItemExplanation}>{q.explanation}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(q.id)}
                                style={styles.deleteButton}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleAdd} style={styles.form}>
                <h3 style={styles.formTitle}>Add a Quiz Question</h3>
                <textarea
                    placeholder="Question (e.g. 'At what age should screening discussions start?')"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={2}
                    style={styles.textarea}
                />

                <div style={styles.optionsEditList}>
                    {options.map((opt, i) => (
                        <div key={i} style={styles.optionEditRow}>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="correct-option"
                                    checked={opt.is_correct}
                                    onChange={() => setCorrectOption(i)}
                                />
                            </label>
                            <input
                                type="text"
                                placeholder={`Option ${i + 1}`}
                                value={opt.text}
                                onChange={(e) => updateOptionText(i, e.target.value)}
                                style={{ ...styles.input, flex: 1 }}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(i)}
                                    style={styles.removeOptionButton}
                                    aria-label={`Remove option ${i + 1}`}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {options.length < 6 && (
                    <button type="button" onClick={addOption} style={styles.addOptionButton}>
                        + Add another option
                    </button>
                )}

                <p style={styles.hint}>Select the radio button next to the correct answer.</p>

                <textarea
                    placeholder="Explanation shown after answering"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={2}
                    style={styles.textarea}
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" disabled={saving} style={styles.addButton}>
                    {saving ? "Adding..." : "Add Quiz Question"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "radial-gradient(120% 60% at 50% 0%, #14265C 0%, #0F1E4A 40%, #0A1735 75%, #081128 100%)",
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: "32px 20px 56px",
        boxSizing: "border-box",
    },
    frame: { width: "100%", maxWidth: "560px", margin: "0 auto" },
    topRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    back: { color: "#AEB8D6", fontSize: "14px", textDecoration: "none" },
    logoutButton: {
        background: "none",
        border: "1px solid rgba(174, 184, 214, 0.3)",
        borderRadius: "999px",
        padding: "6px 14px",
        color: "#AEB8D6",
        fontSize: "12px",
        cursor: "pointer",
    },
    title: { color: "#F5F6FA", fontSize: "22px", marginBottom: "20px" },
    tabRow: { display: "flex", gap: "10px", marginBottom: "16px" },
    tab: {
        padding: "8px 16px",
        borderRadius: "999px",
        border: "1px solid rgba(174, 184, 214, 0.25)",
        background: "transparent",
        color: "#AEB8D6",
        fontSize: "13px",
        cursor: "pointer",
    },
    tabActive: {
        padding: "8px 16px",
        borderRadius: "999px",
        border: "1px solid #B99B5B",
        background: "rgba(185, 155, 91, 0.15)",
        color: "#D9C489",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },
    scriptRow: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
    scriptPill: {
        padding: "6px 12px",
        borderRadius: "999px",
        border: "1px solid rgba(174, 184, 214, 0.2)",
        background: "transparent",
        color: "#7E88AC",
        fontSize: "12px",
        cursor: "pointer",
    },
    scriptPillActive: {
        padding: "6px 12px",
        borderRadius: "999px",
        border: "1px solid #B99B5B",
        background: "rgba(185, 155, 91, 0.12)",
        color: "#D9C489",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
    },
    muted: { color: "#7E88AC", fontSize: "13.5px" },
    list: { listStyle: "none", padding: 0, margin: "0 0 28px 0", display: "flex", flexDirection: "column", gap: "10px" },
    listItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        backgroundColor: "rgba(15, 30, 74, 0.5)",
        border: "1px solid rgba(174, 184, 214, 0.15)",
        borderRadius: "10px",
        padding: "14px",
    },
    listItemTitle: {
        fontSize: "11px",
        fontWeight: 700,
        color: "#B99B5B",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "4px",
    },
    listItemText: { color: "#F5F6FA", fontSize: "14px", lineHeight: 1.4 },
    listItemExplanation: { color: "#AEB8D6", fontSize: "12.5px", marginTop: "6px", lineHeight: 1.4 },
    optionPreviewList: { listStyle: "none", margin: "8px 0 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "3px" },
    optionPreviewItem: { fontSize: "12.5px" },
    deleteButton: {
        background: "none",
        border: "1px solid rgba(255, 107, 107, 0.4)",
        color: "#FF6B6B",
        borderRadius: "8px",
        padding: "6px 10px",
        fontSize: "12px",
        cursor: "pointer",
        flexShrink: 0,
    },
    form: {
        backgroundColor: "rgba(15, 30, 74, 0.4)",
        border: "1px solid rgba(174, 184, 214, 0.15)",
        borderRadius: "12px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    formTitle: { color: "#D9C489", fontSize: "14px", margin: "0 0 4px 0" },
    input: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(174, 184, 214, 0.25)",
        background: "rgba(10, 23, 53, 0.7)",
        color: "#F5F6FA",
        fontSize: "13.5px",
        boxSizing: "border-box",
    },
    textarea: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(174, 184, 214, 0.25)",
        background: "rgba(10, 23, 53, 0.7)",
        color: "#F5F6FA",
        fontSize: "13.5px",
        resize: "vertical",
        boxSizing: "border-box",
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    optionsEditList: { display: "flex", flexDirection: "column", gap: "8px" },
    optionEditRow: { display: "flex", alignItems: "center", gap: "8px" },
    removeOptionButton: {
        background: "none",
        border: "1px solid rgba(255, 107, 107, 0.4)",
        color: "#FF6B6B",
        borderRadius: "6px",
        width: "28px",
        height: "34px",
        fontSize: "16px",
        lineHeight: 1,
        cursor: "pointer",
        flexShrink: 0,
    },
    addOptionButton: {
        alignSelf: "flex-start",
        background: "none",
        border: "1px dashed rgba(185, 155, 91, 0.5)",
        color: "#D9C489",
        borderRadius: "8px",
        padding: "6px 12px",
        fontSize: "12.5px",
        cursor: "pointer",
    },
    hint: { color: "#7E88AC", fontSize: "11.5px", margin: 0 },
    radioRow: { display: "flex", gap: "16px" },
    radioLabel: { display: "flex", alignItems: "center", gap: "6px", color: "#AEB8D6", fontSize: "13px" },
    error: { color: "#FF6B6B", fontSize: "12.5px", margin: 0 },
    addButton: {
        padding: "11px",
        borderRadius: "999px",
        border: "none",
        background: "#B99B5B",
        color: "#0A1735",
        fontWeight: 700,
        fontSize: "13.5px",
        cursor: "pointer",
    },
};