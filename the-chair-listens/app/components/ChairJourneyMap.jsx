// Destination: components/ChairJourneyMap.jsx
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Leaflet touches `window`, so the actual map only ever renders client-side
const Map = dynamic(() => import("./ChairJourneyMapInner"), {
    ssr: false,
    loading: () => <div style={styles.mapLoading}>Loading map...</div>,
});

export default function ChairJourneyMap() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        fetch("/api/locations")
            .then((res) => res.json())
            .then((data) => setLocations(data.locations || []))
            .catch((err) => {
                console.error("Failed to load chair locations:", err);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetch("/api/visitor-pins")
            .then((res) => res.json())
            .then((data) => setVisitors(data.visitors || []))
            .catch((err) => {
                console.error("Failed to load recent visitors:", err);
            });
    }, []);

    const activeLocation = locations.find((loc) => loc.active);
    const pastCount = locations.filter((loc) => !loc.active).length;

    return (
        <section style={styles.section}>
            <span style={styles.kicker}>Where The Chair Has Been</span>

            {/* Live status badge */}
            <div style={styles.statusRow}>
                {activeLocation ? (
                    <>
                        <span style={styles.liveDot} aria-hidden="true" />
                        <span style={styles.statusText}>
              Currently in <strong>{activeLocation.name}</strong>
            </span>
                    </>
                ) : (
                    <span style={styles.statusTextMuted}>
            The Chair is between stops right now
          </span>
                )}
                {pastCount > 0 && (
                    <span style={styles.stopCount}>
            {pastCount} location{pastCount === 1 ? "" : "s"} visited
          </span>
                )}
            </div>

            {/* Map */}
            {loading ? (
                <div style={styles.mapLoading}>Loading locations...</div>
            ) : error ? (
                <div style={styles.mapError}>
                    Couldn't load the map right now. Please try again shortly.
                </div>
            ) : locations.length === 0 ? (
                <div style={styles.mapLoading}>
                    The Chair hasn't visited anywhere yet, check back soon.
                </div>
            ) : (
                <div style={styles.mapWrapper}>
                    <Map locations={locations} visitors={visitors} />
                </div>
            )}
        </section>
    );
}

const styles = {
    section: {
        width: "100%",
        maxWidth: "440px",
        margin: "0 auto",
        padding: "8px 0",
    },
    kicker: {
        display: "block",
        fontSize: "12px",
        fontWeight: 700,
        color: "#B99B5B",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "16px",
    },
    statusRow: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "16px",
    },
    liveDot: {
        width: "9px",
        height: "9px",
        borderRadius: "50%",
        backgroundColor: "#8FD19E",
        boxShadow: "0 0 0 0 rgba(143, 209, 158, 0.6)",
        animation: "chairLivePulse 1.8s infinite",
        flexShrink: 0,
    },
    statusText: {
        fontSize: "13.5px",
        color: "#F5F6FA",
    },
    statusTextMuted: {
        fontSize: "13.5px",
        color: "#7E88AC",
        fontStyle: "italic",
    },
    stopCount: {
        fontSize: "12px",
        color: "#7E88AC",
        marginLeft: "auto",
    },
    mapWrapper: {
        borderRadius: "16px",
        overflow: "hidden",
        border: "1.5px solid rgba(174, 184, 214, 0.2)",
    },
    mapLoading: {
        padding: "40px 0",
        textAlign: "center",
        fontSize: "13px",
        color: "#7E88AC",
        border: "1.5px dashed rgba(174, 184, 214, 0.2)",
        borderRadius: "16px",
    },
    mapError: {
        padding: "40px 0",
        textAlign: "center",
        fontSize: "13px",
        color: "#FF6B6B",
        border: "1.5px dashed rgba(255, 107, 107, 0.3)",
        borderRadius: "16px",
    },
};