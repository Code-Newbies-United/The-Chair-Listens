import formidable from "formidable";
import fs from "fs/promises";
import Groq, { toFile } from "groq-sdk";
import { checkRateLimit, getSessionIdFromHeader } from "@/lib/apiGuard";
import { sendError } from "@/lib/apiErrors";
import { MAX_AUDIO_BYTES } from "@/lib/limits";

// bodyParser must be off: formidable reads the multipart upload itself.
// maxDuration stops a stuck request from running for minutes (Vercel).
export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 30,
};

// Whisper on a clip of up to 90 seconds takes a few seconds. If Groq has not
// answered in 20 s something is wrong, so give up and let the person retry
// or type instead. One retry only: the default of 2 retries could triple the wait.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 20_000,
  maxRetries: 1,
});

// Vercel refuses request bodies over 4.5 MB before this code even runs, so
// MAX_AUDIO_BYTES (4 MB) is the real ceiling. See lib/limits.js.
const MAX_FILE_SIZE = MAX_AUDIO_BYTES;
// Multipart overhead (boundaries, headers) on top of the audio itself.
const MULTIPART_OVERHEAD_BYTES = 256 * 1024;

const TOO_LARGE_MESSAGE =
  "The recording is too large. Please record a shorter answer.";

const ALLOWED_MIME_TYPES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/flac",
  "audio/m4a",
  "audio/x-m4a",
  "application/octet-stream",
]);

export default async function handler(req, res) {
  // Only allow POST requests.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      message: "Method not allowed.",
    });
  }

  // Rate limit: per IP (shared wifi) and per session (one person).
  const sessionId = getSessionIdFromHeader(req);
  if (!(await checkRateLimit(req, res, "transcribe", { sessionId }))) return;

  // Refuse an oversized upload straight away, before reading any of it.
  const declaredLength = Number(req.headers["content-length"]);
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_FILE_SIZE + MULTIPART_OVERHEAD_BYTES
  ) {
    return sendError(res, 413, "Payload Too Large", TOO_LARGE_MESSAGE);
  }

  let uploadedFile;

  try {
    // Parse the incoming multipart/form-data request.
    const form = formidable({
      multiples: false,
      maxFiles: 1,
      maxFileSize: MAX_FILE_SIZE,
      allowEmptyFiles: false,
      minFileSize: 1,
    });

    const [, files] = await form.parse(req);

    // Formidable can return either a file or an array of files.
    const audio = files.audio;

    uploadedFile = Array.isArray(audio)
      ? audio[0]
      : audio;

    if (!uploadedFile) {
      return sendError(res, 400, "Bad Request", "No audio file uploaded");
    }

    // Check that the API key is configured (after the cheap request checks).
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing.");
      return sendError(
        res,
        500,
        "Server error",
        "Audio transcription is not configured on the server.",
      );
    }

    // Validate the reported MIME type when available.
    const mimeType = uploadedFile.mimetype;

    if (
      mimeType &&
      !ALLOWED_MIME_TYPES.has(mimeType)
    ) {
      return res.status(415).json({
        message: `Unsupported audio type: ${mimeType}`,
      });
    }

    // Read the uploaded audio from its temporary location.
    const audioBuffer = await fs.readFile(
      uploadedFile.filepath
    );

    if (audioBuffer.length === 0) {
      return res.status(400).json({
        message: "The uploaded audio file is empty.",
      });
    }

    // Preserve the original filename and extension when possible.
    const filename =
      uploadedFile.originalFilename || "recording.webm";

    // Convert the buffer into a file accepted by the Groq SDK.
    const audioFile = await toFile(
      audioBuffer,
      filename,
      {
        type: mimeType || "audio/webm",
      }
    );

    // Transcribe the recording using Whisper.
    const transcription =
      await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
        response_format: "json",
        temperature: 0,
      });

    // Return the transcript to TextResponse.jsx.
    return res.status(200).json({
      text: transcription.text || "",
    });
  } catch (error) {
    // Never log the audio or the transcript: both are sensitive.
    console.error("Transcription Handler Error:", {
      name: error?.name,
      status: error?.status,
      message: error?.message,
    });

    // Upload too big (formidable: code 1009 / httpCode 413).
    if (
      error?.code === "LIMIT_FILE_SIZE" ||
      error?.code === 1009 ||
      error?.httpCode === 413
    ) {
      return sendError(res, 413, "Payload Too Large", TOO_LARGE_MESSAGE);
    }

    // Groq did not answer in time.
    if (
      error?.name === "APIConnectionTimeoutError" ||
      error?.name === "AbortError"
    ) {
      return sendError(
        res,
        504,
        "Gateway Timeout",
        "Transcription took too long. Please try again, or type your answer.",
      );
    }

    // Handle common API errors.
    if (error?.status === 401) {
      return sendError(
        res,
        500,
        "Server error",
        "The transcription service credentials are invalid. Check your GROQ_API_KEY.",
      );
    }

    if (error?.status === 429) {
      return res.status(429).json({
        message:
          "The transcription service is busy. Please try again shortly.",
      });
    }

    return sendError(
      res,
      500,
      "Server error",
      "Failed to transcribe audio. Please try again.",
    );
  } finally {
    // Remove the temporary uploaded file.
    if (uploadedFile?.filepath) {
      await fs.unlink(uploadedFile.filepath).catch(() => {});
    }
  }
}
