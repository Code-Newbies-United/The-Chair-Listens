export default function manage_communication(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: "Method Not Allowed",
            message:"Only POST requests are accepted on this endpoint"
        });
    }
    const location_id = req.body.location_id;

    if (location_id == null || location_id === "") {
        return res.status(400).json({
            error: "Bad Request",
            message: "location_id is required"
        })
    }

    console.log(location_id);
    res.status(200).json({success: true});
}