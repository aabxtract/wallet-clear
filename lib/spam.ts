import { RawTransaction } from "@/lib/chains";

// ---------------------------------------------------------------------------
// Spam detection heuristics
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Spam keywords
// ---------------------------------------------------------------------------

const SPAM_KEYWORDS = [
  "visit",
  "claim",
  "free",
  "reward",
  "airdrop",
  "www.",
  ".com",
  ".io",
  ".org",
  ".net",
  "bonus",
  "voucher",
  "$ ", // Explicitly requested
];

const SPAM_TOKENS = new Set<string>([
  // Add known spam contract addresses here as lowercase
]);

/**
 * 0.000001 native tokens (1e12 wei).
 */
const DUST_THRESHOLD_WEI = BigInt("1000000000000");

/**
 * Determine whether a raw transaction looks like spam.
 *
 * Heuristics:
 * 1. Value < 0.000001 native token (dust).
 * 2. Token name contains suspicious keywords.
 * 3. Token is in SPAM_TOKENS list.
 * 4. Zero value AND no meaningful input data.
 * 5. (TODO) From address has sent to > 100 addresses (requires external history).
 */
export function isSpamTransaction(
  tx: RawTransaction,
  userAddress: string,
): boolean {
  void userAddress; // Kept for interface compatibility / future rules

  const tokenName = (tx.tokenName || "").toLowerCase();
  const contractAddress = (tx.contractAddress || "").toLowerCase();

  // Parse value
  let valueWei = BigInt(0);
  try {
    if (tx.value && tx.value !== "0x") {
      valueWei = BigInt(tx.value);
    }
  } catch {
    // If value is invalid, treat as 0
  }

  // 1. Dust check (Value > 0 AND Value < 0.000001 native)
  // Logic: "Value is less than 0.000001" usually implies it's not 0, but is tiny.
  // Spam usually sends dust to get attention.
  // If strictly 0, it falls under rule #4 if no input.
  if (valueWei > 0 && valueWei < DUST_THRESHOLD_WEI) {
    return true;
  }

  // 2. Token name keywords
  if (SPAM_KEYWORDS.some((kw) => tokenName.includes(kw))) {
    return true;
  }

  // 3. Known spam token
  if (SPAM_TOKENS.has(contractAddress)) {
    return true;
  }

  // 4. Zero value AND no meaningful input data
  // "Meaningful input" = something other than '0x' or empty
  const input = tx.input || "0x";
  const hasInput = input.length > 2; // "0x" is length 2

  if (valueWei === BigInt(0) && !hasInput) {
    return true;
  }

  // 5. From address honeypot check
  // (Cannot check "sent to > 100 addresses" with current data snapshot)

  return false;
}
