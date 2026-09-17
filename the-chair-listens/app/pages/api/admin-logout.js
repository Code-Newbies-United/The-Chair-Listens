import { clearAdminSessionCookie } from "@/lib/adminsession";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    res.setHeader("Set-Cookie", clearAdminSessionCookie());
    return res.status(200).json({ success: true });
}