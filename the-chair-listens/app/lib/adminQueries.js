export function buildAdminQueries(locationName) {
  const name = locationName || 'Active Location';
  const sqlName = name.replace(/'/g, "''");   // apostrophes can't break the SQL
  const jsName = JSON.stringify(name);

  return {
    supabaseJs: `// Run this on the SERVER (an API route or script).
// The public key cannot read responses.
const { data, error } = await supabaseAdmin
  .from('responses')
  .select('id, script, answers, created_at, locations!inner(name)')
  .eq('locations.name', ${jsName})
  .order('created_at', { ascending: false });`,

    sqlAggregate: `-- Responses per pathway at this chair location
SELECT
  COALESCE(l.name, r.location)          AS location_name,
  r.script                              AS pathway_key,
  COALESCE(p.label, r.script, '(none)') AS pathway,
  COUNT(*)                              AS total_responses
FROM responses r
LEFT JOIN locations l ON l.id  = r.chair_location_id
LEFT JOIN pathways  p ON p.key = r.script
WHERE COALESCE(l.name, r.location) = '${sqlName}'
GROUP BY 1, 2, 3
ORDER BY total_responses DESC;`,

    sqlToday: `-- Responses logged today (South African time) across all sites
SELECT r.id, COALESCE(l.name, r.location) AS location_name, r.script, r.answers, r.created_at
FROM responses r
LEFT JOIN locations l ON l.id = r.chair_location_id
WHERE r.created_at >= date_trunc('day', now() AT TIME ZONE 'Africa/Johannesburg')
                      AT TIME ZONE 'Africa/Johannesburg'
ORDER BY r.created_at DESC;`,
  };
}