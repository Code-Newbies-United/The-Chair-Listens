//pages/admin/messages
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { requireAdminSSR } from "@/lib/requireAdminSSR";

export const getServerSideProps = requireAdminSSR();

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleString("en-ZA", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch {
        return "";
    }
}

export default function AdminMessages() {
    const [messages, setMessages] = useState(null); // null = loading
    const [error, setError] = useState("");
    const [confirmingId, setConfirmingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadMessages = useCallback(async () => {
        setError("");
        try {
            const res = await fetch("/api/admin/messages");
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load messages.");
            setMessages(data.messages || []);
        } catch (err) {
            setError(err.message || "Failed to load messages.");
            setMessages((current) => current ?? []);
        }
    }, []);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    async function handleDelete(id) {
        setDeletingId(id);
        setError("");
        try {
            const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            // 404 means someone else already removed it: treat as done.
            if (!res.ok && res.status !== 404) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete the message.");
            }
            setMessages((current) => (current || []).filter((m) => m.id !== id));
            setConfirmingId(null);
        } catch (err) {
            setError(err.message || "Failed to delete the message.");
        } finally {
            setDeletingId(null);
        }
    }

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
            
                .msg-intro {
                    margin: 0 0 18px;
                    color: var(--text-muted);
                    font-size: 14px;
                    line-height: 1.6;
                }

                .msg-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .msg-card {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 14px;
                    padding: 14px 16px;
                    border-radius: 16px;
                    background: var(--white);
                    border: 1px solid rgba(82, 107, 97, 0.2);
                }

                .msg-body {
                    min-width: 0;
                    flex: 1;
                }

                .msg-text {
                    margin: 0 0 6px;
                    color: var(--forest-deep);
                    font-size: 15px;
                    line-height: 1.55;
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                }

                .msg-date {
                    color: var(--text-muted);
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                }

                .msg-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    flex-shrink: 0;
                }

                .msg-delete-btn,
                .msg-confirm-btn,
                .msg-cancel-btn {
                    border-radius: 100px;
                    padding: 7px 14px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 160ms ease;
                }

                .msg-delete-btn {
                    background: transparent;
                    border: 1px solid #b94a48;
                    color: #b94a48;
                }
                .msg-delete-btn:hover {
                    background: rgba(185, 74, 72, 0.1);
                }

                .msg-confirm-btn {
                    background: #b94a48;
                    border: 1px solid #b94a48;
                    color: #fff;
                }
                .msg-confirm-btn:disabled {
                    opacity: 0.6;
                    cursor: wait;
                }

                .msg-cancel-btn {
                    background: transparent;
                    border: 1px solid rgba(82, 107, 97, 0.3);
                    color: var(--forest);
                }

                .msg-state {
                    padding: 28px 12px;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 14px;
                }

                .msg-error {
                    margin: 0 0 14px;
                    padding: 10px 14px;
                    border-radius: 12px;
                    background: rgba(185, 74, 72, 0.1);
                    color: #8f2f2d;
                    font-size: 13px;
                    font-weight: 600;
                }

                @media (max-width: 520px) {
                    .msg-card {
                        flex-direction: column;
                    }
                    .msg-actions {
                        flex-direction: row;
                    }
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

                <h1 className="admin-title">Community Messages</h1>
                <p className="msg-intro">
                    Messages visitors leave for others appear on the reflection page straight
                    away. If one is dangerous or explicit, delete it here. Deleting is
                    permanent and removes it from the public page immediately.
                </p>

                {error && (
                    <p role="alert" className="msg-error">
                        {error}
                    </p>
                )}

                {messages === null ? (
                    <p className="msg-state">Loading messages…</p>
                ) : messages.length === 0 ? (
                    <p className="msg-state">No messages yet.</p>
                ) : (
                    <ul className="msg-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {messages.map((m) => (
                            <li key={m.id} className="msg-card">
                                <div className="msg-body">
                                    <p className="msg-text">{m.message}</p>
                                    <span className="msg-date">{formatDate(m.created_at)}</span>
                                </div>

                                <div className="msg-actions">
                                    {confirmingId === m.id ? (
                                        <>
                                            <button
                                                type="button"
                                                className="msg-confirm-btn"
                                                disabled={deletingId === m.id}
                                                onClick={() => handleDelete(m.id)}
                                            >
                                                {deletingId === m.id ? "Deleting…" : "Delete permanently"}
                                            </button>
                                            <button
                                                type="button"
                                                className="msg-cancel-btn"
                                                disabled={deletingId === m.id}
                                                onClick={() => setConfirmingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className="msg-delete-btn"
                                            onClick={() => setConfirmingId(m.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
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