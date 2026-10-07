// Example: app/admin/page.jsx  (App Router)
// or:      pages/admin.jsx     (Pages Router — also drop the "use client" line in ActivityMap.jsx)

import dynamic from "next/dynamic";

// Leaflet touches `window`/`document` directly, which breaks Next's
// server-side render. Loading it with ssr: false skips SSR for just
// this component and renders it client-side only.
const ActivityMap = dynamic(() => import("../components/ActivityMap"), {
    ssr: false,
    loading: () => <p>Loading map…</p>,
});

export default function AdminPage() {
    return (
        <main>
            <h1>Chair Listens — Activity Map</h1>
            <ActivityMap />
        </main>
    );
}