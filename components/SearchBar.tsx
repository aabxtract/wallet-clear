"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "ethers";
import { ChainKey } from "@/constants/chains";

interface SearchBarProps {
  chain: ChainKey;
}

export default function SearchBar({ chain }: SearchBarProps) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = address.trim();
    if (!trimmed) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isAddress(trimmed)) {
      setError("Invalid wallet address. Please enter a valid 0x address.");
      return;
    }

    router.push(`/${trimmed}?chain=${chain}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter wallet address (0x...) or ENS name"
          className={`
            w-full px-5 py-4 pr-[120px] rounded-2xl
            bg-[#1a1a1a] text-white text-base
            placeholder-[#555] outline-none
            border transition-all duration-200
            ${error ? "border-red-500/60" : "border-[#2a2a2a] focus:border-[#627EEA]"}
          `}
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          className="
            absolute right-2 px-5 py-2.5 rounded-xl
            bg-[#627EEA] hover:bg-[#4f6bd6] active:scale-95
            text-white font-semibold text-sm
            transition-all duration-200 cursor-pointer
            flex items-center gap-2
          "
        >
          Analyze
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>

      {error && (
        <p className="mt-2 ml-1 text-sm text-red-400 animate-pulse">{error}</p>
      )}
    </form>
  );
}
