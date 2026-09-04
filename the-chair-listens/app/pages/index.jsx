import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  function handleConsent() {
    router.push("/questions");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">The Chair Listens</h1>
        <p className="text-gray-600 mb-8">
          Your answers are anonymous and used only for this project.
        </p>
        <button
          onClick={handleConsent}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          I agree, continue
        </button>
      </div>
    </main>
  );
}