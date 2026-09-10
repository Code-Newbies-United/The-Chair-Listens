export default function administrate_login(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are accepted on this endpoint"
        })
    }

    const password = req.body.password;

    if (password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({ success: true});

    }
    return res.status(401).json({ 
        success: false, 
        message: "Incorrect password" })
}