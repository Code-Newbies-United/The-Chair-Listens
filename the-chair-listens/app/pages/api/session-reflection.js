// pages/api/transcribe.js
import formidable from 'formidable';
import fs from 'fs';
import Groq from 'groq-sdk';
import { methodNotAllowed, sendError } from '@/lib/apiErrors';
import { checkRateLimit, getSessionIdFromHeader } from '@/lib/apiGuard';

// Tell Next.js not to parse the body: formidable needs the raw upload.
export const config = {
  api: {
    bodyParser: false,
  },
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, 'POST');
  }

  // Rate limit INSIDE the handler: per IP (shared wifi) and per session (one person).
  const sessionId = getSessionIdFromHeader(req);
  if (!(await checkRateLimit(req, res, 'transcribe', { sessionId }))) return;

  const form = formidable({});
  let audioFile;

  try {
    const [fields, files] = await form.parse(req);
    audioFile = files.audio?.[0];

    if (!audioFile) {
      return sendError(res, 400, 'Bad Request', 'No audio file uploaded');
    }

    const fileStream = fs.createReadStream(audioFile.filepath);

    const transcription = await groq.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-large-v3',
      // language: "en", // removed: auto-detect is more accurate for a multilingual audience.
      // Re-add with a specific language code ONLY if English-only is a deliberate scope decision.
    });

    return res.status(200).json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription Handler Error:', error);
    return sendError(
      res,
      500,
      'Transcription failed',
      'Failed to transcribe audio.',
    );
  } finally {
    // Delete the temporary upload (formidable leaves it on disk)
    if (audioFile?.filepath) {
      fs.unlink(audioFile.filepath, () => {});
    }
  }
}