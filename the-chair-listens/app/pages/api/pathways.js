//pages/api/pathways.js

import { sendError } from "@/lib/apiErrors";
import { checkRateLimit } from "@/lib/apiGuard";
import { toPublic } from "@/lib/pathways";

export default async function handler(req, res) {
    if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
    if (!(await checkRateLimit(req, res, 'pathways'))) return;
    try {
        res.status(200).json({ pathways: (await getActivePathways()).map(toPublic) });
    } catch {
        sendError(res, 500, 'Connection failed', 'Failed to fetch pathways');
    }
}

// export default async function handler(req, res) {
//   if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
//   if (!(await checkRateLimit(req, res, 'pathways'))) return;
//   try {
//     res.status(200).json({ pathways: (await getActivePathways()).map(toPublic) });
//   } catch {
//     sendError(res, 500, 'Connection failed', 'Failed to fetch pathways');
//   }
// }