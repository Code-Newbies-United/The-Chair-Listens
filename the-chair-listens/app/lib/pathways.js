import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { FunctionsRelayError } from '@supabase/supabase-js';

const TTL_MS = 30_000;
let cache = { at: 0, rows: null };

export async function getAllPathways () {    //includes inactive pathways
    if (cache.rows && Date.now() - cache.at < TTL_MS) return cache.rows;
    const { data, error } = await supabaseAdmin
        .from('pathways').select('*').order('sort-order', { ascending: true});
    if (error) throw error;
    cache = { at: Date.now(), rows: data };
    return data;
}

export async function getActivePathways() {
    return (await getAllPathways()).filter((p) => p.active);
}
  
export async function getPathway(key, { includeInactive = false } = {}) {
    const all = await getAllPathways();
    return all.find((p) => p.key === key && (includeInactive || p.active)) ?? null;
}

//send to browser, do not include for ai_system_prompt
export const toPublic = ({ key, label, description }) => ({ key, label, description});



// export async function getActivePathways() {
//   return (await getAllPathways()).filter((p) => p.active);
// }

// export async function getPathway(key, { includeInactive = false } = {}) {
//   const all = await getAllPathways();
//   return all.find((p) => p.key === key && (includeInactive || p.active)) ?? null;
// }

// // Safe to send to browsers. NEVER include ai_system_prompt.
// export const toPublic = ({ key, label, description }) => ({ key, label, description });