// Destination: pages/api/admin-login.js
import { createAdminSessionCookie } from "@/lib/adminsession";

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