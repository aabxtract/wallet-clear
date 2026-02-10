export const CHAINS = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    explorer: "https://etherscan.io",
    apiUrl: "https://api.etherscan.io/api",
    apiKeyEnv: "ETHERSCAN_API_KEY",
    icon: "⟠",
    color: "#627EEA",
    coingeckoId: "ethereum",
  },
  bsc: {
    id: 56,
    name: "BNB Chain",
    symbol: "BNB",
    explorer: "https://bscscan.com",
    apiUrl: "https://api.bscscan.com/api",
    apiKeyEnv: "BSCSCAN_API_KEY",
    icon: "⬡",
    color: "#F3BA2F",
    coingeckoId: "binancecoin",
  },
  polygon: {
    id: 137,
    name: "Polygon",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    apiUrl: "https://api.polygonscan.com/api",
    apiKeyEnv: "POLYGONSCAN_API_KEY",
    icon: "⬟",
    color: "#8247E5",
    coingeckoId: "matic-network",
  },
} as const;

export type ChainKey = keyof typeof CHAINS;
