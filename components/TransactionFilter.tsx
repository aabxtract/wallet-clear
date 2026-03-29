"use client";

import React from "react";
import { 
  Filter, 
  ArrowDownUp, 
  Coins, 
  Layers, 
  Trash2, 
  Search, 
  Calendar,
  DollarSign,
  X
} from "lucide-react";
import { TransactionType } from "@/types";

export interface FilterState {
  types: TransactionType[];
  minValue: number | null;
  dateRange: "all" | "24h" | "7d" | "30d" | "custom";
  customStartDate: string | null;
  customEndDate: string | null;
  searchQuery: string;
}

interface TransactionFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
  resultCount: number;
}

export default function TransactionFilter({
  filters,
  setFilters,
  onClear,
  resultCount,
}: TransactionFilterProps) {
  const toggleType = (type: TransactionType) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const setDateRange = (range: FilterState["dateRange"]) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  return (
    <div 
      className="
        bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#2a2a2a] 
        rounded-2xl p-5 mb-6 shadow-sm dark:shadow-none
      "
    >
      <div className="flex flex-col gap-6">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-neutral-900 dark:text-white">Advanced Search</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
              {resultCount} results
            </span>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search description, address or token..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(p => ({ ...p, searchQuery: e.target.value }))}
              className="
                w-full pl-10 pr-4 py-2 rounded-xl text-sm
                bg-neutral-50 dark:bg-[#0f0f0f] border border-neutral-200 dark:border-[#2a2a2a]
                outline-none focus:border-indigo-500 dark:focus:border-[#627EEA] transition-all
                text-neutral-900 dark:text-white
              "
            />
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Types */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-[#555]">Transaction Types</label>
            <div className="flex flex-wrap gap-2">
              {[
                { type: "transfer" as TransactionType, icon: ArrowDownUp, label: "Transfers" },
                { type: "swap" as TransactionType, icon: Coins, label: "Swaps" },
                { type: "nft" as TransactionType, icon: Layers, label: "NFTs" },
                { type: "approval" as TransactionType, icon: Filter, label: "Approvals" },
              ].map(({ type, icon: Icon, label }) => {
                const active = filters.types.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      border shadow-sm dark:shadow-none
                      ${active 
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500/50 text-indigo-600 dark:text-indigo-400" 
                        : "bg-white dark:bg-[#1f1f1f] border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-[#3a3a3a]"
                      }
                    `}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Value */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-[#555]">Value Threshold</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters(p => ({ ...p, minValue: p.minValue === 100 ? null : 100 }))}
                className={`
                  flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all
                  border shadow-sm dark:shadow-none
                  ${filters.minValue === 100
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-[#1f1f1f] border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-[#3a3a3a]"
                  }
                `}
              >
                <DollarSign className="w-3 h-3" />
                Large Transact. ( {">"} $100 )
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-[#555]">Date Range</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: "all", label: "All Time" },
                { key: "24h", label: "Past 24h" },
                { key: "7d", label: "7 Days" },
              ].map(({ key, label }) => {
                const active = filters.dateRange === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDateRange(key as any)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      border 
                      ${active 
                        ? "bg-amber-50 dark:bg-amber-950/30 border-amber-500/50 text-amber-600 dark:text-amber-400" 
                        : "bg-white dark:bg-[#1f1f1f] border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-[#3a3a3a]"
                      }
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {(filters.types.length > 0 || filters.minValue !== null || filters.dateRange !== "all" || filters.searchQuery !== "") && (
          <div className="pt-4 border-t border-neutral-100 dark:border-[#222] flex justify-between items-center animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-2">
              <span className="text-[10px] text-neutral-400 dark:text-[#555] self-center">ACTIVE FILTERS:</span>
              <div className="flex flex-wrap gap-1.5">
                {filters.types.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded text-[10px]">{t}</span>
                ))}
                {filters.minValue && (
                   <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded text-[10px]">{">"}$100</span>
                )}
                {filters.dateRange !== "all" && (
                   <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded text-[10px]">{filters.dateRange}</span>
                )}
              </div>
            </div>
            <button 
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
