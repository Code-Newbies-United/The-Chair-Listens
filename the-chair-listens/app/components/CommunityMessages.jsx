import { useEffect, useState } from "react";

export default function CommunityMessages() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [feedback, setFeedback] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch("/api/messages");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load messages.");
        }

        setMessages(result.data || []);
      } catch (error) {
        console.error("Loading messages failed:", error);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setFeedback({
        type: "error",
        text: "Please write a message before submitting.",
      });
      return;
    }

    if (trimmedMessage.length > 1000) {
      setFeedback({
        type: "error",
        text: "Messages cannot exceed 1,000 characters.",
      });
      return;
    }

    setLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          message: trimmedMessage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not submit your message.");
      }

      setMessages((previous) =>
        [result.data, ...previous].slice(0, 50)
      );

      setName("");
      setMessage("");

      setFeedback({
        type: "success",
        text: "Your message has been shared with the community!",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="community-heading"
      className="mt-8 rounded-3xl border border-[#b99b5b]/25 bg-[#0f1e4a] p-5 text-[#f5f6fa] shadow-lg sm:p-7"
    >
      {/* Section heading */}
      <div className="mb-5 flex items-center gap-3">
        <span className="text-2xl text-[#b99b5b]" aria-hidden="true">
          ✦
        </span>

        <h2
          id="community-heading"
          className="text-base font-extrabold tracking-[1.5px] text-[#d9c489] sm:text-lg"
        >
          LEAVE A MESSAGE TO THE COMMUNITY
        </h2>
      </div>

      <p className="mb-6 text-sm leading-7 text-[#aeb8d6] sm:text-base">
        Your words could make someone&apos;s day. Share some encouragement,
        a lesson you have learned, or a reminder that someone may need today.
      </p>

      {/* Message form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="community-name"
            className="mb-2 block text-sm font-semibold text-[#d9c489]"
          >
            Your name (optional)
          </label>

          <input
            id="community-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={50}
            placeholder="Community Member"
            autoComplete="name"
            className="w-full rounded-xl border border-[#293b69] bg-[#081128] px-4 py-3 text-[#f5f6fa] placeholder:text-[#7e88ac] focus:outline-none focus:ring-2 focus:ring-[#b99b5b]"
          />
        </div>

        <div>
          <label
            htmlFor="community-message"
            className="mb-2 block text-sm font-semibold text-[#d9c489]"
          >
            Your message
          </label>

          <textarea
            id="community-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={1000}
            rows={5}
            required
            placeholder="Write something positive for the community..."
            aria-describedby="character-count"
            className="w-full resize-y rounded-xl border border-[#293b69] bg-[#081128] px-4 py-3 leading-7 text-[#f5f6fa] placeholder:text-[#7e88ac] focus:outline-none focus:ring-2 focus:ring-[#b99b5b]"
          />

          <div
            id="character-count"
            aria-live="polite"
            className="mt-2 text-right text-xs text-[#aeb8d6]"
          >
            {message.length}/1000 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full rounded-xl border border-[#d9c489] bg-[#b99b5b] px-6 py-3 font-bold text-[#081128] transition hover:bg-[#d9c489] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c489] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Sharing..." : "✦ Share Message"}
        </button>

        {feedback.text && (
          <p
            role="status"
            className={`rounded-xl p-3 text-sm leading-6 ${
              feedback.type === "success"
                ? "bg-green-950 text-green-200"
                : "bg-red-950 text-red-200"
            }`}
          >
            {feedback.text}
          </p>
        )}
      </form>

      {/* Community messages */}
      <div className="mt-8 border-t border-[#293b69] pt-6">
        <h3 className="mb-5 text-base font-extrabold text-[#d9c489]">
          MESSAGES FROM THE COMMUNITY
        </h3>

        {loadingMessages ? (
          <p className="text-sm text-[#aeb8d6]">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="rounded-xl border border-[#293b69] bg-[#0a1735] p-4 text-sm leading-6 text-[#aeb8d6]">
            No messages yet. Be the first to share some encouragement!
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((item) => (
              <article
                key={item._id}
                className="rounded-2xl border border-[#293b69] bg-[#0a1735] p-4 sm:p-5"
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#f5f6fa] sm:text-base">
                  {item.message}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#aeb8d6]">
                  <span>
                    ✦ {item.name || "Community Member"}
                  </span>

                  <time dateTime={item.createdAt}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
