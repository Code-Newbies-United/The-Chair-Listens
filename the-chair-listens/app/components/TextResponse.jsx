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

    // Monitor value changes for safety triggers and redirect to emergency page
    useEffect(() => {
        if (checkForSafetyTrigger(value)) {
            if (onSafetyTrigger) {
                onSafetyTrigger(value);
            }
            router.push("/emergency");
        }
    }, [value, router, onSafetyTrigger]);

    function handleFocus(e) {
        setTimeout(() => {
            e.target.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 150);
    }

    // Fallback / Server-side Audio Recording via /api/transcribe.js
    const startMediaRecorder = async () => {
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
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                await sendAudioToTranscribeApi(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Unable to access microphone. Please check permissions or type your response.");
        }
    };

    const stopMediaRecorder = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    const sendAudioToTranscribeApi = async (blob) => {
        try {
            setIsTranscribing(true);
            const formData = new FormData();
            formData.append("audio", blob, "recording.webm");

            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Transcription request failed");
            }

            const data = await response.json();
            if (data.text) {
                const updatedText = value ? `${value} ${data.text}` : data.text;
                onChange(updatedText);

                // Check safety on transcribed text as well
                if (checkForSafetyTrigger(updatedText)) {
                    if (onSafetyTrigger) {
                        onSafetyTrigger(updatedText);
                    }
                    router.push("/emergency");
                }
            }
        } catch (error) {
            console.error("Audio transcription error:", error);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleVoiceToggle = () => {
        if (isSpeechSupported && onToggleListening) {
            onToggleListening();
        } else {
            if (isListening) {
                stopMediaRecorder();
            } else {
                startMediaRecorder();
            }
        }
    };

    return (
        <div className="w-full">
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

            <div className="mt-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleVoiceToggle}
                    disabled={disabled || isTranscribing}
                    aria-pressed={isListening}
                    aria-label={isListening ? "Stop recording" : "Speak your answer"}
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
                        isListening
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
                        : isListening
                            ? "Stop Recording..."
                            : "Speak Answer"}
                </button>
            </div>
        </div>
    );
}