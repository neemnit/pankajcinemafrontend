"use client";

import { useRouter } from "next/navigation";

export default function CancelPayment() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md transition-all duration-500 transform hover:scale-105">
        <span className="text-6xl animate-bounce">😞</span>

        <h1 className="text-2xl font-semibold mt-4">Payment Cancelled</h1>
        <p className="text-gray-600 mt-2">
          Your transaction was not completed. If this was a mistake, you can try again.
        </p>

        {/* Buttons with Tailwind hover and transition effects */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
            onClick={() => router.push("/")}
          >
            Return to Home
          </button>
          <button
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out"
            onClick={() => router.back()}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
