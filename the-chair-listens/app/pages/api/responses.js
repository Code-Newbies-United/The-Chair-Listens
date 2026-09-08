export default function manage_responses(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are accepted on this endpoint"
        });
    }

    const answers = req.body.answers;

    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "answers must be a non-empty array"
        });
    }

    console.log(answers);
    res.status(200).json({ success: true });
}