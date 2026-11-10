import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

export const EMERGENCY_KEYWORDS = [
    'suicide',
    'kill myself',
    'end my life',
    'want to die',
    'self harm',
    'cutting myself',
    'overdose',
    'hurt myself',
    'no reason to live',
    'kill someone',
    'shoot myself',
    'I want to die',
    'gun',
    'end my life'
];

export function checkForSafetyTrigger(text) {
    if (!text || typeof text !== 'string') return false;

    const normalizedText = text.toLowerCase().trim();

    return EMERGENCY_KEYWORDS.some((keyword) =>
        normalizedText.includes(keyword)
    );
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
    const [microphoneError, setMicrophoneError] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const valueRef = useRef(value);

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

    // Release the microphone if the page is left while recording
    useEffect(() => {
        return () => {
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
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
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

                await sendAudioToTranscribeApi(audioBlob, `recording.${extension}`);
            };

            mediaRecorder.start();
            setIsFallbackRecording(true);
        } catch (err) {
            console.error("Microphone access error:", err);
            setIsFallbackRecording(false);
            setMicrophoneError("Unable to access the microphone. Check your browser permissions, or type your answer.");
        }
    };

    const stopMediaRecorder = () => {
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
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Transcription request failed");
            }

            const data = await response.json();
            if (data.text) {
                const current = valueRef.current;
                const updatedText = current ? `${current} ${data.text}` : data.text;
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
            setMicrophoneError("We could not transcribe that recording. Please try again or type your answer.");
        } finally {
            setIsTranscribing(false);
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
                onChange={(e) => onChange(e.target.value)}
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