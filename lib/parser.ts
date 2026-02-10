import { RawTransaction } from "@/lib/chains";
import { CHAINS, ChainKey } from "@/constants/chains";
import { ParsedTransaction, TransactionDirection } from "@/types";
import { categorizeTransaction } from "@/lib/categorize";
import { getLabel } from "@/lib/labels";
import { isSpamTransaction } from "@/lib/spam";
import { detectPoisoning } from "@/lib/poisoning";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Shorten an address to `0x1a2b…3c4d` form.
 */
function shortAddr(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Convert a wei-denominated value to a human-readable decimal string.
 * Uses the token's decimal precision (default 18).
 */
function fromWei(value: string, decimals = 18): string {
  if (!value || value === "0") return "0";

  const raw = value.padStart(decimals + 1, "0");
  const intPart = raw.slice(0, raw.length - decimals) || "0";
  const fracPart = raw.slice(raw.length - decimals);

  // Trim trailing zeros but keep at least 4 significant decimals
  const trimmed = fracPart.replace(/0+$/, "");
  if (!trimmed) return intPart;
  return `${intPart}.${trimmed.slice(0, 6)}`;
}

/**
 * Format a Unix timestamp as a readable date string.
 * Example: "Feb 10, 2026 • 2:34 PM"
 */
function formatDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} • ${time}`;
}

/**
 * Determine transaction direction relative to `userAddress`.
 */
function getDirection(
  from: string,
  to: string,
  userAddress: string,
): TransactionDirection {
  const user = userAddress.toLowerCase();
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  if (f === user && t === user) return "self";
  if (f === user) return "out";
  return "in";
}

// ---------------------------------------------------------------------------
// Description generators (per transaction type)
// ---------------------------------------------------------------------------

function buildDescription(
  type: string,
  direction: TransactionDirection,
  formattedValue: string,
  symbol: string,
  from: string,
  to: string,
  fromLabel: string | undefined,
  toLabel: string | undefined,
  tokenName: string | undefined,
): string {
  const fromDisplay = fromLabel ?? shortAddr(from);
  const toDisplay = toLabel ?? shortAddr(to);

  switch (type) {
    case "transfer":
      return direction === "in"
        ? `Received ${formattedValue} ${symbol} from ${fromDisplay}`
        : `Sent ${formattedValue} ${symbol} to ${toDisplay}`;

    case "swap":
      return `Swapped on ${toLabel ?? shortAddr(to)}`;

    case "approval":
      return `Approved ${toLabel ?? shortAddr(to)} to spend ${tokenName ?? symbol}`;

    case "nft":
      return `NFT transaction on ${toLabel ?? shortAddr(to)}`;

    case "spam":
      return "Spam token received";

    case "contract_interaction":
      return `Contract interaction with ${toDisplay}`;

    default:
      return `Contract interaction with ${toDisplay}`;
  }
}

// ---------------------------------------------------------------------------
// parseTransactions
// ---------------------------------------------------------------------------

/**
 * Transform an array of raw explorer transactions into clean
 * {@link ParsedTransaction} objects.
 *
 * @param txs         Raw transactions from the explorer API
 * @param userAddress The wallet address being inspected
 * @param chain       Chain key (ethereum | bsc | polygon)
 * @param tokenPrice  Current USD price of the chain's native token
 */
export function parseTransactions(
  txs: RawTransaction[],
  userAddress: string,
  chain: ChainKey,
  tokenPrice: number,
): ParsedTransaction[] {
  const chainConfig = CHAINS[chain];

  return txs.map((tx) => {
    const from = tx.from ?? "";
    const to = tx.to ?? "";
    const direction = getDirection(from, to, userAddress);
    const type = categorizeTransaction(tx, userAddress);
    const fromLabel = getLabel(from);
    const toLabel = getLabel(to);

    // --- Value formatting ---
    const decimals = tx.tokenDecimal ? Number(tx.tokenDecimal) : 18;
    const symbol = tx.tokenSymbol ?? chainConfig.symbol;
    const formattedValue = fromWei(tx.value, decimals);

    // --- USD value ---
    const numericValue = parseFloat(formattedValue) || 0;
    const valueUsd =
      numericValue > 0 && tokenPrice > 0
        ? (numericValue * tokenPrice).toFixed(2)
        : undefined;

    // --- Gas ---
    const gasUsedNum = BigInt(tx.gasUsed || "0");
    const gasPriceNum = BigInt(tx.gasPrice || "0");
    const gasWei = gasUsedNum * gasPriceNum;
    const gasFormatted = fromWei(gasWei.toString(), 18);
    const gasNumeric = parseFloat(gasFormatted) || 0;
    const gasUsd =
      gasNumeric > 0 && tokenPrice > 0
        ? (gasNumeric * tokenPrice).toFixed(2)
        : undefined;

    // --- Timestamp ---
    const timestamp = Number(tx.timeStamp);
    const date = formatDate(timestamp);

    // --- Explorer URL ---
    const explorerUrl = `${chainConfig.explorer}/tx/${tx.hash}`;

    // --- Spam & poisoning ---
    const isSpam = type === "spam" || isSpamTransaction(tx, userAddress);
    const { isPoisoning, poisoningTarget } = detectPoisoning(
      tx,
      userAddress,
      txs,
    );

    // --- Description ---
    const description = buildDescription(
      type,
      direction,
      formattedValue,
      symbol,
      from,
      to,
      fromLabel,
      toLabel,
      tx.tokenName,
    );

    const parsed: ParsedTransaction = {
      hash: tx.hash,
      timestamp,
      date,
      type,
      direction,
      value: formattedValue,
      valueUsd,
      token: tx.tokenName ?? chainConfig.name,
      tokenSymbol: symbol,
      from,
      fromLabel,
      to,
      toLabel,
      gasUsed: gasFormatted,
      gasUsd,
      status: tx.isError === "0" ? "success" : "failed",
      isSpam,
      isPoisoning,
      poisoningTarget,
      description,
      chain: chainConfig.name,

      blockNumber: Number(tx.blockNumber),
      explorerUrl,
    };

    return parsed;
  });
}
