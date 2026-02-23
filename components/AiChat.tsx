"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ParsedTransaction, ChatMessage as ChatMessageType } from "@/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

// ---------------------------------------------------------------------------
// Suggested question chips (shown before first user message)
// ---------------------------------------------------------------------------

const SUGGESTED_CHIPS = [
  "Have I been scammed?",
  "How much have I spent on gas?",
  "What protocols do I use most?",
  "Any suspicious activity?",
  "Show my biggest transactions",
];

// ---------------------------------------------------------------------------
// AiChat
// ---------------------------------------------------------------------------

interface AiChatProps {
  transactions: ParsedTransaction[];
  address: string;
  chain: string;
  spamCount: number;
  poisoningCount: number;
}

export default function AiChat({
  transactions,
  address,
  chain,
  spamCount,
  poisoningCount,
}: AiChatProps) {
  // ---- State ----
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; content: string }[]
  >([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ---- Scroll to bottom on new messages ----
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // ---- Welcome message on mount ----
  useEffect(() => {
    const welcome: ChatMessageType = {
      role: "ai",
      content:
        `👋 Hi! I've analyzed this wallet.\n` +
        `I found **${transactions.length}** transactions, **${spamCount}** spam items, ` +
        `and **${poisoningCount}** address poisoning attempts.\n\n` +
        `What would you like to know?`,
      timestamp: Date.now(),
    };
    setMessages([welcome]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Send message ----
  const sendMessage = useCallback(
    async (text: string) => {
      // Hide chips after first user message
      setChipsVisible(false);

      // Add user message
      const userMsg: ChatMessageType = {
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      // Build history for API (exclude the welcome message)
      const historyForAPI = [
        ...conversationHistory,
        { role: "user", content: text },
      ];

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            transactions,
            address,
            chain,
            history: conversationHistory,
            spamCount,
            poisoningCount,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message ?? `Request failed (${res.status})`);
        }

        const aiMsg: ChatMessageType = {
          role: "ai",
          content:
            data.reply ?? data.message ?? "Sorry, I couldn't process that.",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMsg]);
        setConversationHistory([
          ...historyForAPI,
          { role: "ai", content: aiMsg.content },
        ]);
      } catch {
        const errorMsg: ChatMessageType = {
          role: "ai",
          content:
            "⚠️ Something went wrong connecting to the AI service. Please try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    },
    [
      transactions,
      address,
      chain,
      conversationHistory,
      spamCount,
      poisoningCount,
    ],
  );

  // ---- Render ----
  return (
    <div
      className="
        flex flex-col
        bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl
        overflow-hidden
        h-[500px] sm:h-[600px]
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a2a] bg-[#141414]">
        <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 flex items-center justify-center text-sm">
          🤖
        </div>
        <div>
          <p className="text-white text-sm font-semibold">WalletClear AI</p>
          <p className="text-[#555] text-xs">
            Analyzing {transactions.length} transactions
          </p>
        </div>
        {/* Status dot */}
        <div className="ml-auto flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-400 animate-pulse" : "bg-green-400"
              }`}
          />
          <span className="text-[#555] text-xs">
            {loading ? "Thinking" : "Online"}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {/* Suggested question chips */}
        {chipsVisible && messages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mb-1">
            {SUGGESTED_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="
                  px-3 py-1.5 rounded-full text-xs
                  bg-[#1a1a1a] border border-[#2a2a2a]
                  text-[#888] hover:text-white hover:border-[#3b82f6]/50
                  transition-colors cursor-pointer
                "
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
}
