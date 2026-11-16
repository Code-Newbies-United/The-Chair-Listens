// lib/usePathways.js
//
// Loads the pathway list for a page (FIX-16).
//   usePathways()                  -> public list: active pathways only
//   usePathways({ admin: true })   -> admin list: includes inactive ones
//
// `pathways` is null while loading, then an array (empty if the request failed,
// in which case `error` is true).
import { useEffect, useState } from 'react';

export function usePathways({ admin = false } = {}) {
  const [pathways, setPathways] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(admin ? '/api/admin/pathways' : '/api/pathways');
        if (!res.ok) throw new Error(`Pathways request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setPathways(Array.isArray(data.pathways) ? data.pathways : []);
        }
      } catch (err) {
        console.error('Failed to load pathways:', err);
        if (!cancelled) {
          setError(true);
          setPathways([]);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [admin]);

  return { pathways, loading: pathways === null, error };
}
