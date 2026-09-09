// Destination: pages/api/transcribe.js
import formidable from "formidable";
import fs from "fs";
import Groq from "groq-sdk";

export const config = {
  api: {
    bodyParser: false,
  },
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);
    const audioFile = files.audio?.[0];

    if (!audioFile) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const fileStream = fs.createReadStream(audioFile.filepath);

    const transcription = await groq.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-large-v3",
      // language: "en", // removed — auto-detect is more accurate for a multilingual audience.
      // Re-add this line with a specific language code ONLY if English-only is a deliberate scope decision.
    });

    return res.status(200).json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription Handler Error:", error);
    return res.status(500).json({ message: "Failed to transcribe audio." });
  }
}