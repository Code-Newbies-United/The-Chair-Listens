// Destination: pages/admin/login.jsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                // The server just set a real, httpOnly session cookie — that's
                // what actually gates access now, so there's nothing to store
                // client-side here.
                router.push("/admin/dashboard");
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleLogin();
    }

    return (
        <main style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

                .clisten-login-btn {
                    transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
                }
                .clisten-login-btn:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 24px rgba(185, 155, 91, 0.28);
                }
                .clisten-login-btn:not(:disabled):active {
                    transform: translateY(0px) scale(0.98);
                }
                .clisten-login-input:focus {
                    outline: none;
                    border-color: #B99B5B !important;
                    box-shadow: 0 0 0 2px rgba(185, 155, 91, 0.25);
                }
            `}</style>

            <div style={styles.card}>
                <span style={styles.kicker}>The Chair Listens</span>
                <h1 style={styles.title}>Admin Login</h1>
                <p style={styles.subtitle}>Enter the admin password to continue.</p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter password"
                    className="clisten-login-input"
                    style={styles.input}
                    autoFocus
                />

                {error && <p style={styles.error}>{error}</p>}

                <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading || !password}
                    className="clisten-login-btn"
                    style={{
                        ...styles.cta,
                        opacity: loading || !password ? 0.5 : 1,
                        cursor: loading || !password ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Checking..." : "Log In"}
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
        background:
            "radial-gradient(120% 60% at 50% 0%, #14265C 0%, #0F1E4A 40%, #0A1735 75%, #081128 100%)",
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: "32px 20px",
        boxSizing: "border-box",
    },
    card: {
        width: "100%",
        maxWidth: "360px",
        backgroundColor: "rgba(15, 30, 74, 0.6)",
        border: "1.5px solid rgba(174, 184, 214, 0.2)",
        borderRadius: "16px",
        padding: "32px 28px",
        boxSizing: "border-box",
        textAlign: "center",
    },
    kicker: {
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "#B99B5B",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "10px",
    },
    title: {
        fontWeight: 700,
        fontSize: "24px",
        color: "#F5F6FA",
        margin: "0 0 8px 0",
    },
    subtitle: {
        fontSize: "13.5px",
        color: "#AEB8D6",
        margin: "0 0 22px 0",
        lineHeight: 1.5,
    },
    input: {
        width: "100%",
        backgroundColor: "rgba(10, 23, 53, 0.7)",
        border: "1px solid rgba(174, 184, 214, 0.25)",
        borderRadius: "10px",
        padding: "12px 14px",
        color: "#F5F6FA",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: "15px",
        boxSizing: "border-box",
        marginBottom: "14px",
    },
    error: {
        fontSize: "13px",
        color: "#FF6B6B",
        margin: "0 0 14px 0",
        textAlign: "left",
    },
    cta: {
        appearance: "none",
        border: "none",
        background: "#B99B5B",
        color: "#0A1735",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 600,
        fontSize: "15px",
        padding: "13px 20px",
        borderRadius: "999px",
        width: "100%",
    },
};