import axios from "axios";
import { CHAINS, ChainKey } from "@/constants/chains";

// ---------------------------------------------------------------------------
// Types for raw API responses
// ---------------------------------------------------------------------------

export interface RawTransaction {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasUsed: string;
  gasPrice: string;
  isError: string;
  blockNumber: string;
  input: string;
  contractAddress: string;
  functionName: string;
  // ERC-20 / NFT specific
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
  tokenID?: string;
  // Internal tag used after merge
  _txType?: "normal" | "erc20" | "nft";
}

interface ExplorerApiResponse {
  status: string;
  message: string;
  result: RawTransaction[] | string; // string when error
}

// ---------------------------------------------------------------------------
// Price cache (5-minute TTL)
// ---------------------------------------------------------------------------

interface PriceCacheEntry {
  price: number;
  expiry: number;
}

const priceCache = new Map<string, PriceCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ---------------------------------------------------------------------------
// fetchTransactions
// ---------------------------------------------------------------------------

const PAGE_SIZE = 25;

// Etherscan V2 API — single endpoint for all chains
const ETHERSCAN_V2_URL = "https://api.etherscan.io/v2/api";

/**
 * Fetch transactions for a given address on a given chain.
 *
 * Uses the Etherscan V2 API with a `chainid` parameter so a single API key
 * works across Ethereum, BNB Chain, and Polygon.
 *
 * @param address  Wallet address
 * @param chain    Chain key (ethereum | bsc | polygon)
 * @param page     1-indexed page number
 * @returns        Combined array of raw transactions for the requested page
 */
export async function fetchTransactions(
  address: string,
  chain: ChainKey,
  page: number = 1,
): Promise<RawTransaction[]> {
  const chainConfig = CHAINS[chain];
  const apiKey = process.env.ETHERSCAN_API_KEY ?? "";

  // Build the three API requests in parallel
  const [normalTxs, erc20Txs, nftTxs] = await Promise.all([
    fetchFromExplorer(chainConfig.chainId, {
      module: "account",
      action: "txlist",
      address,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "200", // fetch a larger window so we can merge & paginate locally
      sort: "desc",
      apikey: apiKey,
    }),
    fetchFromExplorer(chainConfig.chainId, {
      module: "account",
      action: "tokentx",
      address,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "200",
      sort: "desc",
      apikey: apiKey,
    }),
    fetchFromExplorer(chainConfig.chainId, {
      module: "account",
      action: "tokennfttx",
      address,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "200",
      sort: "desc",
      apikey: apiKey,
    }),
  ]);

  // Tag each result with its source type
  normalTxs.forEach((tx) => (tx._txType = "normal"));
  erc20Txs.forEach((tx) => (tx._txType = "erc20"));
  nftTxs.forEach((tx) => (tx._txType = "nft"));

  // Merge all transactions
  const combined = [...normalTxs, ...erc20Txs, ...nftTxs];

  // De-duplicate by hash + _txType (same hash can appear in normal & token lists)
  const seen = new Set<string>();
  const unique = combined.filter((tx) => {
    const key = `${tx.hash}-${tx._txType}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by timestamp descending
  unique.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));

  // Paginate locally
  const startIdx = (page - 1) * PAGE_SIZE;
  return unique.slice(startIdx, startIdx + PAGE_SIZE);
}

// ---------------------------------------------------------------------------
// fetchFromExplorer  (internal helper)
// ---------------------------------------------------------------------------

async function fetchFromExplorer(
  chainId: number,
  params: Record<string, string>,
): Promise<RawTransaction[]> {
  try {
    const { data } = await axios.get<ExplorerApiResponse>(ETHERSCAN_V2_URL, {
      params: { ...params, chainid: String(chainId) },
      timeout: 15_000,
    });

    if (data.status === "1" && Array.isArray(data.result)) {
      return data.result;
    }

    // Explorer returns status "0" with message "No transactions found" — not an error
    if (
      data.status === "0" &&
      typeof data.result === "string" &&
      data.result.toLowerCase().includes("no transactions found")
    ) {
      return [];
    }

    console.warn(
      `[chains] Explorer API warning: ${data.message} — ${data.result}`,
    );
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[chains] Explorer API request failed: ${error.message}`);
    } else {
      console.error("[chains] Unexpected error fetching from explorer:", error);
    }
    return [];
  }
}

// ---------------------------------------------------------------------------
// fetchTokenPrice
// ---------------------------------------------------------------------------

/**
 * Fetch the current USD price of a token from CoinGecko.
 * Results are cached for 5 minutes to respect rate limits.
 *
 * @param coingeckoId  CoinGecko asset identifier (e.g. "ethereum")
 * @returns            Current USD price, or 0 on failure
 */
export async function fetchTokenPrice(coingeckoId: string): Promise<number> {
  // Check cache
  const cached = priceCache.get(coingeckoId);
  if (cached && Date.now() < cached.expiry) {
    return cached.price;
  }

  try {
    const { data } = await axios.get<Record<string, { usd: number }>>(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: coingeckoId,
          vs_currencies: "usd",
        },
        timeout: 10_000,
      },
    );

    const price = data[coingeckoId]?.usd ?? 0;

    // Store in cache
    priceCache.set(coingeckoId, {
      price,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    return price;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[chains] CoinGecko price fetch failed: ${error.message}`);
    } else {
      console.error("[chains] Unexpected error fetching token price:", error);
    }
    return 0;
  }
}
