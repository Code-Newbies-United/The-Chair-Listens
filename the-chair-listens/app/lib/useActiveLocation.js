// lib/useActiveLocation.js
//
// The chair's current stop is decided by the server (the single row in
// `locations` with active = true), never by the visitor's GPS or a URL
// parameter (FIX-07). Pages use this hook to show the stop name in their
// location pill.
import { useEffect, useState } from 'react';

let cached = null; // remembered between page navigations in one tab

export function useActiveLocationName() {
  const [name, setName] = useState(cached);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/locations', { cache: 'no-store' });
        const data = await res.json();
        const active = (data.locations || []).find((loc) => loc.active);
        cached = active ? active.name : '';
        if (!cancelled) setName(cached);
      } catch (err) {
        console.error('Failed to load the active chair location:', err);
        if (!cancelled) setName('');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (name === null) return 'Finding the chair…';
  return name || 'The chair is between stops';
}
