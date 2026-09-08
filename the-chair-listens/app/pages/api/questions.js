// pages/api/questions.js
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const QUESTIONS = [
    "What's on your mind right now?",
    "What's something you're looking forward to?",
    "What's something you're carrying that you'd like to set down?",
  ];

  res.status(200).json({ questions: QUESTIONS });
}