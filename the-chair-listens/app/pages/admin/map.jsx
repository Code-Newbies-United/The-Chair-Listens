// Destination: pages/admin/map.jsx
import Link from "next/link";
import { requireAdminSSR } from "@/lib/requireAdminSSR";
import ChairJourneyMap from "@/components/ChairJourneyMap";

export const getServerSideProps = requireAdminSSR();

export default function AdminMap() {
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

                <ChairJourneyMap />
            </div>
        </main>
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
        marginBottom: "24px",
    },
    back: {
        color: "#AEB8D6",
        fontSize: "14px",
        textDecoration: "none",
    },
    logoutButton: {
        background: "none",
        border: "1px solid rgba(174, 184, 214, 0.3)",
        borderRadius: "999px",
        padding: "6px 14px",
        color: "#AEB8D6",
        fontSize: "12px",
        cursor: "pointer",
    },
};