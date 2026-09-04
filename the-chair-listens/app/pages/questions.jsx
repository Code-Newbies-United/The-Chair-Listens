import { useState } from "react";
import { useRouter } from "next/router";

const QUESTIONS = [
  "What's on your mind right now?",
  "What's something you're looking forward to?",
  "What's something you're carrying that you'd like to set down?",
];

export default function Questions() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  function handleNext() {
    const updatedAnswers = [...answers, currentAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (index + 1 < QUESTIONS.length) {
      setIndex(index + 1);
    } else {
      router.push({
        pathname: "/response",
        query: { answers: JSON.stringify(updatedAnswers) },
      });
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <p className="text-sm text-gray-500 mb-2">
          Question {index + 1} of {QUESTIONS.length}
        </p>
        <h1 className="text-xl font-medium mb-6">{QUESTIONS[index]}</h1>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 h-32"
          placeholder="Type your answer..."
        />
        <button
          onClick={handleNext}
          className="bg-black text-white px-6 py-3 rounded-lg w-full"
        >
          {index + 1 < QUESTIONS.length ? "Next" : "Finish"}
        </button>
      </div>
    </main>
  );
}