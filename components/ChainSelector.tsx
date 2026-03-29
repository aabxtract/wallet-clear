"use client";

import React from "react";
import { CHAINS, ChainKey } from "@/constants/chains";

interface ChainSelectorProps {
  selected: ChainKey;
  onChange: (chain: ChainKey) => void;
}

const CHAIN_LIST: { key: ChainKey; label: string }[] = [
  { key: "ethereum", label: "ETH" },
  { key: "bsc", label: "BNB" },
  { key: "polygon", label: "POLYGON" },
  { key: "stacks", label: "STACKS" },
];

export default function ChainSelector({
  selected,
  onChange,
}: ChainSelectorProps) {
  return (
    <div className="flex gap-3">
      {CHAIN_LIST.map(({ key, label }) => {
        const chain = CHAINS[key];
        const isSelected = selected === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              text-sm font-semibold transition-all duration-200
              border cursor-pointer
              ${
                isSelected
                  ? "text-neutral-900 dark:text-white border-transparent shadow shadow-indigo-500/10 dark:shadow-indigo-500/20 scale-105"
                  : "text-neutral-500 dark:text-[#888] bg-white dark:bg-[#1a1a1a] border-neutral-200 dark:border-[#2a2a2a] hover:border-neutral-300 dark:hover:border-[#444] hover:text-neutral-900 dark:hover:text-white"
              }
            `}
            style={
              isSelected
                ? {
                    backgroundColor: chain.color + (isSelected ? "22" : ""),
                    borderColor: chain.color,
                  }
                : undefined
            }
          >
            <span className="text-lg">{chain.icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
