/**
 * QuestionCard — displays a question's category label and text, and
 * hosts whatever input UI is passed as children (typically TextResponse).
 *
 * Pure presentational component: no state, no side effects.
 * Colors are arbitrary-value Tailwind classes matching the exact brand
 * hex values used throughout the rest of the app, rather than Tailwind's
 * default palette.
 */
export default function QuestionCard({ category, question, children }) {
    return (
        <div
            className="
        w-full max-w-[440px] mx-auto
        rounded-2xl border border-[#AEB8D6]/20
        bg-[#0F1E4A]/60
        p-5 sm:p-6
        box-border
      "
        >
            {category && (
                <span
                    className="
            block text-xs font-semibold uppercase tracking-wide
            text-[#B99B5B] mb-2
          "
                >
          {category}
        </span>
            )}

            <h1
                className="
          text-lg sm:text-xl font-semibold
          text-[#F5F6FA] leading-snug
          mb-4
          break-words
        "
            >
                {question}
            </h1>

            {children}
        </div>
    );
}