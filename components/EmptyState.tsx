"use client";

import React from "react";

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Empty icon */}
      <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-white text-lg font-semibold mb-2">
        No transactions found
      </h2>

      {/* Message */}
      <p className="text-[#888] text-sm text-center max-w-sm leading-relaxed">
        No transactions found for this address. This wallet may be empty or
        inactive on the selected chain.
      </p>

      {/* Hint */}
      <div className="mt-6 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] max-w-sm">
        <p className="text-[#666] text-xs text-center leading-relaxed">
          💡 <span className="text-[#888]">Tip:</span> Try switching to a
          different chain using the selector above. This address may have
          activity on Ethereum, BNB Chain, or Polygon.
        </p>
      </div>
    </div>
  );
}
