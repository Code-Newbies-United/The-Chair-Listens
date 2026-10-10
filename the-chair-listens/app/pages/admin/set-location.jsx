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
        
        if (
            !coords ||
            !Number.isFinite(coords.lat) ||
            coords.lat < -90 ||
            coords.lat > 90 ||
            !Number.isFinite(coords.lng) ||
            coords.lng < -180 ||
            coords.lng > 180
        ) {
            setError("Please enter valid latitude and longitude coordinates.");
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

    return (
        <main style={styles.page}>
            <div style={styles.frame}>
                <Link href="/admin/dashboard" style={styles.backLink}>
                    « Back to Dashboard
                </Link>

                <h1 style={styles.title}>Pin the Chair's Location</h1>
                <p style={styles.subtitle}>
                    Use this when the chair arrives at a new stop. This becomes the
                    live "Currently in..." location shown on the site.
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Location Name
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Durban Golf Day"
                            style={styles.input}
                        />
                    </label>

                    <button
                        type="button"
                        onClick={handleUseMyLocation}
                        disabled={locating}
                        style={styles.secondaryButton}
                    >
                        {locating ? "Getting your location..." : "📍 Use My Current Location"}
                    </button>

                    {coords && coords.lat != null && coords.lng != null && (
                        <p style={styles.coordsPreview}>
                            Coordinates set: {Number(coords.lat).toFixed(5)}, {Number(coords.lng).toFixed(5)}
                        </p>
                    )}

                    <details style={styles.manualEntry}>
                        <summary style={styles.manualSummary}>Enter coordinates manually instead</summary>
                        <div style={styles.manualFields}>
                            <input
                                type="number"
                                step="any"
                                placeholder="Latitude"
                                value={coords?.lat ?? ""}                            
                                onChange={(e) =>
                                    setCoords((prev) => ({
                                        ...(prev || {}),
                                        lng: e.target.value === "" ? undefined : parseFloat(e.target.value),
                                    }))
                                }
                                style={styles.input}
                            />
                            <input
                                type="number"
                                step="any"
                                placeholder="Longitude"
                                value={coords?.lng ?? ""}
                                onChange={(e) =>
                                    setCoords((prev) => ({ ...prev, lng: parseFloat(e.target.value) }))
                                }
                                style={styles.input}
                            />
                        </div>
                    </details>

                    {error && <p style={styles.error}>{error}</p>}
                    {status && <p style={styles.success}>{status}</p>}

                    <button type="submit" disabled={saving} style={styles.submitButton}>
                        {saving ? "Saving..." : "Pin This Location"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={async () => {
                        await fetch("/api/admin-logout", { method: "POST" });
                        router.push("/admin/login");
                    }}
                    style={styles.logoutLink}
                >
                    Log out
                </button>
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
        background: "#0A1735",
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: "32px 24px 56px",
        boxSizing: "border-box",
    },
    frame: {
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
    },
    backLink: {
        display: "inline-block",
        color: "#7E88AC",
        fontSize: "13px",
        textDecoration: "none",
        marginBottom: "24px",
    },
    title: { color: "#F5F6FA", fontSize: "22px", marginBottom: "8px" },
    subtitle: { color: "#AEB8D6", fontSize: "13.5px", lineHeight: 1.5, marginBottom: "24px" },
    form: { display: "flex", flexDirection: "column", gap: "14px" },
    label: { color: "#D9C489", fontSize: "13px", fontWeight: 600, display: "flex", flexDirection: "column", gap: "6px" },
    input: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(174, 184, 214, 0.25)",
        background: "rgba(255,255,255,0.05)",
        color: "#F5F6FA",
        fontSize: "14px",
        boxSizing: "border-box",
        width: "100%",
    },
    secondaryButton: {
        padding: "12px",
        borderRadius: "999px",
        border: "1.5px solid #B99B5B",
        background: "transparent",
        color: "#D9C489",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
    },
    coordsPreview: { color: "#8FD19E", fontSize: "12.5px", margin: 0 },
    manualEntry: { color: "#AEB8D6", fontSize: "13px" },
    manualSummary: { cursor: "pointer", marginBottom: "8px" },
    manualFields: { display: "flex", gap: "8px" },
    error: { color: "#FF6B6B", fontSize: "13px", margin: 0 },
    success: { color: "#8FD19E", fontSize: "13px", margin: 0 },
    submitButton: {
        padding: "13px",
        borderRadius: "999px",
        border: "none",
        background: "#B99B5B",
        color: "#0A1735",
        fontWeight: 700,
        fontSize: "14px",
        cursor: "pointer",
    },
    logoutLink: {
        display: "block",
        margin: "20px auto 0",
        background: "none",
        border: "none",
        color: "#7E88AC",
        fontSize: "12.5px",
        textDecoration: "underline",
        cursor: "pointer",
        textAlign: "center",
    },
};