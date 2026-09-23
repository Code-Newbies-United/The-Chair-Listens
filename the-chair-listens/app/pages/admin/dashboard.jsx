// Destination: pages/admin/dashboard.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { requireAdminSSR } from "@/lib/requireAdminSSR";

export const getServerSideProps = requireAdminSSR();

const SCRIPT_LABELS = {
  men_mental_health: "For Men",
  ally_support: "Ally & Support",
  fast_track_activations: "Today's Event",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [visitTotals, setVisitTotals] = useState([]);
  const [visitTotalsLoading, setVisitTotalsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || `HTTP ${res.status} Error`);
          }
          return data;
        })
        .then((data) => setStats(data))
        .catch((err) => {
          console.error("Failed to load dashboard stats:", err.message);
          setError(err.message);
        });
  }, []);

  useEffect(() => {
    fetch("/api/visit-totals")
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || `HTTP ${res.status} Error`);
          }
          return data;
        })
        .then((data) => setVisitTotals(data.totals || []))
        .catch((err) => {
          console.error("Failed to load visit totals:", err.message);
        })
        .finally(() => setVisitTotalsLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
      <main style={styles.page}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&display=swap');
        .clisten-link-card {
          transition: transform 160ms ease, border-color 160ms ease;
        }
        .clisten-link-card:hover {
          transform: translateY(-2px);
          border-color: #B99B5B !important;
        }
      `}</style>

        <div style={styles.frame}>
          <header style={styles.header}>
            <div>
              <span style={styles.kicker}>Admin</span>
              <h1 style={styles.title}>Campaign Dashboard</h1>
            </div>
            {stats?.activeLocationName && (
                <div style={styles.liveTag}>
                  <span style={styles.liveDot} aria-hidden="true" />
                  Currently in {stats.activeLocationName}
                </div>
            )}
            <button
                type="button"
                onClick={handleLogout}
                style={styles.logoutButton}
            >
              Log out
            </button>
          </header>

          {loading ? (
              <p style={styles.muted}>Loading dashboard...</p>
          ) : error ? (
              <p style={styles.errorText}>
                Couldn't load dashboard stats right now. Please refresh.
              </p>
          ) : (
              <>
                {/* Metric Cards */}
                <div style={styles.metricGrid}>
                  <div style={styles.metricCard}>
                    <span style={styles.metricValue}>{stats.totalResponses}</span>
                    <span style={styles.metricLabel}>Total Responses</span>
                  </div>
                  <div style={styles.metricCard}>
                    <span style={styles.metricValue}>{stats.totalLocations}</span>
                    <span style={styles.metricLabel}>Locations Visited</span>
                  </div>
                </div>

                {/* Breakdown by Category */}
                <section style={styles.section}>
                  <h2 style={styles.sectionTitle}>Responses by Category</h2>
                  <div style={styles.breakdownList}>
                    {Object.entries(stats.breakdown).map(([key, count]) => {
                      const max = Math.max(...Object.values(stats.breakdown), 1);
                      const widthPct = Math.round((count / max) * 100);
                      return (
                          <div key={key} style={styles.breakdownRow}>
                            <div style={styles.breakdownHeader}>
                        <span style={styles.breakdownLabel}>
                          {SCRIPT_LABELS[key] || key}
                        </span>
                              <span style={styles.breakdownCount}>{count}</span>
                            </div>
                            <div style={styles.breakdownTrack}>
                              <div
                                  style={{ ...styles.breakdownFill, width: `${widthPct}%` }}
                              />
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </section>

                {/* Recent Locations */}
                <section style={styles.section}>
                  <h2 style={styles.sectionTitle}>Recent Locations</h2>
                  {stats.recentLocations.length === 0 ? (
                      <p style={styles.muted}>No locations pinned yet.</p>
                  ) : (
                      <ul style={styles.locationList}>
                        {stats.recentLocations.map((loc, i) => (
                            <li key={i} style={styles.locationItem}>
                      <span style={styles.locationName}>
                        {loc.active && <span style={styles.liveDotSmall} aria-hidden="true" />}
                        {loc.name}
                      </span>
                              <span style={styles.locationDate}>
                        {new Date(loc.visited_at).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                            </li>
                        ))}
                      </ul>
                  )}
                </section>
              </>
          )}

          {/* Lifetime Totals by Location */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Lifetime Totals by Location</h2>
            {visitTotalsLoading ? (
                <p style={styles.muted}>Loading totals...</p>
            ) : visitTotals.length === 0 ? (
                <p style={styles.muted}>No visits recorded yet.</p>
            ) : (
                <div style={styles.breakdownList}>
                  {visitTotals.map((row) => {
                    const max = Math.max(...visitTotals.map((r) => r.total_visits), 1);
                    const widthPct = Math.round((row.total_visits / max) * 100);
                    return (
                        <div key={row.location_id} style={styles.breakdownRow}>
                          <div style={styles.breakdownHeader}>
                            <span style={styles.breakdownLabel}>{row.location_id}</span>
                            <span style={styles.breakdownCount}>{row.total_visits}</span>
                          </div>
                          <div style={styles.breakdownTrack}>
                            <div
                                style={{ ...styles.breakdownFill, width: `${widthPct}%` }}
                            />
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}
          </section>

          {/* Quick Links */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Manage</h2>
            <div style={styles.linkGrid}>
              <Link href="/admin/set-location" className="clisten-link-card" style={styles.linkCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pinned"><path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"/><circle cx="12" cy="8" r="2"/><path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"/></svg> Pin New Location
              </Link>
              <Link href="/admin/map" className="clisten-link-card" style={styles.linkCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg> View Full Map
              </Link>
              <Link href="/admin/questions" className="clisten-link-card" style={styles.linkCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg> Manage Questions
              </Link>
            </div>
          </section>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "28px",
  },
  kicker: {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    color: "#B99B5B",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  },
  title: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "24px",
    color: "#F5F6FA",
    margin: 0,
  },
  liveTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    color: "#D9C489",
    fontSize: "13px",
    fontWeight: 500,
  },
  liveDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#8FD19E",
    display: "inline-block",
  },
  liveDotSmall: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#8FD19E",
    display: "inline-block",
    marginRight: "7px",
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
  muted: { color: "#7E88AC", fontSize: "13.5px" },
  errorText: { color: "#FF6B6B", fontSize: "13.5px" },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "32px",
  },
  metricCard: {
    backgroundColor: "rgba(15, 30, 74, 0.6)",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metricValue: {
    fontFamily: "'IBM Plex Serif', serif",
    fontSize: "28px",
    fontWeight: 700,
    color: "#F5F6FA",
  },
  metricLabel: {
    fontSize: "12.5px",
    color: "#AEB8D6",
  },
  section: { marginBottom: "32px" },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#D9C489",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "14px",
  },
  breakdownList: { display: "flex", flexDirection: "column", gap: "14px" },
  breakdownRow: {},
  breakdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13.5px",
    color: "#F5F6FA",
    marginBottom: "6px",
  },
  breakdownLabel: {},
  breakdownCount: { color: "#AEB8D6" },
  breakdownTrack: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "rgba(174, 184, 214, 0.15)",
    overflow: "hidden",
  },
  breakdownFill: {
    height: "100%",
    backgroundColor: "#B99B5B",
    borderRadius: "3px",
    transition: "width 300ms ease",
  },
  locationList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" },
  locationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(15, 30, 74, 0.4)",
    border: "1px solid rgba(174, 184, 214, 0.15)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13.5px",
  },
  locationName: { color: "#F5F6FA", display: "flex", alignItems: "center" },
  locationDate: { color: "#7E88AC", fontSize: "12px" },
  linkGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
  },
  linkCard: {
    display: "block",
    padding: "16px 18px",
    borderRadius: "12px",
    border: "1.5px solid rgba(174, 184, 214, 0.2)",
    color: "#F5F6FA",
    textDecoration: "none",
    fontSize: "14.5px",
    fontWeight: 500,
    backgroundColor: "rgba(15, 30, 74, 0.4)",
  },
};
