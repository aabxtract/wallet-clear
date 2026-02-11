export const CHAINS = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    chainId: 1,
    explorer: "https://etherscan.io",
    icon: "⟠",
    color: "#627EEA",
    coingeckoId: "ethereum",
  },
  bsc: {
    id: 56,
    name: "BNB Chain",
    symbol: "BNB",
    chainId: 56,
    explorer: "https://bscscan.com",
    icon: "⬡",
    color: "#F3BA2F",
    coingeckoId: "binancecoin",
  },
  polygon: {
    id: 137,
    name: "Polygon",
    symbol: "MATIC",
    chainId: 137,
    explorer: "https://polygonscan.com",
    icon: "⬟",
    color: "#8247E5",
    coingeckoId: "matic-network",
  },
} as const;

export type ChainKey = keyof typeof CHAINS;
