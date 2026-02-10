"use client";

import React, { useState } from "react";
import ChainSelector from "@/components/ChainSelector";
import SearchBar from "@/components/SearchBar";
import { ChainKey } from "@/constants/chains";

// ---------------------------------------------------------------------------
// Feature cards data
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    icon: "🔍",
    title: "Human Readable",
    description: "See what actually happened in plain English",
  },
  {
    icon: "🛡️",
    title: "Scam Detection",
    description: "Automatically flags spam and address poisoning",
  },
  {
    icon: "⛓️",
    title: "Multi-Chain",
    description: "Supports Ethereum, BNB Chain and Polygon",
  },
];

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<ChainKey>("ethereum");

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12 sm:py-20">
      {/* ---------------------------------------------------------------- */}
      {/* Hero section                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="flex flex-col items-center text-center max-w-3xl mt-8 sm:mt-16">
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#627EEA] bg-clip-text text-transparent">
          WalletClear
        </h1>

        {/* Tagline */}
        <p className="mt-5 text-lg sm:text-xl text-[#ccc] font-medium">
          Understand your crypto wallet in plain English
        </p>

        {/* Sub-tagline */}
        <p className="mt-3 text-sm sm:text-base text-[#888] max-w-md leading-relaxed">
          Paste any wallet address to see your transaction history without the
          confusion
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Search section                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="flex flex-col items-center w-full max-w-2xl mt-10 sm:mt-14 gap-6">
        {/* Chain selector */}
        <ChainSelector selected={selectedChain} onChange={setSelectedChain} />

        {/* Address input */}
        <SearchBar chain={selectedChain} />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Feature cards                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-16 sm:mt-20">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="
              flex flex-col items-center text-center
              px-6 py-8 rounded-2xl
              bg-[#1a1a1a] border border-[#2a2a2a]
              hover:border-[#3a3a3a] transition-all duration-200
            "
          >
            <span className="text-3xl mb-4">{feature.icon}</span>
            <h3 className="text-white font-semibold text-base mb-2">
              {feature.title}
            </h3>
            <p className="text-[#888] text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Footer                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="mt-auto pt-16 pb-8">
        <p className="text-[#555] text-xs sm:text-sm tracking-wide">
          Not a wallet. Read-only. Your keys stay yours.
        </p>
      </footer>
    </main>
  );
}
