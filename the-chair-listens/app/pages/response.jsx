import { useRouter } from "next/router";

export default function Response() {
  const router = useRouter();
  const { answers } = router.query;

  const parsedAnswers = answers ? JSON.parse(answers) : [];

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Thank you.</h1>
        <p className="text-gray-600 mb-8">
          Your {parsedAnswers.length} answers have been received.
        </p>
      </div>
    </main>
  );
}