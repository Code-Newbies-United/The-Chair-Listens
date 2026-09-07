export default function handler(req, res) {
        const QUESTIONS = [
        "What's on your mind right now?",
        "What's something you're looking forward to?",
        "What's something you're carrying that you'd like to set down?",
    ];
    res.status(200).json({ questions: QUESTIONS });
}
    
   

