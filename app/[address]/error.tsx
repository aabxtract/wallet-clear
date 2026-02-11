"use client";

import React from "react";

// ---------------------------------------------------------------------------
// Route-level error boundary for [address] pages
// ---------------------------------------------------------------------------

export default function AddressError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900/40 flex items-center justify-center mb-6">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-white text-xl font-semibold mb-2">
        Failed to load wallet
      </h2>
      <p className="text-[#888] text-sm text-center max-w-md mb-6 leading-relaxed">
        {error.message || "Something went wrong while analyzing this wallet."}
      </p>
      <button
        onClick={reset}
        className="
          px-6 py-2.5 rounded-xl
          bg-[#1a1a1a] border border-[#2a2a2a]
          hover:border-[#3b82f6]/50 hover:bg-[#1e1e1e]
          text-white text-sm font-medium
          transition-all duration-200 cursor-pointer
        "
      >
        Try Again
      </button>
    </div>
  );
}
