const CITY_ALIASES = {
  joburg: "Johannesburg",
  jhb: "Johannesburg",
  johannesburg: "Johannesburg",
  pta: "Pretoria",
  pretoria: "Pretoria",
  cpt: "Cape Town",
  "cape town": "Cape Town",
  dbn: "Durban",
  durban: "Durban",
};

export function normalizeCity(raw) {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) return null;
  if (CITY_ALIASES[cleaned]) return CITY_ALIASES[cleaned];
  // Not a known alias — title-case it as a best-effort fallback
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}