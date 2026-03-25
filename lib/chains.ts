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
// Etherscan V2 — single base URL for ALL EVM chains
// ---------------------------------------------------------------------------

const ETHERSCAN_V2_URL = "https://api.etherscan.io/v2/api";
const HIRO_API_URL = "https://api.mainnet.hiro.so/extended/v1";

// ---------------------------------------------------------------------------
// fetchTransactions
// ---------------------------------------------------------------------------

/**
 * Fetch transactions for a given address on a given chain
 * using the Etherscan V2 API.
 *
 * Makes 3 parallel requests (normal txs, ERC-20 transfers, NFT transfers),
 * merges the results, deduplicates by hash, and sorts by timestamp desc.
 *
 * @param address  Wallet address
 * @param chain    Chain key (ethereum | bsc | polygon)
 * @param page     1-indexed page number
 * @returns        Merged, deduplicated, sorted array of raw transactions
 */
export async function fetchTransactions(
  address: string,
  chain: ChainKey,
  page: number = 1,
): Promise<RawTransaction[]> {
  if (chain === "stacks") {
    return fetchStacksTransactions(address, page);
  }

  const chainId = CHAINS[chain].chainId;
  const apiKey = process.env.ETHERSCAN_API_KEY ?? "";

  // Build the three API requests in parallel
  const [normalTxs, erc20Txs, nftTxs] = await Promise.all([
    fetchFromExplorer(chainId, {
      module: "account",
      action: "txlist",
      address,
      page: String(page),
      offset: "25",
      sort: "desc",
      apikey: apiKey,
    }),
    fetchFromExplorer(chainId, {
      module: "account",
      action: "tokentx",
      address,
      page: String(page),
      offset: "25",
      sort: "desc",
      apikey: apiKey,
    }),
    fetchFromExplorer(chainId, {
      module: "account",
      action: "tokennfttx",
      address,
      page: String(page),
      offset: "25",
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

  // Sort by timestamp descending
  combined.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));

  // Deduplicate by transaction hash
  const seen = new Set<string>();
  const unique = combined.filter((tx) => {
    if (seen.has(tx.hash)) return false;
    seen.add(tx.hash);
    return true;
  });

  return unique;
}

// ---------------------------------------------------------------------------
// fetchFromExplorer (internal helper)
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
// fetchStacksTransactions (internal helper)
// ---------------------------------------------------------------------------

async function fetchStacksTransactions(
  address: string,
  page: number = 1,
): Promise<RawTransaction[]> {
  const limit = 25;
  const offset = (page - 1) * limit;
  const url = `${HIRO_API_URL}/address/${address}/transactions?limit=${limit}&offset=${offset}`;

  try {
    const { data } = await axios.get(url, { timeout: 15_000 });
    const results = data.results || [];

    return results.map((stxTx: any) => {
      // Basic normalization from Stacks Hiro API -> RawTransaction interface
      // Stacks uses microSTX (6 decimals), STX token transfer amount is in 'token_transfer'
      // Normal transactions use 'stx_transfers' if they are pure STX transfers but simpler
      // is checking the top-level 'token_transfer' for STX-only, OR 'stx_transfers'.
      
      let to = "";
      let value = "0";

      if (stxTx.tx_type === "token_transfer") {
        to = stxTx.token_transfer.recipient_address;
        value = stxTx.token_transfer.amount; // in microSTX
      } else if (stxTx.stx_transfers && stxTx.stx_transfers.length > 0) {
        to = stxTx.stx_transfers[0].recipient;
        value = stxTx.stx_transfers[0].amount;
      }

      return {
        hash: stxTx.tx_id,
        timeStamp: String(stxTx.burn_block_time),
        from: stxTx.sender_address,
        to,
        value,
        gas: "0",
        gasUsed: stxTx.fee_rate || "0", // Map fee to gasUsed for simplicity in parser
        gasPrice: "1", // Map fee to gasUsed, set price to 1
        isError: stxTx.tx_status === "success" ? "0" : "1",
        blockNumber: String(stxTx.block_height),
        input: "",
        contractAddress: stxTx.tx_type === "smart_contract" ? stxTx.smart_contract?.contract_id : "",
        functionName: stxTx.tx_type === "contract_call" ? stxTx.contract_call?.function_name : "",
        tokenName: "Stacks",
        tokenSymbol: "STX",
        tokenDecimal: "6",
        _txType: stxTx.tx_type === "token_transfer" ? "normal" : "normal",
      };
    });
  } catch (error) {
    console.error("[chains] Stacks API fetch failed:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Token price cache
// ---------------------------------------------------------------------------

interface PriceCache {
  prices: Record<string, number> | null;
  lastFetched: number;
}

const priceCache: PriceCache = { prices: null, lastFetched: 0 };
const PRICE_CACHE_TTL = 300_000; // 5 minutes

const PRICE_FALLBACK: Record<string, number> = {
  ethereum: 0,
  binancecoin: 0,
  "matic-network": 0,
  blockstack: 0,
};

// ---------------------------------------------------------------------------
// fetchTokenPrices
// ---------------------------------------------------------------------------

/**
 * Fetch ETH, BNB, and MATIC prices in a single CoinGecko call.
 * Results are cached in memory for 5 minutes.
 *
 * Never throws — returns fallback zeros on failure so price fetch
 * failures don't block transaction loading.
 *
 * @returns  Object mapping coingeckoId → USD price
 */
export async function fetchTokenPrices(): Promise<Record<string, number>> {
  // Return cached if fresh
  if (
    priceCache.prices &&
    Date.now() - priceCache.lastFetched < PRICE_CACHE_TTL
  ) {
    return priceCache.prices;
  }

  try {
    const { data } = await axios.get<Record<string, { usd: number }>>(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "ethereum,binancecoin,matic-network,blockstack",
          vs_currencies: "usd",
        },
        timeout: 10_000,
      },
    );

    const prices: Record<string, number> = {
      ethereum: data.ethereum?.usd ?? 0,
      binancecoin: data.binancecoin?.usd ?? 0,
      "matic-network": data["matic-network"]?.usd ?? 0,
      blockstack: data.blockstack?.usd ?? 0,
    };

    // Update cache
    priceCache.prices = prices;
    priceCache.lastFetched = Date.now();

    return prices;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[chains] CoinGecko price fetch failed: ${error.message}`);
    } else {
      console.error("[chains] Unexpected error fetching token prices:", error);
    }
    return PRICE_FALLBACK;
  }
}

// ---------------------------------------------------------------------------
// getExplorerUrl
// ---------------------------------------------------------------------------

/**
 * Build a full block-explorer URL for a transaction hash.
 *
 * @param hash   Transaction hash
 * @param chain  Chain key (ethereum | bsc | polygon | stacks)
 * @returns      Full URL
 */
export function getExplorerUrl(hash: string, chain: ChainKey): string {
  if (chain === "stacks") {
    return `${CHAINS[chain].explorer}/txid/${hash}?chain=mainnet`;
  }
  return `${CHAINS[chain].explorer}/tx/${hash}`;
}
