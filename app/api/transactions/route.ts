import { NextResponse } from "next/server";
import { isAddress } from "ethers";
import { CHAINS, ChainKey } from "@/constants/chains";
import { fetchTransactions, fetchTokenPrices } from "@/lib/chains";
import { parseTransactions } from "@/lib/parser";
import { ParsedTransaction, WalletSummary } from "@/types";
import { rateLimit } from "@/lib/rate-limit";

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
    const { address, chain, page = 1 } = body;

    // 1. Validation
    if (!address || typeof address !== "string" || !isAddress(address)) {
      return NextResponse.json(
        { message: "Invalid wallet address" },
        { status: 400 },
      );
    }

    if (
      !chain ||
      typeof chain !== "string" ||
      !Object.keys(CHAINS).includes(chain)
    ) {
      return NextResponse.json(
        { message: "Unsupported chain" },
        { status: 400 },
      );
    }

    const chainKey = chain as ChainKey;
    const chainConfig = CHAINS[chainKey];

    // 2. Fetch data (Transactions + Token Prices in parallel)
    const [rawTxs, prices] = await Promise.all([
      fetchTransactions(address, chainKey, page),
      fetchTokenPrices(),
    ]);

    const tokenPrice = prices[chainConfig.coingeckoId] ?? 0;

    // 3. Parse & Analyze
    const transactions: ParsedTransaction[] = parseTransactions(
      rawTxs,
      address,
      chainKey,
      tokenPrice,
    );

    // 4. Aggregate Stats
    let spamCount = 0;
    let poisoningCount = 0;

    for (const tx of transactions) {
      if (tx.isSpam) spamCount++;
      if (tx.isPoisoning) poisoningCount++;
    }

    const summary: WalletSummary = {
      address,
      chain: chainKey,
      totalTransactions: transactions.length,
      spamCount,
      poisoningCount,
      transactions,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
