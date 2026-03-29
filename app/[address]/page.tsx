"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ParsedTransaction, WalletSummary } from "@/types";
import { ChainKey, CHAINS } from "@/constants/chains";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import TransactionCard from "@/components/TransactionCard";
import AiChat from "@/components/AiChat";
import ChainSelector from "@/components/ChainSelector";
import ThemeToggle from "@/components/ThemeToggle";
import TransactionFilter, { FilterState } from "@/components/TransactionFilter";

// ---------------------------------------------------------------------------
// Address page
// ---------------------------------------------------------------------------

type MobileTab = "history" | "chat";

const INITIAL_FILTERS: FilterState = {
  types: [],
  minValue: null,
  dateRange: "all",
  customStartDate: null,
  customEndDate: null,
  searchQuery: "",
};

export default function AddressPage({
  params,
}: {
  params: { address: string };
}) {
  const searchParams = useSearchParams();
  const initialChain = (searchParams.get("chain") ?? "ethereum") as ChainKey;

  const [chain, setChain] = useState<ChainKey>(
    Object.keys(CHAINS).includes(initialChain) ? initialChain : "ethereum",
  );
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [spamCount, setSpamCount] = useState(0);
  const [poisoningCount, setPoisoningCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("history");
  
  // -- Filter State --
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // ---- Fetch transactions ----
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTransactions([]);
    setFilters(INITIAL_FILTERS);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: params.address, chain }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.message ?? `Request failed with status ${res.status}`,
        );
      }

      const data: WalletSummary = await res.json();
      setTransactions(data.transactions);
      setSpamCount(data.spamCount);
      setPoisoningCount(data.poisoningCount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions",
      );
    } finally {
      setIsLoading(false);
    }
  }, [params.address, chain]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -- Filtering Logic --
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery = 
          tx.description.toLowerCase().includes(query) ||
          tx.from.toLowerCase().includes(query) ||
          tx.to.toLowerCase().includes(query) ||
          tx.tokenSymbol?.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. Types
      if (filters.types.length > 0) {
        if (!filters.types.includes(tx.type)) return false;
      }

      // 3. Min Value
      if (filters.minValue !== null) {
        const val = tx.valueUsd ? Number(tx.valueUsd) : 0;
        if (val < filters.minValue) return false;
      }

      // 4. Date range
      if (filters.dateRange !== "all") {
        const now = Date.now();
        const txTime = tx.timestamp;
        const diff = now - txTime;

        if (filters.dateRange === "24h" && diff > 24 * 60 * 60 * 1000) return false;
        if (filters.dateRange === "7d" && diff > 7 * 24 * 60 * 60 * 1000) return false;
        if (filters.dateRange === "30d" && diff > 30 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // ---- Derive state ----
  const isEmpty = !isLoading && !error && transactions.length === 0;
  const hasData = !isLoading && !error && transactions.length > 0;

  // ---- Short address for display ----
  const shortAddr =
    params.address.length > 10
      ? `${params.address.slice(0, 6)}…${params.address.slice(-4)}`
      : params.address;

  return (
    <main className="min-h-screen px-4 py-6 sm:py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Wallet Analysis
          </h1>
          <p
            className="text-neutral-500 dark:text-[#888] text-xs sm:text-sm mt-1 font-mono"
            title={params.address}
          >
            {shortAddr}
          </p>
        </div>

        {/* Chain selector & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ChainSelector selected={chain} onChange={setChain} />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Content area                                                     */}
      {/* ---------------------------------------------------------------- */}

      {/* Loading */}
      {isLoading && <LoadingSkeleton />}

      {/* Error */}
      {error && <ErrorState message={error} onRetry={fetchData} />}

      {/* Empty */}
      {isEmpty && <EmptyState />}

      {/* Data */}
      {hasData && (
        <>
          {/* Advanced Filters */}
          <div className="mb-6">
            <TransactionFilter
              filters={filters}
              setFilters={setFilters}
              onClear={() => setFilters(INITIAL_FILTERS)}
              resultCount={filteredTransactions.length}
            />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Mobile tab bar (visible < lg)                                   */}
          {/* -------------------------------------------------------------- */}
          <div className="lg:hidden flex mb-4 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#2a2a2a] rounded-xl p-1 shadow-sm dark:shadow-none">
            <button
              onClick={() => setMobileTab("history")}
              className={`
                flex-1 py-2.5 rounded-lg text-sm font-medium
                transition-colors
                ${
                  mobileTab === "history"
                    ? "bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-900 dark:text-white shadow-sm dark:shadow-none"
                    : "text-neutral-500 dark:text-[#666] hover:text-neutral-700 dark:hover:text-[#999]"
                }
              `}
            >
              📋 History
            </button>
            <button
              onClick={() => setMobileTab("chat")}
              className={`
                flex-1 py-2.5 rounded-lg text-sm font-medium
                transition-colors
                ${
                  mobileTab === "chat"
                    ? "bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-900 dark:text-white shadow-sm dark:shadow-none"
                    : "text-neutral-500 dark:text-[#666] hover:text-neutral-700 dark:hover:text-[#999]"
                }
              `}
            >
              🤖 AI Chat
            </button>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Desktop: side-by-side grid  |  Mobile: tabbed view             */}
          {/* -------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions column — shown on desktop always, mobile only when history tab */}
            <div
              className={`lg:col-span-2 space-y-3 ${
                mobileTab !== "history" ? "hidden lg:block" : ""
              }`}
            >
              {/* Stats bar */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className="text-neutral-900 dark:text-white text-sm font-semibold">
                  {filteredTransactions.length} Transactions
                </span>
                {spamCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-transparent">
                    {spamCount} spam
                  </span>
                )}
                {poisoningCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-transparent">
                    {poisoningCount} poisoning
                  </span>
                )}
              </div>

              {/* Transaction cards */}
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <TransactionCard
                    key={`${tx.hash}-${tx.type}`}
                    transaction={tx}
                    userAddress={params.address}
                  />
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">No transactions match your search filters.</p>
                  <button 
                    onClick={() => setFilters(INITIAL_FILTERS)}
                    className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* AI Chat column — shown on desktop always, mobile only when chat tab */}
            <div
              className={`lg:col-span-1 ${
                mobileTab !== "chat" ? "hidden lg:block" : ""
              }`}
            >
              <div className="lg:sticky lg:top-8">
                <AiChat
                  transactions={transactions}
                  address={params.address}
                  chain={chain}
                  spamCount={spamCount}
                  poisoningCount={poisoningCount}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
