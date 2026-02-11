"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "@/types";

// ---------------------------------------------------------------------------
// Minimal markdown-like formatting
// ---------------------------------------------------------------------------

function formatContent(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    // Bullet points
    if (/^[-•]\s+/.test(line.trim())) {
      const bullet = line.trim().replace(/^[-•]\s+/, "");
      nodes.push(
        <div key={lineIdx} className="flex gap-2 items-start pl-1 py-0.5">
          <span className="text-[#555] mt-0.5 select-none">•</span>
          <span>{applyInlineFormatting(bullet)}</span>
        </div>,
      );
      return;
    }

    // Blank line → spacer
    if (line.trim() === "") {
      nodes.push(<div key={lineIdx} className="h-2" />);
      return;
    }

    // Normal line
    nodes.push(
      <p key={lineIdx} className="leading-relaxed">
        {applyInlineFormatting(line)}
      </p>,
    );
  });

  return nodes;
}

/** Replace **bold** markers with <strong> elements. */
function applyInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ---------------------------------------------------------------------------
// ChatMessage component
// ---------------------------------------------------------------------------

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`
          max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm
          ${
            isUser
              ? "bg-[#3b82f6] text-white rounded-br-md"
              : "bg-[#1a1a1a] text-[#d4d4d4] border border-[#2a2a2a] rounded-bl-md"
          }
        `}
      >
        {/* Content */}
        <div className="space-y-0.5">
          {isUser ? (
            <p className="leading-relaxed">{message.content}</p>
          ) : (
            formatContent(message.content)
          )}
        </div>

        {/* Timestamp */}
        <p
          className={`text-[10px] mt-2 ${
            isUser ? "text-blue-200/60" : "text-[#555]"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
