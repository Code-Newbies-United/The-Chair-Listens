import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { sessionHeaders } from "@/lib/session";
import {
    MAX_ANSWER_CHARS,
    MAX_RECORDING_SECONDS,
    MAX_AUDIO_BYTES,
    AUDIO_BITS_PER_SECOND,
} from "@/lib/limits";
import { checkForSafetyTrigger, EMERGENCY_KEYWORDS } from "@/lib/safety";

// There used to be a second, weaker copy of the crisis check in this file.
// It now lives ONLY in lib/safety.js. These re-exports keep old imports working.
export { checkForSafetyTrigger, EMERGENCY_KEYWORDS };

function formatSeconds(total) {
    const safe = Math.max(0, total);
    const minutes = Math.floor(safe / 60);
    const seconds = String(safe % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

// A friendly sentence for each way voice transcription can fail.
function transcribeErrorMessage(error) {
    switch (error?.status) {
        case 413:
            return `That recording was too long. Please keep it under ${MAX_RECORDING_SECONDS} seconds, or type your answer.`;
        case 429:
            return "Lots of people are using the chair right now. Please wait a moment and try again, or type your answer.";
        case 502:
        case 503:
        case 504:
            return "Voice transcription is slow right now. Please try again, or type your answer.";
        default:
            return "We could not transcribe that recording. Please try again or type your answer.";
    }
}

export default function TextResponse({
                                         value,
                                         onChange,
                                         placeholder,
                                         disabled = false,
                                         isListening = false,
                                         onToggleListening,
                                         isSpeechSupported = false,
                                         onSafetyTrigger,
                                     }) {
    const router = useRouter();
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isFallbackRecording, setIsFallbackRecording] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(MAX_RECORDING_SECONDS);
    const [microphoneError, setMicrophoneError] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);
    const valueRef = useRef(value);
    const mountedRef = useRef(true);

    // Always hold the latest text, so a recording that finishes later does not use old text
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    // Monitor value changes for safety triggers and redirect to emergency page
    useEffect(() => {
        if (checkForSafetyTrigger(value)) {
            if (onSafetyTrigger) {
                onSafetyTrigger(value);
            }
            router.push("/emergency");
        }
    }, [value, router, onSafetyTrigger]);

    const clearRecordingTimer = () => {
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
    };

    // Release the microphone if the page is left while recording
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
            }
            const recorder = mediaRecorderRef.current;
            if (recorder && recorder.state !== "inactive") {
                recorder.onstop = null;
                recorder.stop();
                recorder.stream?.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    function handleFocus(e) {
        setTimeout(() => {
            e.target.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 150);
    }

    // Server-side audio recording via /api/transcribe
    const startMediaRecorder = async () => {
        setMicrophoneError("");

        if (
            typeof navigator === "undefined" ||
            !navigator.mediaDevices ||
            typeof MediaRecorder === "undefined"
        ) {
            setMicrophoneError("Voice recording is not supported on this browser. Please type your answer.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // A low bitrate keeps a 90 second answer well under the upload limit.
            // Some browsers ignore or reject the option, so fall back to the defaults.
            let mediaRecorder;
            try {
                mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: AUDIO_BITS_PER_SECOND });
            } catch {
                mediaRecorder = new MediaRecorder(stream);
            }
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                clearRecordingTimer();
                setIsFallbackRecording(false);
                stream.getTracks().forEach((track) => track.stop());

                // Use the real format the browser recorded (webm on Android/desktop, mp4 on iPhone)
                const mimeType = (mediaRecorder.mimeType || "audio/webm").split(";")[0];
                const extension = mimeType.includes("mp4") ? "m4a" : mimeType.split("/")[1] || "webm";
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

                if (audioBlob.size === 0) {
                    setMicrophoneError("Nothing was recorded. Please try again.");
                    return;
                }

                // Never try to upload something the server will refuse.
                if (audioBlob.size > MAX_AUDIO_BYTES) {
                    setMicrophoneError(
                        `That recording was too long to send. Please keep it under ${MAX_RECORDING_SECONDS} seconds, or type your answer.`
                    );
                    return;
                }

                await sendAudioToTranscribeApi(audioBlob, `recording.${extension}`);
            };

            mediaRecorder.start();
            setIsFallbackRecording(true);
            setSecondsLeft(MAX_RECORDING_SECONDS);

            // Stop by itself at the maximum length, so a forgotten recording
            // cannot grow until the upload is refused.
            const startedAt = Date.now();
            clearRecordingTimer();
            recordingTimerRef.current = setInterval(() => {
                const left = MAX_RECORDING_SECONDS - Math.floor((Date.now() - startedAt) / 1000);
                if (left <= 0) {
                    setSecondsLeft(0);
                    setMicrophoneError(
                        `Recording stopped at ${formatSeconds(MAX_RECORDING_SECONDS)}, which is the longest we can take. You can record more afterwards.`
                    );
                    stopMediaRecorder();
                } else {
                    setSecondsLeft(left);
                }
            }, 500);
        } catch (err) {
            console.error("Microphone access error:", err);
            clearRecordingTimer();
            setIsFallbackRecording(false);
            setMicrophoneError("Unable to access the microphone. Check your browser permissions, or type your answer.");
        }
    };

    const stopMediaRecorder = () => {
        clearRecordingTimer();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    const sendAudioToTranscribeApi = async (blob, filename) => {
        try {
            setIsTranscribing(true);
            const formData = new FormData();
            formData.append("audio", blob, filename);

            const response = await fetch("/api/transcribe", {
                method: "POST",
                headers: sessionHeaders(),
                body: formData,
            });

            if (!response.ok) {
                // Vercel's own 413 page is not JSON, so tolerate a body we cannot read.
                const errorData = await response.json().catch(() => ({}));
                const failure = new Error(errorData.message || "Transcription request failed");
                failure.status = response.status;
                throw failure;
            }

            const data = await response.json();

            // The question changed while transcribing: drop the result
            if (!mountedRef.current) return;

            if (data.text) {
                const current = valueRef.current;
                const updatedText = (current ? `${current} ${data.text}` : data.text).slice(0, MAX_ANSWER_CHARS);
                onChange(updatedText);

                if (checkForSafetyTrigger(updatedText)) {
                    if (onSafetyTrigger) {
                        onSafetyTrigger(updatedText);
                    }
                    router.push("/emergency");
                }
            } else {
                setMicrophoneError("We could not hear anything. Please try again.");
            }
        } catch (error) {
            console.error("Audio transcription error:", error);
            if (mountedRef.current) {
                setMicrophoneError(transcribeErrorMessage(error));
            }
        } finally {
            if (mountedRef.current) {
                setIsTranscribing(false);
            }
        }
    };

    const listening = isListening || isFallbackRecording;

    const handleVoiceToggle = () => {
        setMicrophoneError("");

        if (isSpeechSupported && onToggleListening) {
            onToggleListening();
        } else if (isFallbackRecording) {
            stopMediaRecorder();
        } else {
            startMediaRecorder();
        }
    };

    return (
        <div className="w-full mt-5">
            <textarea
                value={value}
                maxLength={MAX_ANSWER_CHARS}
                onChange={(e) => onChange(e.target.value.slice(0, MAX_ANSWER_CHARS))}
                onFocus={handleFocus}
                placeholder={placeholder}
                disabled={disabled || isTranscribing}
                rows={5}
                aria-label="Your answer"
                className="
                    w-full box-border
                    rounded-[17px]
                    border border-[#203F36]/12
                    bg-[#F5F2E8]
                    text-[#203F36]
                    text-base
                    leading-relaxed
                    placeholder-[#52645E]/65
                    p-4
                    resize-none
                    shadow-[inset_0_1px_2px_rgba(32,63,54,0.05)]
                    transition-all duration-200
                    focus:outline-none
                    focus:border-[#8DCF94]
                    focus:ring-2
                    focus:ring-[#8DCF94]/30
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                "
            />

            <div className="mt-3 flex flex-col items-stretch gap-2">
                <button
                    type="button"
                    onClick={handleVoiceToggle}
                    disabled={disabled || isTranscribing}
                    aria-pressed={listening}
                    aria-label={listening ? "Stop recording" : "Speak your answer"}
                    className={`
                        inline-flex items-center justify-center gap-2
                        min-h-[44px] min-w-[44px]
                        px-5
                        rounded-full
                        border
                        text-sm
                        font-semibold
                        w-full
                        transition-all duration-200
                        active:scale-[0.98]
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        ${
                        listening
                            ? "border-[#BC9553] bg-[#BC9553]/15 text-[#8A6935] animate-pulse"
                            : "border-[#526B61]/25 bg-[#D4E9ED]/55 text-[#2D5046] hover:bg-[#D4E9ED] hover:border-[#526B61]/40"
                    }
                    `}
                >
                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>

                    {isTranscribing
                        ? "Transcribing audio..."
                        : isFallbackRecording
                            ? `Stop Recording... (${formatSeconds(secondsLeft)} left)`
                            : listening
                                ? "Stop Recording..."
                                : "Speak Answer"}
                </button>

                {microphoneError && (
                    <p role="alert" className="m-0 text-center text-xs leading-snug text-[#8A3B30]">
                        {microphoneError}
                    </p>
                )}
            </div>
        </div>
    );
}
