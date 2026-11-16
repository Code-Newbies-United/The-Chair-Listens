// pages/admin/pathways.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { requireAdminSSR } from "@/lib/requireAdminSSR";

export const getServerSideProps = requireAdminSSR();

const emptyForm = { key: "", label: "", description: "", ai_system_prompt: "" };

export default function ManagePathways() {
    const [pathways, setPathways] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyKey, setBusyKey] = useState(null);

    // Which pathway is being edited, and its draft values
    const [editingKey, setEditingKey] = useState(null);
    const [editForm, setEditForm] = useState({ label: "", description: "", ai_system_prompt: "" });

    // "Add a pathway" form
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    async function handleLogout() {
        await fetch("/api/admin-logout", { method: "POST" });
        window.location.href = "/admin/login";
    }

    async function load() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/pathways");
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load pathways");
            setPathways(data.pathways || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load pathways. Refresh the page to try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function patch(body, failMessage) {
        setError("");
        const res = await fetch("/api/admin/pathways", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || failMessage);
        }
    }

    async function handleToggleActive(p) {
        if (
            p.active &&
            !confirm(
                `Switch off "${p.label}"? Visitors will no longer see it on the Choose your path page. Questions and past responses are kept.`
            )
        ) {
            return;
        }
        setBusyKey(p.key);
        try {
            await patch({ key: p.key, active: !p.active }, "Failed to update pathway");
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusyKey(null);
        }
    }

    async function handleMove(index, direction) {
        const target = index + direction;
        if (target < 0 || target >= pathways.length) return;

        const keys = pathways.map((p) => p.key);
        [keys[index], keys[target]] = [keys[target], keys[index]];

        setBusyKey(pathways[index].key);
        try {
            await patch({ order: keys }, "Failed to reorder pathways");
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusyKey(null);
        }
    }

    function startEdit(p) {
        setEditingKey(p.key);
        setEditForm({ label: p.label, description: p.description, ai_system_prompt: "" });
        setError("");
    }

    async function handleSaveEdit(e) {
        e.preventDefault();
        const body = {
            key: editingKey,
            label: editForm.label,
            description: editForm.description,
        };
        // Blank means "keep the current prompt".
        if (editForm.ai_system_prompt.trim()) {
            body.ai_system_prompt = editForm.ai_system_prompt;
        }

        setBusyKey(editingKey);
        try {
            await patch(body, "Failed to save changes");
            setEditingKey(null);
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusyKey(null);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        setError("");

        if (!form.key.trim() || !form.label.trim() || !form.description.trim()) {
            setError("Key, label and description are required.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/pathways", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: form.key.trim(),
                    label: form.label,
                    description: form.description,
                    ai_system_prompt: form.ai_system_prompt,
                    active: false,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to add pathway");
            }
            setForm(emptyForm);
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
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

                button, a, input, textarea, select {
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
                    margin: 0 0 8px 0;
                }

                .admin-intro {
                    color: var(--text-muted);
                    font-size: 13px;
                    line-height: 1.5;
                    margin: 0 0 20px 0;
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
                    background: rgba(255, 255, 255, 0.7);
                    border: 1.5px solid rgba(82, 107, 97, 0.2);
                    border-radius: 16px;
                    padding: 16px;
                }

                .admin-list-item-inactive {
                    border-style: dashed;
                    background: rgba(255, 255, 255, 0.45);
                }

                .admin-path-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                }

                .admin-path-key {
                    font-size: 10px;
                    font-weight: 800;
                    color: var(--ochre);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 4px;
                }

                .admin-path-label {
                    color: var(--forest);
                    font-size: 16px;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .admin-path-desc {
                    color: var(--text-muted);
                    font-size: 12.5px;
                    line-height: 1.45;
                    margin-top: 4px;
                }

                .admin-status {
                    flex-shrink: 0;
                    padding: 3px 9px;
                    border-radius: 100px;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .admin-status-on {
                    background: rgba(141, 207, 148, 0.4);
                    color: var(--forest-dark);
                }
                .admin-status-off {
                    background: rgba(82, 107, 97, 0.14);
                    color: var(--text-muted);
                }

                .admin-path-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }

                .admin-small-btn {
                    background: transparent;
                    border: 1px solid rgba(82, 107, 97, 0.3);
                    color: var(--forest);
                    border-radius: 100px;
                    padding: 6px 12px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 160ms ease;
                }
                .admin-small-btn:hover:not(:disabled) {
                    border-color: var(--ochre);
                    background: rgba(188, 149, 83, 0.1);
                }
                .admin-small-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .admin-small-btn-primary {
                    background: var(--mint);
                    border-color: var(--mint);
                    color: var(--forest-dark);
                }
                .admin-small-btn-primary:hover:not(:disabled) {
                    background: var(--mint-bright);
                    border-color: var(--mint-bright);
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

                .admin-edit-form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 12px;
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

                .admin-hint {
                    color: var(--text-muted);
                    font-size: 11.5px;
                    margin: 0;
                    line-height: 1.45;
                }

                .admin-error {
                    color: #b95c51;
                    font-size: 12.5px;
                    margin: 0 0 12px 0;
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
                    gap: 10px;
                    flex-wrap: wrap;
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

                <h1 className="admin-title">Manage Pathways</h1>
                <p className="admin-intro">
                    These are the reflection paths visitors can choose from. Switch a pathway on
                    when its questions are ready. Changes can take up to 30 seconds to show for
                    visitors.
                </p>

                {error && (
                    <p className="admin-error" role="alert">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="admin-muted">Loading...</p>
                ) : pathways.length === 0 ? (
                    <p className="admin-muted">No pathways yet.</p>
                ) : (
                    <ul className="admin-list">
                        {pathways.map((p, index) => (
                            <li
                                key={p.key}
                                className={`admin-list-item ${p.active ? "" : "admin-list-item-inactive"}`}
                            >
                                <div className="admin-path-head">
                                    <div>
                                        <div className="admin-path-key">{p.key}</div>
                                        <div className="admin-path-label">{p.label}</div>
                                        <div className="admin-path-desc">{p.description}</div>
                                    </div>
                                    <span
                                        className={`admin-status ${
                                            p.active ? "admin-status-on" : "admin-status-off"
                                        }`}
                                    >
                                        {p.active ? "Live" : "Off"}
                                    </span>
                                </div>

                                {editingKey === p.key ? (
                                    <form onSubmit={handleSaveEdit} className="admin-edit-form">
                                        <input
                                            type="text"
                                            value={editForm.label}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, label: e.target.value })
                                            }
                                            placeholder="Label"
                                            maxLength={60}
                                            className="admin-input"
                                        />
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, description: e.target.value })
                                            }
                                            placeholder="Description shown on the card"
                                            rows={2}
                                            maxLength={200}
                                            className="admin-textarea"
                                        />
                                        <textarea
                                            value={editForm.ai_system_prompt}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    ai_system_prompt: e.target.value,
                                                })
                                            }
                                            placeholder="New AI prompt (optional)"
                                            rows={4}
                                            className="admin-textarea"
                                        />
                                        <p className="admin-hint">
                                            Leave the AI prompt blank to keep the current one. For
                                            safety, the current prompt is never shown here.
                                        </p>
                                        <div className="admin-path-actions">
                                            <button
                                                type="submit"
                                                disabled={busyKey === p.key}
                                                className="admin-small-btn admin-small-btn-primary"
                                            >
                                                {busyKey === p.key ? "Saving..." : "Save changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingKey(null)}
                                                className="admin-small-btn"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="admin-path-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(p)}
                                            disabled={busyKey === p.key}
                                            className={`admin-small-btn ${
                                                p.active ? "" : "admin-small-btn-primary"
                                            }`}
                                        >
                                            {p.active ? "Switch off" : "Switch on"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => startEdit(p)}
                                            className="admin-small-btn"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMove(index, -1)}
                                            disabled={index === 0 || busyKey !== null}
                                            className="admin-small-btn"
                                            aria-label={`Move ${p.label} up`}
                                        >
                                            ↑ Up
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMove(index, 1)}
                                            disabled={index === pathways.length - 1 || busyKey !== null}
                                            className="admin-small-btn"
                                            aria-label={`Move ${p.label} down`}
                                        >
                                            ↓ Down
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleAdd} className="admin-form">
                    <h3 className="admin-form-title">Add a Pathway</h3>
                    <input
                        type="text"
                        placeholder="Key (e.g. prostate)"
                        value={form.key}
                        onChange={(e) => setForm({ ...form, key: e.target.value })}
                        className="admin-input"
                    />
                    <p className="admin-hint">
                        The key is the pathway's internal name. Use lowercase letters, and it
                        cannot be changed later.
                    </p>
                    <input
                        type="text"
                        placeholder="Label (e.g. So About Prostate)"
                        value={form.label}
                        onChange={(e) => setForm({ ...form, label: e.target.value })}
                        maxLength={60}
                        className="admin-input"
                    />
                    <textarea
                        placeholder="Description shown on the card"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={2}
                        maxLength={200}
                        className="admin-textarea"
                    />
                    <textarea
                        placeholder="AI prompt (optional, leave blank to use the default)"
                        value={form.ai_system_prompt}
                        onChange={(e) => setForm({ ...form, ai_system_prompt: e.target.value })}
                        rows={4}
                        className="admin-textarea"
                    />
                    <p className="admin-hint">
                        New pathways start switched off, so you can add their questions first.
                    </p>
                    <button type="submit" disabled={saving} className="admin-add-btn">
                        {saving ? "Adding..." : "Add Pathway"}
                    </button>
                </form>

                <div className="admin-bottom-nav">
                    <Link href="/admin/questions" className="admin-back-link">
                        Manage Questions
                    </Link>
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
