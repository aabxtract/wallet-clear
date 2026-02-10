"use client";

import React, { useState } from "react";
import {
  ParsedTransaction,
  TransactionType,
  TransactionDirection,
} from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/** Copy text and flash a brief "Copied!" tooltip. */
function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return [copied, copy];
}

// ---------------------------------------------------------------------------
// Type → Icon mapping
// ---------------------------------------------------------------------------

interface TypeIconConfig {
  emoji: string;
  bg: string;
}

function getTypeIcon(
  type: TransactionType,
  direction: TransactionDirection,
  isPoisoning: boolean,
): TypeIconConfig {
  if (isPoisoning) return { emoji: "⚠️", bg: "bg-red-900/40" };

  switch (type) {
    case "transfer":
      return direction === "in"
        ? { emoji: "↓", bg: "bg-green-900/40" }
        : { emoji: "↑", bg: "bg-red-900/40" };
    case "swap":
      return { emoji: "⇄", bg: "bg-blue-900/40" };
    case "nft":
      return { emoji: "◆", bg: "bg-purple-900/40" };
    case "approval":
      return { emoji: "✓", bg: "bg-yellow-900/40" };
    case "spam":
      return { emoji: "✕", bg: "bg-neutral-800" };
    default:
      return { emoji: "●", bg: "bg-neutral-800" };
  }
}

function getIconColor(
  type: TransactionType,
  direction: TransactionDirection,
  isPoisoning: boolean,
): string {
  if (isPoisoning) return "text-red-400";

  switch (type) {
    case "transfer":
      return direction === "in" ? "text-green-400" : "text-red-400";
    case "swap":
      return "text-blue-400";
    case "nft":
      return "text-purple-400";
    case "approval":
      return "text-yellow-400";
    case "spam":
      return "text-neutral-500";
    default:
      return "text-neutral-400";
  }
}

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, copy] = useCopy();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy(text);
      }}
      className="
        ml-2 px-2 py-0.5 rounded text-xs
        bg-[#2a2a2a] hover:bg-[#3a3a3a]
        text-[#888] hover:text-white
        transition-colors cursor-pointer
      "
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// DetailRow
// ---------------------------------------------------------------------------

function DetailRow({
  label,
  value,
  showCopy = false,
  href,
}: {
  label: string;
  value: string;
  showCopy?: boolean;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[#666] text-xs">{label}</span>
      <div className="flex items-center">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#627EEA] hover:text-[#8da2f0] text-xs transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {value} ↗
          </a>
        ) : (
          <span className="text-[#aaa] text-xs font-mono">{value}</span>
        )}
        {showCopy && <CopyButton text={value} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TransactionCard
// ---------------------------------------------------------------------------

interface TransactionCardProps {
  transaction: ParsedTransaction;
  userAddress: string;
}

export default function TransactionCard({
  transaction: tx,
  userAddress,
}: TransactionCardProps) {
  void userAddress;
  const [expanded, setExpanded] = useState(false);

  const icon = getTypeIcon(tx.type, tx.direction, tx.isPoisoning);
  const iconColor = getIconColor(tx.type, tx.direction, tx.isPoisoning);
  const isIncoming = tx.direction === "in";

  // Card border & opacity modifiers
  const borderClass = tx.isPoisoning ? "border-l-2 border-l-red-600" : "";
  const opacityClass = tx.isSpam && !tx.isPoisoning ? "opacity-60" : "";

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`
        bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl
        hover:bg-[#1e1e1e] transition-all duration-200
        cursor-pointer select-none
        ${borderClass} ${opacityClass}
      `}
    >
      {/* -------------------------------------------------------------- */}
      {/* Main row                                                       */}
      {/* -------------------------------------------------------------- */}
      <div className="flex items-center gap-3 sm:gap-4 px-4 py-3.5">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-full
            flex items-center justify-center
            text-lg ${icon.bg} ${iconColor}
          `}
        >
          {icon.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {tx.description}
          </p>
          <p className="text-[#666] text-xs mt-0.5 truncate">
            {tx.fromLabel ?? shortAddr(tx.from)} →{" "}
            {tx.toLabel ?? shortAddr(tx.to)}
          </p>
          <p className="text-[#555] text-xs mt-0.5">{tx.date}</p>
        </div>

        {/* Value */}
        <div className="flex-shrink-0 text-right">
          <p
            className={`font-semibold text-sm ${
              isIncoming ? "text-green-400" : "text-red-400"
            }`}
          >
            {isIncoming ? "+" : "-"}
            {tx.value} {tx.tokenSymbol}
          </p>
          {tx.valueUsd && (
            <p className="text-[#666] text-xs mt-0.5">
              $
              {Number(tx.valueUsd).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Warning banners                                                */}
      {/* -------------------------------------------------------------- */}
      {tx.isPoisoning && (
        <div className="mx-3 mb-2 px-3 py-2.5 rounded-lg bg-red-950/50 border border-red-900/50">
          <p className="text-red-400 text-xs font-semibold">
            ⚠️ Address Poisoning Detected
          </p>
          <p className="text-red-400/70 text-xs mt-1 leading-relaxed">
            This address mimics{" "}
            <span className="font-mono">
              {tx.poisoningTarget
                ? shortAddr(tx.poisoningTarget)
                : "a known address"}
            </span>{" "}
            which you&apos;ve sent to before. Do NOT copy this address.
          </p>
        </div>
      )}

      {tx.isSpam && !tx.isPoisoning && (
        <div className="mx-3 mb-2 px-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
          <p className="text-neutral-400 text-xs font-semibold">
            🗑️ Spam Transaction
          </p>
          <p className="text-neutral-500 text-xs mt-1">
            This appears to be a spam or scam token.
          </p>
        </div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* Expandable details                                             */}
      {/* -------------------------------------------------------------- */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-t border-[#2a2a2a] mx-3 px-1 py-3 space-y-0.5">
          <DetailRow label="Tx Hash" value={shortAddr(tx.hash)} showCopy />
          <DetailRow
            label="From"
            value={tx.fromLabel ?? shortAddr(tx.from)}
            showCopy
          />
          <DetailRow
            label="To"
            value={tx.toLabel ?? shortAddr(tx.to)}
            showCopy
          />
          <DetailRow
            label="Gas Fee"
            value={`${tx.gasUsed}${tx.gasUsd ? ` ($${tx.gasUsd})` : ""}`}
          />
          <DetailRow label="Block" value={String(tx.blockNumber)} />
          <DetailRow
            label="Status"
            value={tx.status === "success" ? "✓ Success" : "✕ Failed"}
          />
          <DetailRow
            label="Explorer"
            value={`View on ${tx.chain}`}
            href={tx.explorerUrl}
          />
        </div>
      </div>
    </div>
  );
}
