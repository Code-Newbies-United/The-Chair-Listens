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

                button, a {
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

                <ChairJourneyMap />

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