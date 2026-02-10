// ---------------------------------------------------------------------------
// Known contract labels, DEX routers, and NFT marketplace addresses
// ---------------------------------------------------------------------------

/**
 * Human-readable labels for well-known contract addresses.
 * All keys MUST be lowercase.
 */
export const KNOWN_CONTRACTS: Record<string, string> = {
  // --- Exchanges ---
  "0x28c6c06298d514db089934071355e5743bf21d60": "Binance Hot Wallet",
  "0x21a31ee1afc51d94c2efccaa2092ad1028285549": "Binance Hot Wallet 2",
  "0xdfd5293d8e347dfe59e90efd55b2956a1343963d": "Binance Hot Wallet 3",
  "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43": "Coinbase Commerce",
  "0x503828976d22510aad0201ac7ec88293211d23da": "Coinbase",
  "0x71660c4005ba85c37ccec55d0c4493e66fe775d3": "Coinbase 3",
  "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98": "Bittrex",
  "0x2910543af39aba0cd09dbb2d50200b3e800a63d2": "Kraken",
  "0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0": "Kraken 4",

  // --- DEX Routers ---
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2 Router",
  "0xe592427a0aece92de3edee1f18e0157c05861564": "Uniswap V3 Router",
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap Universal Router",
  "0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b": "Uniswap Universal Router 2",
  "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad": "Uniswap Universal Router 3",
  "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f": "SushiSwap Router",
  "0x10ed43c718714eb63d5aa57b78b54704e256024e": "PancakeSwap V2 Router",
  "0x13f4ea83d0bd40e75c8222255bc855a974568dd4": "PancakeSwap V3 Router",
  "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff": "QuickSwap Router",
  "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch V5 Router",

  // --- NFT Marketplaces ---
  "0x00000000000000adc04c56bf30ac9d3c0aaf14dc": "OpenSea Seaport 1.5",
  "0x00000000006c3852cbef3e08e8df289169ede581": "OpenSea Seaport 1.1",
  "0x0000000000000ad24e80fd803c6ac37206a95221": "LooksRare Exchange",
  "0x29469395eaf6f95920e59f858042f0e28d98a20b": "Blur Marketplace",
  "0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5": "Blur Marketplace 2",

  // --- Common Tokens ---
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "Tether (USDT)",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USD Coin (USDC)",
  "0x6b175474e89094c44da98b954eedeac495271d0f": "DAI Stablecoin",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "Wrapped BTC (WBTC)",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "Wrapped ETH (WETH)",
};

/**
 * Set of well-known DEX router addresses (lowercase).
 */
export const KNOWN_DEXES = new Set<string>([
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", // Uniswap V2
  "0xe592427a0aece92de3edee1f18e0157c05861564", // Uniswap V3
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", // Uniswap Universal
  "0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b", // Uniswap Universal 2
  "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad", // Uniswap Universal 3
  "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f", // SushiSwap
  "0x10ed43c718714eb63d5aa57b78b54704e256024e", // PancakeSwap V2
  "0x13f4ea83d0bd40e75c8222255bc855a974568dd4", // PancakeSwap V3
  "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff", // QuickSwap
  "0x1111111254eeb25477b68fb85ed929f73a960582", // 1inch V5
]);

/**
 * Set of well-known NFT marketplace addresses (lowercase).
 */
export const KNOWN_NFT_MARKETPLACES = new Set<string>([
  "0x00000000000000adc04c56bf30ac9d3c0aaf14dc", // OpenSea Seaport 1.5
  "0x00000000006c3852cbef3e08e8df289169ede581", // OpenSea Seaport 1.1
  "0x0000000000000ad24e80fd803c6ac37206a95221", // LooksRare
  "0x29469395eaf6f95920e59f858042f0e28d98a20b", // Blur
  "0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5", // Blur 2
]);

/**
 * Look up a human-readable label for an address.
 * Returns `undefined` if the address is not recognized.
 */
export function getLabel(address: string): string | undefined {
  return KNOWN_CONTRACTS[address.toLowerCase()];
}
