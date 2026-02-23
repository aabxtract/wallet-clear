import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ParsedTransaction } from "@/types";
import { rateLimit } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Suggested follow-up questions
// ---------------------------------------------------------------------------

const SUGGESTED_QUESTIONS = [
  "Have I been scammed?",
  "How much have I spent on gas?",
  "What protocols do I use most?",
  "Any suspicious activity?",
  "Show my biggest transactions",
];

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    // --- Rate limiting ---
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "127.0.0.1";
    const { allowed } = rateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please wait a moment." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { message, transactions, address, chain, history } = body as {
      message: string;
      transactions: ParsedTransaction[];
      address: string;
      chain: string;
      history: { role: string; content: string }[];
    };

    // --- Input validation ---
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      console.error("[chat] GEMINI_API_KEY is not set");
      return NextResponse.json(
        { message: "AI service is not configured. Please set GEMINI_API_KEY in your .env.local file." },
        { status: 500 },
      );
    }

    // --- Aggregate stats for the system prompt ---
    const spamCount = (transactions ?? []).filter((tx) => tx.isSpam).length;
    const poisoningCount = (transactions ?? []).filter(
      (tx) => tx.isPoisoning,
    ).length;

    // --- System prompt ---
    const systemPrompt = `You are WalletClear AI, a friendly blockchain wallet analyst. 
Your job is to help users understand their crypto transaction 
history in plain English. 

Rules:
- Be concise and friendly
- Format numbers nicely ($1,234.56 not 1234.5678912)
- Flag suspicious activity clearly with ⚠️
- Always mention address poisoning attempts if found
- Keep responses short and scannable
- Use bullet points for lists
- Don't use technical jargon unless necessary
- If asked about something not in the data, say so clearly

Wallet being analyzed: ${address} on ${chain}
Total transactions: ${(transactions ?? []).length}
Spam transactions found: ${spamCount}
Address poisoning attempts: ${poisoningCount}

Full transaction history:
${JSON.stringify(transactions ?? [], null, 2)}`;

    // --- Initialize Gemini ---
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // --- Build conversation history ---
    const chatHistory = (history ?? []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }],
      }),
    );

    // --- Start chat and send message ---
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({
      reply,
      suggestedQuestions: SUGGESTED_QUESTIONS,
    });
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[chat] API Error:", errMsg, error);
    return NextResponse.json(
      {
        message: `Failed to get AI response: ${errMsg}`,
      },
      { status: 500 },
    );
  }
}
