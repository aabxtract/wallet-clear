import { RawTransaction } from "@/lib/chains";
import { TransactionType } from "@/types";
import { KNOWN_DEXES, KNOWN_NFT_MARKETPLACES } from "@/lib/labels";
import { isSpamTransaction } from "@/lib/spam";

// ---------------------------------------------------------------------------
// Method-ID → transaction type mapping
// ---------------------------------------------------------------------------

/** 4-byte method selectors for common operations. */
const METHOD_ID_MAP: Record<string, TransactionType> = {
  "0xa9059cbb": "transfer", // ERC-20 transfer(address,uint256)
  "0x095ea7b3": "approval", // ERC-20 approve(address,uint256)
  "0x7ff36ab5": "swap", // swapExactETHForTokens
  "0x38ed1739": "swap", // swapExactTokensForTokens
  "0x8803dbee": "swap", // swapTokensForExactTokens
  "0x18cbafe5": "swap", // swapExactTokensForETH
  "0xfb3bdb41": "swap", // swapETHForExactTokens
};

// ---------------------------------------------------------------------------
// categorizeTransaction
// ---------------------------------------------------------------------------

/**
 * Determine the {@link TransactionType} for a raw explorer transaction.
 *
 * Priority order:
 *  1. Method-ID match (input field)
 *  2. Known DEX address → swap
 *  3. Known NFT marketplace or NFT transfer type → nft
 *  4. Spam heuristics → spam
 *  5. Simple value transfer (no input data) → transfer
 *  6. Fallback → contract_interaction
 */
export function categorizeTransaction(
  tx: RawTransaction,
  userAddress: string,
): TransactionType {
  const input = tx.input ?? "";
  const methodId = input.length >= 10 ? input.slice(0, 10).toLowerCase() : "";
  const toAddr = (tx.to ?? "").toLowerCase();

  // 1. Method-ID match
  const methodMatch = METHOD_ID_MAP[methodId];
  if (methodMatch) {
    return methodMatch;
  }

  // 2. Known DEX router
  if (toAddr && KNOWN_DEXES.has(toAddr)) {
    return "swap";
  }

  // 3. Known NFT marketplace or tagged as NFT by explorer
  if (tx._txType === "nft" || (toAddr && KNOWN_NFT_MARKETPLACES.has(toAddr))) {
    return "nft";
  }

  // 4. Spam heuristic (dust-value incoming transfers, suspicious names)
  if (isSpamTransaction(tx, userAddress)) {
    return "spam";
  }

  // 5. Simple value transfer — no meaningful input data
  if ((!input || input === "0x") && tx.value && BigInt(tx.value) > BigInt(0)) {
    return "transfer";
  }

  // 6. Fallback
  return "contract_interaction";
}
