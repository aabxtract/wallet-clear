"use client";

import React, { useState, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// ChatInput
// ---------------------------------------------------------------------------

interface ChatInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on the input after sending
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3">
      {/* Typing indicator */}
      {loading && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-[#666] text-xs">
            WalletClear AI is thinking…
          </span>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={
            loading ? "Waiting for response…" : "Ask about this wallet…"
          }
          className="
            flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl
            px-4 py-2.5 text-sm text-white
            placeholder-[#555]
            focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/30
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="
            flex-shrink-0 w-10 h-10 rounded-xl
            bg-[#3b82f6] hover:bg-[#2563eb]
            disabled:bg-[#1a1a1a] disabled:text-[#555] disabled:cursor-not-allowed
            text-white text-sm font-bold
            flex items-center justify-center
            transition-colors
          "
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
