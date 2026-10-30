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
        <main className="admin-page">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800;900&family=Pinyon+Script&display=swap');

                :root {
                    --forest: #2d5046;
                    --forest-dark: #203f36;
                    --forest-deep: #19362f;

                    --mint: #8dcf94;
                    --mint-bright: #a5dfa9;

                    --powder-blue: #d4e9ed;
                    --cream: #f5f2e8;
                    --white: #fbfaf5;

                    --ochre: #bc9553;
                    --sage: #526b61;
                    --text-muted: #52645e;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    background: var(--forest);
                }

                body {
                    overflow-x: hidden;
                }

                button, a, input, textarea {
                    font: inherit;
                }

                .admin-page {
                    min-height: 100dvh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        radial-gradient(circle at 100% 0%, rgba(141, 207, 148, 0.2), transparent 30%),
                        radial-gradient(circle at 0% 90%, rgba(212, 233, 237, 0.1), transparent 28%),
                        var(--forest);
                    color: var(--white);
                    font-family: "IBM Plex Sans", "Benton Sans", "Helvetica Neue", Arial, sans-serif;
                    padding: max(28px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right)) max(40px, env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left));
                }

                .admin-frame {
                    position: relative;
                    width: 100%;
                    max-width: 620px;
                    padding: 35px 20px 30px;
                    border-radius: 27px;
                    background: var(--cream);
                    color: var(--forest);
                    box-shadow: 0 24px 60px rgba(17, 45, 37, 0.25);
                }

                .admin-topbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .admin-brand-area {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .admin-brand-logo {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 1px solid rgba(45, 80, 70, 0.25);
                }

                .admin-brand {
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.13em;
                    text-transform: uppercase;
                    color: var(--forest);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .admin-brand-mark {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: var(--mint);
                    box-shadow: 0 0 0 3px rgba(141, 207, 148, 0.2);
                }

                .admin-logout-btn {
                    background: transparent;
                    border: 1px solid rgba(82, 107, 97, 0.3);
                    border-radius: 100px;
                    padding: 6px 14px;
                    color: var(--forest);
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 160ms ease;
                }
                .admin-logout-btn:hover {
                    border-color: var(--ochre);
                    background: rgba(188, 149, 83, 0.1);
                }

                .admin-title {
                    color: var(--forest);
                    font-size: clamp(28px, 7vw, 40px);
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    margin: 0 0 16px 0;
                }

                .admin-tab-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .admin-tab {
                    padding: 8px 16px;
                    border-radius: 100px;
                    border: 1.5px solid rgba(82, 107, 97, 0.2);
                    background: rgba(255, 255, 255, 0.5);
                    color: var(--text-muted);
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 160ms ease;
                }

                .admin-tab-active {
                    padding: 8px 16px;
                    border-radius: 100px;
                    border: 1.5px solid var(--ochre);
                    background: rgba(188, 149, 83, 0.15);
                    color: var(--forest-dark);
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .admin-script-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .admin-script-pill {
                    padding: 6px 12px;
                    border-radius: 100px;
                    border: 1.5px solid rgba(82, 107, 97, 0.2);
                    background: rgba(255, 255, 255, 0.5);
                    color: var(--text-muted);
                    font-size: 11.5px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 160ms ease;
                }

                .admin-script-pill-active {
                    padding: 6px 12px;
                    border-radius: 100px;
                    border: 1.5px solid var(--ochre);
                    background: rgba(188, 149, 83, 0.15);
                    color: var(--forest-dark);
                    font-size: 11.5px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .admin-muted {
                    color: var(--text-muted);
                    font-size: 13.5px;
                }

                .admin-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 24px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .admin-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                    background: rgba(255, 255, 255, 0.7);
                    border: 1.5px solid rgba(82, 107, 97, 0.2);
                    border-radius: 16px;
                    padding: 16px;
                }

                .admin-list-item-title {
                    font-size: 10px;
                    font-weight: 800;
                    color: var(--ochre);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 4px;
                }

                .admin-list-item-text {
                    color: var(--forest);
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 1.4;
                }

                .admin-list-item-explanation {
                    color: var(--text-muted);
                    font-size: 12.5px;
                    marginTop: 6px;
                    line-height: 1.4;
                }

                .admin-option-preview-list {
                    list-style: none;
                    margin: 8px 0 0 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .admin-option-preview-item {
                    font-size: 12.5px;
                    font-weight: 600;
                }

                .admin-delete-btn {
                    background: transparent;
                    border: 1px solid rgba(185, 92, 81, 0.4);
                    color: #b95c51;
                    border-radius: 8px;
                    padding: 6px 10px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: background 160ms ease;
                }
                .admin-delete-btn:hover {
                    background: rgba(185, 92, 81, 0.1);
                }

                .admin-form {
                    background: rgba(255, 255, 255, 0.6);
                    border: 1.5px solid rgba(82, 107, 97, 0.2);
                    border-radius: 18px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .admin-form-title {
                    color: var(--forest);
                    font-size: 15px;
                    font-weight: 800;
                    margin: 0 0 4px 0;
                }

                .admin-input {
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1.5px solid rgba(82, 107, 97, 0.25);
                    background: rgba(255, 255, 255, 0.9);
                    color: var(--forest);
                    font-size: 14px;
                    width: 100%;
                }
                .admin-input:focus {
                    outline: none;
                    border-color: var(--ochre);
                    box-shadow: 0 0 0 3px rgba(188, 149, 83, 0.15);
                }

                .admin-textarea {
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1.5px solid rgba(82, 107, 97, 0.25);
                    background: rgba(255, 255, 255, 0.9);
                    color: var(--forest);
                    font-size: 14px;
                    resize: vertical;
                    width: 100%;
                    font-family: inherit;
                }
                .admin-textarea:focus {
                    outline: none;
                    border-color: var(--ochre);
                    box-shadow: 0 0 0 3px rgba(188, 149, 83, 0.15);
                }

                .admin-options-edit-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .admin-option-edit-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .admin-remove-option-btn {
                    background: transparent;
                    border: 1px solid rgba(185, 92, 81, 0.4);
                    color: #b95c51;
                    border-radius: 8px;
                    width: 32px;
                    height: 42px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    flex-shrink: 0;
                }

                .admin-add-option-btn {
                    align-self: flex-start;
                    background: transparent;
                    border: 1.5px dashed rgba(188, 149, 83, 0.6);
                    color: var(--ochre);
                    border-radius: 100px;
                    padding: 8px 14px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .admin-hint {
                    color: var(--text-muted);
                    font-size: 11.5px;
                    margin: 0;
                }

                .admin-error {
                    color: #b95c51;
                    font-size: 12.5px;
                    margin: 0;
                    font-weight: 600;
                }

                .admin-add-btn {
                    padding: 13px 20px;
                    border-radius: 100px;
                    border: none;
                    background: var(--mint);
                    color: var(--forest-dark);
                    font-weight: 800;
                    font-size: 13.5px;
                    cursor: pointer;
                    transition: background 160ms ease;
                }
                .admin-add-btn:hover:not(:disabled) {
                    background: var(--mint-bright);
                }
                .admin-add-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .admin-bottom-nav {
                    margin-top: 24px;
                    display: flex;
                    justify-content: center;
                }

                .admin-back-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px 24px;
                    border-radius: 100px;
                    border: 1.5px solid rgba(82, 107, 97, 0.25);
                    color: var(--forest);
                    font-size: 13px;
                    font-weight: 700;
                    text-decoration: none;
                    background: rgba(255, 255, 255, 0.62);
                    transition: all 160ms ease;
                }
                .admin-back-link:hover {
                    border-color: var(--ochre);
                    background: rgba(188, 149, 83, 0.1);
                    color: var(--forest-dark);
                    transform: translateY(-1px);
                }

                .admin-footer {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(45, 80, 70, 0.12);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    text-align: center;
                }

                .admin-footer-brand {
                    color: var(--forest-dark);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                }

                .admin-footer-tagline {
                    color: var(--sage);
                    font-size: 11px;
                }
            `}</style>

            <div className="admin-frame">
                <header className="admin-topbar">
                    <div className="admin-brand-area">
                        <img
                            className="admin-brand-logo"
                            src="/logos/factor-of-ten-logo-1.jpg"
                            alt="Factor of Ten Foundation logo"
                        />
                        <div className="admin-brand">
                            <span className="admin-brand-mark" />
                            The Chair Listens
                        </div>
                    </div>

                    <button type="button" onClick={handleLogout} className="admin-logout-btn">
                        Log out
                    </button>
                </header>

                <h1 className="admin-title">Manage Questions</h1>

                <div className="admin-tab-row">
                    <button
                        type="button"
                        onClick={() => setTab("reflection")}
                        className={tab === "reflection" ? "admin-tab-active" : "admin-tab"}
                    >
                        Reflection Questions
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("quiz")}
                        className={tab === "quiz" ? "admin-tab-active" : "admin-tab"}
                    >
                        Quiz Questions
                    </button>
                </div>

                {tab === "reflection" ? (
                    <>
                        <div className="admin-script-row">
                            {SCRIPTS.map((s) => (
                                <button
                                    key={s.key}
                                    type="button"
                                    onClick={() => setActiveScript(s.key)}
                                    className={activeScript === s.key ? "admin-script-pill-active" : "admin-script-pill"}
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

                <div className="admin-bottom-nav">
                    <Link href="/admin/dashboard" className="admin-back-link">
                        Back to Dashboard
                    </Link>
                </div>

                <footer className="admin-footer">
                    <span className="admin-footer-brand">FACTOR OF TEN</span>
                    <span className="admin-footer-tagline">Know more. Ask more. Check sooner.</span>
                </footer>
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
                <p className="admin-muted">Loading...</p>
            ) : questions.length === 0 ? (
                <p className="admin-muted">No questions yet for this category.</p>
            ) : (
                <ul className="admin-list">
                    {questions.map((q) => (
                        <li key={q.id} className="admin-list-item">
                            <div>
                                <div className="admin-list-item-title">{q.title || "Untitled"}</div>
                                <div className="admin-list-item-text">{q.question_text}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(q.id)}
                                className="admin-delete-btn"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleAdd} className="admin-form">
                <h3 className="admin-form-title">Add a Question</h3>
                <input
                    type="text"
                    placeholder="Title (e.g. 'The Silent Load')"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="admin-input"
                />
                <textarea
                    placeholder="Question text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={3}
                    className="admin-textarea"
                />
                <input
                    type="text"
                    placeholder="Placeholder text shown in the answer box"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    className="admin-input"
                />
                {error && <p className="admin-error">{error}</p>}
                <button type="submit" disabled={saving} className="admin-add-btn">
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
        setOptions((prev) => prev.map((o, i) => ({ ...o, is_correct: i === index })));
    }

    function addOption() {
        if (options.length >= 6) return;
        setOptions((prev) => [...prev, emptyOption()]);
    }

    function removeOption(index) {
        if (options.length <= 2) return;
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
                <p className="admin-muted">Loading...</p>
            ) : questions.length === 0 ? (
                <p className="admin-muted">No quiz questions yet.</p>
            ) : (
                <ul className="admin-list">
                    {questions.map((q) => (
                        <li key={q.id} className="admin-list-item">
                            <div>
                                <div className="admin-list-item-text">{q.question_text}</div>
                                <ul className="admin-option-preview-list">
                                    {(q.options || []).map((o, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                ...styles.optionPreviewItem,
                                                color: o.is_correct ? "#3e8053" : "var(--text-muted)",
                                            }}
                                            className="admin-option-preview-item"
                                        >
                                            {o.is_correct ? "✓ " : "– "}
                                            {o.text}
                                        </li>
                                    ))}
                                </ul>
                                <div className="admin-list-item-explanation">{q.explanation}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(q.id)}
                                className="admin-delete-btn"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleAdd} className="admin-form">
                <h3 className="admin-form-title">Add a Quiz Question</h3>
                <textarea
                    placeholder="Question (e.g. 'At what age should screening discussions start?')"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={2}
                    className="admin-textarea"
                />

                <div className="admin-options-edit-list">
                    {options.map((opt, i) => (
                        <div key={i} className="admin-option-edit-row">
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
                                className="admin-input"
                                style={{ flex: 1 }}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(i)}
                                    className="admin-remove-option-btn"
                                    aria-label={`Remove option ${i + 1}`}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {options.length < 6 && (
                    <button type="button" onClick={addOption} className="admin-add-option-btn">
                        + Add another option
                    </button>
                )}

                <p className="admin-hint">Select the radio button next to the correct answer.</p>

                <textarea
                    placeholder="Explanation shown after answering"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={2}
                    className="admin-textarea"
                />
                {error && <p className="admin-error">{error}</p>}
                <button type="submit" disabled={saving} className="admin-add-btn">
                    {saving ? "Adding..." : "Add Quiz Question"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    radioLabel: { display: "flex", alignItems: "center", gap: "6px", color: "#52645e", fontSize: "13px", cursor: "pointer" },
    optionPreviewItem: { fontSize: "12.5px" },
};