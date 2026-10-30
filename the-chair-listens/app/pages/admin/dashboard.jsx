// Destination: pages/admin/dashboard.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { requireAdminSSR } from "@/lib/requireAdminSSR";
import DidYouKnowModal from "@/components/DidYouKnowModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tab State for Analytics & Query Helper
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedKey, setCopiedKey] = useState(null);

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
        })
        .finally(() => setLoading(false));
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

  function copyToClipboard(text, key) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }

  const activeLoc = stats?.activeLocationName || "Active Location";

  // Dynamic Queries tailored to current active location
  const queries = {
    supabaseJs: `// Fetch all responses for active location
const { data, error } = await supabase
  .from('responses')
  .select('id, script_type, response_type, text_content, audio_url, created_at')
  .eq('location_name', '${activeLoc}')
  .order('created_at', { ascending: false });`,

    sqlAggregate: `-- Group responses by script category
SELECT 
  location_name,
  script_type,
  COUNT(*) AS total_responses
FROM responses
WHERE location_name = '${activeLoc}'
GROUP BY location_name, script_type;`,

    sqlToday: `-- Responses logged today across all sites
SELECT * 
FROM responses
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;`,
  };

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
            --powder-blue-dark: #b8dbe0;

            --cream: #f5f2e8;
            --white: #fbfaf5;

            --ochre: #bc9553;
            --ochre-light: #d1b071;

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

          button {
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

          .admin-location-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--forest-dark);
            background: var(--mint);
            border-radius: 100px;
            padding: 6px 12px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }

          .admin-location-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--forest);
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
            margin-bottom: 24px;
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
            font-size: clamp(32px, 8vw, 48px);
            font-weight: 900;
            letter-spacing: -0.04em;
            color: var(--forest);
            margin: 0;
            line-height: 1.05;
          }

          .admin-metric-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 11px;
            margin-bottom: 24px;
          }

          .admin-metric-card {
            background: rgba(255, 255, 255, 0.62);
            border: 1.5px solid rgba(82, 107, 97, 0.2);
            border-radius: 18px;
            padding: 18px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            box-shadow: 0 5px 14px rgba(45, 80, 70, 0.04);
          }

          .admin-metric-value {
            font-size: 28px;
            font-weight: 900;
            color: var(--forest);
            letter-spacing: -0.03em;
          }

          .admin-metric-label {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .admin-section {
            margin-bottom: 24px;
          }

          .admin-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .admin-section-title {
            font-size: 11px;
            font-weight: 800;
            color: var(--sage);
            text-transform: uppercase;
            letter-spacing: 0.14em;
            margin: 0;
          }

          .admin-tab-bar {
            display: flex;
            background: rgba(82, 107, 97, 0.12);
            padding: 3px;
            border-radius: 100px;
            border: 1px solid rgba(82, 107, 97, 0.2);
          }

          .admin-tab {
            background: transparent;
            border: none;
            color: var(--text-muted);
            padding: 5px 12px;
            fontSize: 11px;
            font-weight: 700;
            border-radius: 100px;
            cursor: pointer;
            transition: all 160ms ease;
          }

          .admin-tab.active {
            background: var(--ochre);
            color: var(--cream);
          }

          .admin-card-box {
            background: rgba(255, 255, 255, 0.62);
            border: 1.5px solid rgba(82, 107, 97, 0.2);
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 5px 14px rgba(45, 80, 70, 0.04);
          }

          .admin-card-subtitle {
            font-size: 15px;
            font-weight: 800;
            color: var(--forest);
            margin: 0 0 12px 0;
            letter-spacing: -0.02em;
          }

          .admin-breakdown-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .admin-breakdown-header {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            font-weight: 700;
            color: var(--forest);
            margin-bottom: 5px;
          }

          .admin-breakdown-count {
            color: var(--text-muted);
            font-weight: 600;
          }

          .admin-breakdown-track {
            width: 100%;
            height: 7px;
            border-radius: 100px;
            background: rgba(82, 107, 97, 0.15);
            overflow: hidden;
          }

          .admin-breakdown-fill {
            height: 100%;
            background: var(--ochre);
            border-radius: 100px;
            transition: width 300ms ease;
          }

          .admin-script-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .admin-script-box {
            background: var(--forest-dark);
            border: 1px solid rgba(141, 207, 148, 0.2);
            border-radius: 14px;
            padding: 14px;
          }

          .admin-script-box-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .admin-script-label {
            font-size: 11px;
            font-weight: 800;
            color: var(--mint);
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .admin-copy-btn {
            background: var(--mint);
            color: var(--forest-dark);
            border: none;
            padding: 4px 10px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
            transition: background 160ms ease;
          }
          .admin-copy-btn:hover {
            background: var(--mint-bright);
          }

          .admin-code-block {
            margin: 0;
            padding: 10px;
            background: rgba(25, 54, 47, 0.9);
            border-radius: 8px;
            font-size: 11.5px;
            color: var(--powder-blue);
            overflow-x: auto;
            font-family: monospace;
          }

          .admin-location-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .admin-location-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.62);
            border: 1.5px solid rgba(82, 107, 97, 0.2);
            border-radius: 14px;
            padding: 12px 16px;
            font-size: 13.5px;
            font-weight: 600;
            color: var(--forest);
          }

          .admin-location-name {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .admin-link-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .admin-link-card {
            display: flex;
            align-items: center;
            padding: 16px 18px;
            border-radius: 16px;
            border: 1.5px solid rgba(82, 107, 97, 0.2);
            color: var(--forest);
            text-decoration: none;
            font-size: 14px;
            font-weight: 700;
            background: rgba(255, 255, 255, 0.62);
            transition: all 160ms ease;
          }

          .admin-link-card:hover {
            transform: translateY(-2px);
            border-color: var(--mint);
            background: rgba(141, 207, 148, 0.14);
          }

          .admin-footer {
            margin-top: 32px;
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

          .admin-muted {
            color: var(--text-muted);
            font-size: 13.5px;
          }
          .admin-error {
            color: #b95c51;
            font-size: 13.5px;
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

            {stats?.activeLocationName && (
                <div className="admin-location-pill">
                  <span className="admin-location-dot" />
                  {stats.activeLocationName}
                </div>
            )}

            <button
                type="button"
                onClick={handleLogout}
                className="admin-logout-btn"
            >
              Log out
            </button>
          </header>

          <div className="admin-header-main">
            <span className="admin-kicker">Admin Portal</span>
            <h1 className="admin-title">Campaign Dashboard</h1>
          </div>

          {loading ? (
              <p className="admin-muted">Loading dashboard...</p>
          ) : error ? (
              <p className="admin-error">
                Couldn't load dashboard stats right now. Please refresh.
              </p>
          ) : (
              <>
                {/* Metric Cards */}
                <div className="admin-metric-grid">
                  <div className="admin-metric-card">
                    <span className="admin-metric-value">{stats.totalResponses}</span>
                    <span className="admin-metric-label">Total Responses</span>
                  </div>
                  <div className="admin-metric-card">
                    <span className="admin-metric-value">{stats.totalLocations}</span>
                    <span className="admin-metric-label">Locations Visited</span>
                  </div>
                </div>

                {/* ANALYTICS SECTION */}
                <section className="admin-section">
                  <div className="admin-section-header">
                    <h2 className="admin-section-title">Campaign Analytics</h2>

                    <div className="admin-tab-bar">
                      <button
                          type="button"
                          className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
                          onClick={() => setActiveTab("overview")}
                      >
                        Overview
                      </button>
                      <button
                          type="button"
                          className={`admin-tab ${activeTab === "scripts" ? "active" : ""}`}
                          onClick={() => setActiveTab("scripts")}
                      >
                        Select Scripts
                      </button>
                    </div>
                  </div>

                  {activeTab === "overview" ? (
                      <>
                        {stats.breakdown && Object.keys(stats.breakdown).length > 0 && (
                            <div className="admin-card-box">
                              <h3 className="admin-card-subtitle">Responses by Category</h3>
                              <div className="admin-breakdown-list">
                                {Object.entries(stats.breakdown).map(([key, count]) => {
                                  const max = Math.max(...Object.values(stats.breakdown), 1);
                                  const widthPct = Math.round((count / max) * 100);
                                  return (
                                      <div key={key}>
                                        <div className="admin-breakdown-header">
                                          <span>{SCRIPT_LABELS[key] || key}</span>
                                          <span className="admin-breakdown-count">{count}</span>
                                        </div>
                                        <div className="admin-breakdown-track">
                                          <div
                                              className="admin-breakdown-fill"
                                              style={{ width: `${widthPct}%` }}
                                          />
                                        </div>
                                      </div>
                                  );
                                })}
                              </div>
                            </div>
                        )}
                      </>
                  ) : (
                      <div className="admin-card-box">
                        <h3 className="admin-card-subtitle">Database Select Queries</h3>
                        <p className="admin-muted" style={{ margin: "0 0 16px 0", fontSize: "12.5px" }}>
                          Copy queries directly to run in your Supabase SQL Editor or Next.js backend API routes.
                        </p>

                        <div className="admin-script-group">
                          <div className="admin-script-box">
                            <div className="admin-script-box-header">
                              <span className="admin-script-label">Supabase Client Query (JS)</span>
                              <button
                                  type="button"
                                  className="admin-copy-btn"
                                  onClick={() => copyToClipboard(queries.supabaseJs, "js")}
                              >
                                {copiedKey === "js" ? "Copied!" : "Copy JS"}
                              </button>
                            </div>
                            <pre className="admin-code-block"><code>{queries.supabaseJs}</code></pre>
                          </div>

                          <div className="admin-script-box">
                            <div className="admin-script-box-header">
                              <span className="admin-script-label">SQL Category Aggregates</span>
                              <button
                                  type="button"
                                  className="admin-copy-btn"
                                  onClick={() => copyToClipboard(queries.sqlAggregate, "sqlAgg")}
                              >
                                {copiedKey === "sqlAgg" ? "Copied!" : "Copy SQL"}
                              </button>
                            </div>
                            <pre className="admin-code-block"><code>{queries.sqlAggregate}</code></pre>
                          </div>

                          <div className="admin-script-box">
                            <div className="admin-script-box-header">
                              <span className="admin-script-label">SQL Today's Submissions</span>
                              <button
                                  type="button"
                                  className="admin-copy-btn"
                                  onClick={() => copyToClipboard(queries.sqlToday, "sqlToday")}
                              >
                                {copiedKey === "sqlToday" ? "Copied!" : "Copy SQL"}
                              </button>
                            </div>
                            <pre className="admin-code-block"><code>{queries.sqlToday}</code></pre>
                          </div>
                        </div>
                      </div>
                  )}
                </section>

                {/* Recent Locations */}
                <section className="admin-section">
                  <h2 className="admin-section-title" style={{ marginBottom: "12px" }}>Recent Locations</h2>
                  {!stats.recentLocations || stats.recentLocations.length === 0 ? (
                      <p className="admin-muted">No locations pinned yet.</p>
                  ) : (
                      <ul className="admin-location-list">
                        {stats.recentLocations.map((loc, i) => (
                            <li key={i} className="admin-location-item">
                          <span className="admin-location-name">
                            {loc.active && (
                                <span className="admin-location-dot" style={{ backgroundColor: "#8dcf94" }} aria-hidden="true" />
                            )}
                            {loc.name}
                          </span>
                              <span className="admin-muted" style={{ fontSize: "12px" }}>
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
          <section className="admin-section">
            <h2 className="admin-section-title" style={{ marginBottom: "12px" }}>Lifetime Totals by Location</h2>
            {visitTotalsLoading ? (
                <p className="admin-muted">Loading totals...</p>
            ) : visitTotals.length === 0 ? (
                <p className="admin-muted">No visits recorded yet.</p>
            ) : (
                <div className="admin-card-box">
                  <div className="admin-breakdown-list">
                    {visitTotals.map((row) => {
                      const max = Math.max(...visitTotals.map((r) => r.total_visits), 1);
                      const widthPct = Math.round((row.total_visits / max) * 100);
                      return (
                          <div key={row.city}>
                            <div className="admin-breakdown-header">
                              <span>{row.city}</span>
                              <span className="admin-breakdown-count">{row.total_visits}</span>
                            </div>
                            <div className="admin-breakdown-track">
                              <div
                                  className="admin-breakdown-fill"
                                  style={{ width: `${widthPct}%` }}
                              />
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
            )}
          </section>

          {/* Manage Section */}
          <section className="admin-section">
            <h2 className="admin-section-title" style={{ marginBottom: "12px" }}>Manage</h2>
            <div className="admin-link-grid">
              <Link href="/admin/set-location" className="admin-link-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, verticalAlign: "middle" }}><path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"/><circle cx="12" cy="8" r="2"/><path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"/></svg>
                Pin New Location
              </Link>
              <Link href="/admin/map" className="admin-link-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, verticalAlign: "middle" }}><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
                View Full Map
              </Link>
              <Link href="/admin/questions" className="admin-link-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, verticalAlign: "middle" }}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                Manage Questions
              </Link>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="admin-footer">
            <span className="admin-footer-brand">FACTOR OF TEN</span>
            <span className="admin-footer-tagline">Know more. Ask more. Check sooner.</span>
          </footer>
        </div>
      </main>
  );
}