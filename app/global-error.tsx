"use client";

import React from "react";

// ---------------------------------------------------------------------------
// Global error boundary — catches unexpected errors
// ---------------------------------------------------------------------------

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f0f] text-white min-h-screen antialiased">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          {/* Error icon */}
          <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900/40 flex items-center justify-center mb-6">
            <span className="text-2xl">⚠️</span>
          </div>

          <h2 className="text-white text-xl font-semibold mb-2">
            Something went wrong
          </h2>

          <p className="text-[#888] text-sm text-center max-w-md mb-6 leading-relaxed">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>

          <button
            onClick={reset}
            className="
              px-6 py-2.5 rounded-xl
              bg-[#1a1a1a] border border-[#2a2a2a]
              hover:border-[#3b82f6]/50 hover:bg-[#1e1e1e]
              text-white text-sm font-medium
              transition-all duration-200 cursor-pointer
              flex items-center gap-2
            "
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
