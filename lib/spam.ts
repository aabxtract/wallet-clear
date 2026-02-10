import { RawTransaction } from "@/lib/chains";

// ---------------------------------------------------------------------------
// Spam detection heuristics
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
  "$ ",
];

const SPAM_TOKENS = new Set<string>([
  // Add known spam contract addresses here as lowercase
  // "0x...",
]);

/**
 * Very-small-value threshold in *wei* — 0.000001 native tokens (1e12).
 * Incoming token transfers below this value are flagged as potential spam.
 */
const DUST_THRESHOLD_WEI = BigInt("1000000000000"); // 1e12

/**
 * Determine whether a raw transaction looks like spam.
 *
 * Heuristics:
 * 1. Value < 0.000001 native token (dust).
 * 2. Token name contains suspicious keywords.
 * 3. Token is in SPAM_TOKENS list.
 * 4. Zero value AND no meaningful input data.
 * 5. (TODO) From address has sent to > 100 addresses (requires history).
 */
export function isSpamTransaction(
  tx: RawTransaction,
  userAddress: string,
): boolean {
  // const user = userAddress.toLowerCase(); // Unused
  void userAddress; // Suppress unused warning
  const tokenName = (tx.tokenName || "").toLowerCase();
  const contractAddress = (tx.contractAddress || "").toLowerCase();

  // 1. Dust check
  let valueWei = BigInt(0);
  try {
    valueWei = BigInt(tx.value || "0");
  } catch {}

  const isDust = valueWei > BigInt(0) && valueWei < DUST_THRESHOLD_WEI;

  if (isDust) {
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
  // "Meaningful input" usually means not empty and not just '0x'.
  // However, method IDs are 10 chars.
  const input = tx.input || "0x";
  const hasInput = input.length > 2; // "0x" is length 2
  if (valueWei === BigInt(0) && !hasInput) {
    // A 0-value transfer with no data is often a "cancel" tx or spam,
    // but usually spam if it's incoming.
    // If it is incoming to user, it's likely spam or a failed interaction.
    // Valid 0-value txs exist (e.g. self-cancel), but typically required gas.
    // The requirement is "Zero value AND no meaningful input data".
    // We'll mark it true.
    return true;
  }

  // 5. From address honeypot check (skipped - requires history)

  return false;
}
