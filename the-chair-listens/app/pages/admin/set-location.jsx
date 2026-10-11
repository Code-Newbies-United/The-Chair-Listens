// Destination: pages/admin/set-location.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { requireAdminSSR } from "@/lib/requireAdminSSR";

export const getServerSideProps = requireAdminSSR();

export default function SetLocation() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [coords, setCoords] = useState(null);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [locating, setLocating] = useState(false);
    const [saving, setSaving] = useState(false);

    function handleUseMyLocation() {
        if (!navigator.geolocation) {
            setError("Geolocation isn't supported on this device.");
            return;
        }

        setLocating(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocating(false);
            },
            (err) => {
                console.error("Geolocation failed:", err);
                setError("Couldn't get your location. You can enter coordinates manually below.");
                setLocating(false);
            }
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setStatus("");

        if (!name.trim()) {
            setError("Please enter a name for this location.");
            return;
        }
        if (!coords) {
            setError("Please set coordinates first, either via 'Use My Location' or manually.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/set-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), lat: coords.lat, lng: coords.lng }),
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.message || "Failed to save location");
            }

            setStatus(`"${name}" is now pinned as the active location.`);
            setName("");
            setCoords(null);
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function handleLogout() {
        await fetch("/api/admin-logout", { method: "POST" });
        router.push("/admin/login");
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

                button, a, input {
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

                .admin-header-main {
                    margin-bottom: 20px;
                }

                .admin-kicker {
                    display: block;
                    font-size: 9px;
                    font-weight: 800;
                    color: var(--ochre);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 6px;
                }

                .admin-title {
                    font-size: clamp(28px, 7vw, 42px);
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    color: var(--forest);
                    margin: 0 0 8px 0;
                    line-height: 1.1;
                }

                .admin-subtitle {
                    color: var(--text-muted);
                    font-size: 13.5px;
                    line-height: 1.5;
                    margin: 0 0 24px 0;
                }

                .admin-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .admin-field-label {
                    color: var(--forest);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .admin-input {
                    width: 100%;
                    min-height: 48px;
                    padding: 12px 16px;
                    border-radius: 14px;
                    border: 1.5px solid rgba(82, 107, 97, 0.25);
                    background: rgba(255, 255, 255, 0.7);
                    color: var(--forest);
                    font-size: 15px;
                    transition: border-color 160ms ease, box-shadow 160ms ease;
                }
                .admin-input:focus {
                    outline: none;
                    border-color: var(--ochre);
                    box-shadow: 0 0 0 3px rgba(188, 149, 83, 0.15);
                }

                .admin-secondary-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: 48px;
                    padding: 12px 20px;
                    border-radius: 100px;
                    border: 1.5px solid var(--ochre);
                    background: transparent;
                    color: var(--forest);
                    font-weight: 700;
                    font-size: 13.5px;
                    cursor: pointer;
                    transition: all 160ms ease;
                }
                .admin-secondary-btn:hover:not(:disabled) {
                    background: rgba(188, 149, 83, 0.1);
                    border-color: var(--ochre);
                }
                .admin-secondary-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .admin-coords-preview {
                    color: var(--forest-dark);
                    font-size: 13px;
                    font-weight: 600;
                    margin: 0;
                }

                .admin-manual-entry {
                    color: var(--text-muted);
                    font-size: 13px;
                }

                .admin-manual-summary {
                    cursor: pointer;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .admin-manual-fields {
                    display: flex;
                    gap: 10px;
                    margin-top: 8px;
                }

                .admin-error {
                    color: #b95c51;
                    font-size: 13px;
                    margin: 0;
                    font-weight: 600;
                }

                .admin-success {
                    color: #2e6b3e;
                    font-size: 13px;
                    margin: 0;
                    font-weight: 600;
                }

                .admin-submit-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: 52px;
                    padding: 14px 24px;
                    border-radius: 100px;
                    border: none;
                    background: var(--mint);
                    color: var(--forest-dark);
                    font-weight: 800;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 4px 14px rgba(45, 80, 70, 0.08);
                    transition: all 160ms ease;
                }
                .admin-submit-btn:hover:not(:disabled) {
                    background: var(--mint-bright);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 18px rgba(45, 80, 70, 0.14);
                }
                .admin-submit-btn:disabled {
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

                <div className="admin-header-main">
                    <span className="admin-kicker">Admin Portal</span>
                    <h1 className="admin-title">Pin the Chair's Location</h1>
                    <p className="admin-subtitle">
                        Use this when the chair arrives at a new stop. This becomes the live "Currently in..." location shown on the site.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    <label className="admin-field-label">
                        Location Name
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Durban Golf Day"
                            className="admin-input"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={handleUseMyLocation}
                        disabled={locating}
                        className="admin-secondary-btn"
                    >
                        {locating ? "Getting your location..." : "📍 Use My Current Location"}
                    </button>

                    {coords && coords.lat != null && coords.lng != null && (
                        <p className="admin-coords-preview">
                            Coordinates set: {Number(coords.lat).toFixed(5)}, {Number(coords.lng).toFixed(5)}
                        </p>
                    )}

                    <details className="admin-manual-entry">
                        <summary className="admin-manual-summary">Enter coordinates manually instead</summary>
                        <div className="admin-manual-fields">
                            <input
                                type="number"
                                step="any"
                                placeholder="Latitude"
                                value={coords?.lat ?? ""}
                                onChange={(e) =>
                                    setCoords((prev) => ({ ...prev, lat: parseFloat(e.target.value) }))
                                }
                                className="admin-input"
                            />
                            <input
                                type="number"
                                step="any"
                                placeholder="Longitude"
                                value={coords?.lng ?? ""}
                                onChange={(e) =>
                                    setCoords((prev) => ({ ...prev, lng: parseFloat(e.target.value) }))
                                }
                                className="admin-input"
                            />
                        </div>
                    </details>

                    {error && <p className="admin-error">{error}</p>}
                    {status && <p className="admin-success">{status}</p>}

                    <button type="submit" disabled={saving} className="admin-submit-btn">
                        {saving ? "Saving..." : "Pin This Location"}
                    </button>
                </form>

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