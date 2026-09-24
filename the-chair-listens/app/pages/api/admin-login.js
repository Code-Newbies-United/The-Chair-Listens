// Destination: pages/api/admin-login.js
import { createAdminSessionCookie } from "@/lib/adminsession";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
}

const ip = getClientIp(req);

const limitResult = await rateLimit(
    "admin-login",
    ip,
    3,
    15 * 60
);

if (!limitResult.allowed) {
    return res.status(429).json({
        error: "Too many attempts. Please try again after 15 minutes"
    });
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { password } = req.body;

        if (!password || password !== process.env.ADMIN_PASSWORD) {
            // Same message either way — don't hint at what went wrong
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }

        res.setHeader("Set-Cookie", createAdminSessionCookie());
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Admin login error:", err);
        return res.status(500).json({ success: false, message: "Server error, please try again." });
    }
}