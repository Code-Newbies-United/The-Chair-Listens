import formidable from "formidable";
import fs from "fs/promises";
import Groq, { toFile } from "groq-sdk";

export const config = {
  api: {
    bodyParser: false,
  },
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

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

  // Check that the API key is configured.
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is missing.");

    return res.status(500).json({
      message: "Audio transcription is not configured on the server.",
    });
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
      return res.status(400).json({
        message: "No audio file was uploaded.",
      });
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
    console.error("Transcription Handler Error:", {
      name: error?.name,
      status: error?.status,
      message: error?.message,
    });

    // Handle common API errors.
    if (error?.status === 401) {
      return res.status(500).json({
        message:
          "The transcription service credentials are invalid. Check your GROQ_API_KEY.",
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        message:
          "The transcription service is busy. Please try again shortly.",
      });
    }

    if (
      error?.code === "LIMIT_FILE_SIZE" ||
      error?.httpCode === 413
    ) {
      return res.status(413).json({
        message:
          "The recording is too large. Please record a shorter answer.",
      });
    }

    return res.status(500).json({
      message:
        "Failed to transcribe audio. Please try again.",
    });
  } finally {
    // Remove the temporary uploaded file.
    if (uploadedFile?.filepath) {
      await fs.unlink(uploadedFile.filepath).catch(() => {});
    }
  }
}