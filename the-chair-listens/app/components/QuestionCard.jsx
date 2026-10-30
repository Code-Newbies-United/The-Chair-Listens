export default function QuestionCard({ category, question, children }) {
    return (
        <div
            className="
        w-full max-w-[540px] mx-auto
        rounded-[21px]
        border border-[#2D5046]/10
        bg-[#FBFAF5]/80
        p-5 sm:p-6
        box-border
        shadow-[0_12px_30px_rgba(17,45,37,0.08)]
      "
        >
            {category && (
                <span
                    className="
            block
            mb-2
            text-xs
            font-bold
            uppercase
            tracking-[0.08em]
            text-[#BC9553]
          "
                >
                    {category}
                </span>
            )}

            <h1
                className="
          mb-5
          break-words
          text-lg
          sm:text-xl
          font-semibold
          leading-snug
          text-[#203F36]
        "
            >
                {question}
            </h1>

            {children}
        </div>
    );
}