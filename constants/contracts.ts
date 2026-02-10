// Known contract addresses mapped to human-readable labels
export const KNOWN_CONTRACTS: Record<string, string> = {
  // Uniswap
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2: Router",
  "0xe592427a0aece92de3edee1f18e0157c05861564": "Uniswap V3: Router",
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap V3: Router 2",
  "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad": "Uniswap: Universal Router",

  // 1inch
  "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch V5: Aggregation Router",
  "0x111111125421ca6dc452d289314280a0f8842a65": "1inch V6: Aggregation Router",

  // Binance Hot Wallets
  "0x28c6c06298d514db089934071355e5743bf21d60": "Binance: Hot Wallet 1",
  "0x21a31ee1afc51d94c2efccaa2092ad1028285549": "Binance: Hot Wallet 2",
  "0xdfd5293d8e347dfe59e90efd55b2956a1343963d": "Binance: Hot Wallet 3",
  "0x56eddb7aa87536c09ccc2793473599fd21a8b17f": "Binance: Hot Wallet 4",
  "0x9696f59e4d72e237be84ffd425dcad154bf96976": "Binance: Hot Wallet 5",

  // OpenSea
  "0x00000000000000adc04c56bf30ac9d3c0aaf14dc": "OpenSea: Seaport 1.5",
  "0x00000000000001ad428e4906ae43d8f9852d0dd6": "OpenSea: Seaport 1.6",

  // Blur
  "0x29469395eaf6f95920e59f858042f0e28d98a20b": "Blur: Marketplace",
  "0x39da41747a83aee658334415666f3ef92dd0d541": "Blur: Bidding",
  "0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5": "Blur: Blend",

  // Aave
  "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9": "Aave V2: Lending Pool",
  "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2": "Aave V3: Pool",
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": "Aave: AAVE Token",

  // Compound
  "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b": "Compound: Comptroller",
  "0xc3d688b66703497daa19211eedff47f25384cdc3": "Compound V3: cUSDCv3",
  "0xa17581a9e3356d9a858b789d68b4d866e593ae94": "Compound V3: cWETHv3",

  // Curve Finance
  "0xbebc44782c7db0a1a60cb6fe97d0b483032f8e6b": "Curve: 3pool",
  "0xd51a44d3fae010294c616388b506acda1bfaae46": "Curve: Tricrypto2",
  "0x99a58482bd75cbab83b27ec03ca68ff489b5788f": "Curve: Router",
};

// Known DEX router addresses
export const KNOWN_DEXES: string[] = [
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", // Uniswap V2 Router
  "0xe592427a0aece92de3edee1f18e0157c05861564", // Uniswap V3 Router
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", // Uniswap V3 Router 2
  "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad", // Uniswap Universal Router
  "0x1111111254eeb25477b68fb85ed929f73a960582", // 1inch V5
  "0x111111125421ca6dc452d289314280a0f8842a65", // 1inch V6
  "0xbebc44782c7db0a1a60cb6fe97d0b483032f8e6b", // Curve 3pool
  "0xd51a44d3fae010294c616388b506acda1bfaae46", // Curve Tricrypto2
  "0x99a58482bd75cbab83b27ec03ca68ff489b5788f", // Curve Router
];

// Known NFT marketplace addresses
export const KNOWN_NFT_MARKETPLACES: string[] = [
  "0x00000000000000adc04c56bf30ac9d3c0aaf14dc", // OpenSea Seaport 1.5
  "0x00000000000001ad428e4906ae43d8f9852d0dd6", // OpenSea Seaport 1.6
  "0x29469395eaf6f95920e59f858042f0e28d98a20b", // Blur Marketplace
  "0x39da41747a83aee658334415666f3ef92dd0d541", // Blur Bidding
  "0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5", // Blur Blend
];

// Known spam token name patterns (case-insensitive matching)
export const SPAM_TOKENS: string[] = [
  "visit",
  "claim",
  "airdrop",
  "reward",
  "free",
  ".com",
  ".io",
  ".org",
  ".xyz",
  ".net",
  "voucher",
  "bonus",
  "$ USDCGift",
  "Access",
  "Ape NFT",
  "ZERO TRANSFER",
];
