/**
 * TextResponse — the answer input area: a textarea plus an optional
 * voice-input toggle. Fully controlled: all state lives in the parent.
 *
 * Mobile-specific details:
 * - text-base (16px) prevents iOS Safari's zoom-on-focus for inputs
 *   under 16px.
 * - onFocus calls scrollIntoView so the textarea surfaces above the
 *   on-screen keyboard instead of ending up hidden behind it.
 * - The mic toggle has a minimum 44x44px touch target and sits in
 *   normal document flow (not fixed/absolute), so it moves naturally
 *   with the keyboard.
 */
export default function TextResponse({
                                         value,
                                         onChange,
                                         placeholder,
                                         disabled = false,
                                         isListening = false,
                                         onToggleListening,
                                         isSpeechSupported = false,
                                     }) {
    function handleFocus(e) {
        setTimeout(() => {
            e.target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
    }

    return (
        <div className="w-full">
      <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          aria-label="Your answer"
          className="
          w-full box-border
          rounded-xl border border-[#AEB8D6]/25
          bg-[#0A1735]/70 text-[#F5F6FA] text-base
          placeholder-[#7E88AC]
          p-3
          resize-none
          focus:outline-none focus:ring-2 focus:ring-[#B99B5B]/60
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      />

            {isSpeechSupported && (
                <div className="mt-3 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onToggleListening}
                        disabled={disabled}
                        aria-pressed={isListening}
                        aria-label={isListening ? "Stop recording" : "Speak your answer"}
                        className={`
              inline-flex items-center justify-center gap-2
              min-h-[44px] min-w-[44px] px-4
              rounded-full border text-sm font-medium
              w-full sm:w-auto
              transition-all duration-150 active:scale-95 shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                            isListening
                                ? "border-[#FF6B6B] bg-[#D9534F]/20 text-[#FFB4B0] animate-pulse"
                                : "border-[#B99B5B] bg-[#B99B5B]/15 text-[#D9C489] hover:bg-[#D9C489]/20"
                        }
            `}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                        {isListening ? "Stop Recording..." : "Speak Answer"}
                    </button>
                </div>
            )}
        </div>
    );
}