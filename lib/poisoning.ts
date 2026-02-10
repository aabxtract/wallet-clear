import { RawTransaction } from "@/lib/chains";

export interface PoisoningResult {
  isPoisoning: boolean;
  poisoningTarget?: string;
}

/**
 * Check if two addresses look deceptively similar.
 *
 * Similarity criteria:
 * 1. Both start with the same 8 characters (including '0x').
 * 2. Both end with the same 6 characters.
 * 3. Not identical (otherwise it's a valid transfer to self or same address).
 */
export function isSimilarAddress(addr1: string, addr2: string): boolean {
  if (!addr1 || !addr2) return false;

  const a1 = addr1.toLowerCase();
  const a2 = addr2.toLowerCase();

  if (a1 === a2) return false;

  const prefixMatch = a1.slice(0, 8) === a2.slice(0, 8);
  const suffixMatch = a1.slice(-6) === a2.slice(-6);

  return prefixMatch && suffixMatch;
}

/**
 * Detect address poisoning attempts.
 *
 * An attacker sends a 0-value or dust transaction from an address that looks
 * extremely similar to one the user frequently interacts with, hoping the user
 * will copy-paste the attacker's address by mistake from history.
 *
 * @param tx            The transaction to inspect
 * @param userAddress   The user's wallet address
 * @param allTxs        All available historical transactions (to compare against)
 */
export function detectPoisoning(
  tx: RawTransaction,
  userAddress: string,
  allTxs: RawTransaction[],
): PoisoningResult {
  const user = userAddress.toLowerCase();
  const toAddr = (tx.to || "").toLowerCase();
  const fromAddr = (tx.from || "").toLowerCase();

  // 1. Only check INCOMING transactions (attacker sends TO user)
  if (toAddr !== user) {
    return { isPoisoning: false };
  }

  // 2. Only check DUST transactions (< 0.001 native token)
  // 0.001 ETH = 1e15 wei
  const POISON_THRESHOLD_WEI = BigInt("1000000000000000"); // 1e15
  let valueWei = BigInt(0);
  try {
    valueWei = BigInt(tx.value || "0");
  } catch {}

  if (valueWei >= POISON_THRESHOLD_WEI) {
    // Too expensive to be a likely poisoning attack (or legitimate transfer)
    return { isPoisoning: false };
  }

  // 3. Get list of addresses user has previously SENT to
  // Filter all txs where from === userAddress, collect unique to addresses
  const sentToAddresses = new Set<string>();
  for (const t of allTxs) {
    if ((t.from || "").toLowerCase() === user) {
      const recipient = (t.to || "").toLowerCase();
      if (recipient) {
        sentToAddresses.add(recipient);
      }
    }
  }

  // 4. For each sent-to address, check similarity with the attacker's address (tx.from)
  // The attacker (tx.from) is trying to mimic someone the user knows (target)
  let foundPoisoning = false;
  let detectedTarget: string | undefined;

  sentToAddresses.forEach((target) => {
    if (foundPoisoning) return;
    if (isSimilarAddress(fromAddr, target)) {
      foundPoisoning = true;
      detectedTarget = target;
    }
  });

  if (foundPoisoning) {
    return {
      isPoisoning: true,
      poisoningTarget: detectedTarget,
    };
  }

  return { isPoisoning: false };
}
