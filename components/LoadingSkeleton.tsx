"use client";

import React from "react";

// ---------------------------------------------------------------------------
// Single skeleton card — mimics TransactionCard layout
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-3 sm:gap-4 animate-pulse">
        {/* Icon circle */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2a2a2a]" />

        {/* Text lines */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-3.5 w-3/4 rounded bg-[#2a2a2a]" />
          <div className="h-2.5 w-1/2 rounded bg-[#222]" />
          <div className="h-2.5 w-1/3 rounded bg-[#222]" />
        </div>

        {/* Value column */}
        <div className="flex-shrink-0 space-y-2 text-right">
          <div className="h-3.5 w-20 rounded bg-[#2a2a2a] ml-auto" />
          <div className="h-2.5 w-14 rounded bg-[#222] ml-auto" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LoadingSkeleton — shows 5 skeleton cards
// ---------------------------------------------------------------------------

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-6 animate-pulse">
        <div className="h-6 w-48 rounded bg-[#2a2a2a]" />
        <div className="h-5 w-20 rounded-full bg-[#222] ml-auto" />
      </div>

      {/* Cards */}
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}

      {/* Shimmer hint */}
      <p className="text-center text-[#444] text-xs pt-4 animate-pulse">
        Loading transactions…
      </p>
    </div>
  );
}
