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
    description: "Supports Ethereum, BNB Chain, Polygon and Stacks",
  },
];

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------

import WalletConnect from "@/components/WalletConnect";
import WalletBalance from "@/components/WalletBalance";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<ChainKey>("ethereum");

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12 sm:py-20">
      {/* Theme & Wallet Connect Header */}
      <div className="absolute top-6 right-6 hidden md:flex items-center gap-4">
        <ThemeToggle />
        <WalletConnect />
      </div>

      <div className="flex md:hidden mb-8 items-center gap-4">
        <ThemeToggle />
        <WalletConnect />
      </div>

      {/* Hero section */}
      <section className="flex flex-col items-center text-center max-w-3xl mt-8 sm:mt-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-900 to-[#627EEA] dark:from-white dark:via-white dark:to-[#627EEA] bg-clip-text text-transparent">
          WalletClear
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 font-medium">
          Understand your crypto wallet in plain English
        </p>
        <p className="mt-3 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
          Paste any wallet address or connect your wallet to see your history and balance.
        </p>
      </section>

      {/* Dashboard Section */}
      <WalletBalance />

      {/* Search section */}
      <section className="flex flex-col items-center w-full max-w-2xl mt-10 sm:mt-14 gap-6">
        <ChainSelector selected={selectedChain} onChange={setSelectedChain} />
        <SearchBar chain={selectedChain} />
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-16 sm:mt-20">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="
              flex flex-col items-center text-center
              px-6 py-8 rounded-2xl
              bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#2a2a2a]
              hover:border-neutral-300 dark:hover:border-[#3a3a3a] shadow-sm dark:shadow-none transition-all duration-200
            "
          >
            <span className="text-3xl mb-4">{feature.icon}</span>
            <h3 className="text-black dark:text-white font-semibold text-base mb-2">
              {feature.title}
            </h3>
            <p className="text-neutral-500 dark:text-[#888] text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-16 pb-8">
        <p className="text-neutral-400 dark:text-[#555] text-xs sm:text-sm tracking-wide">
          Not a wallet. Read-only. Your keys stay yours.
        </p>
      </footer>
    </main>
  );
}
