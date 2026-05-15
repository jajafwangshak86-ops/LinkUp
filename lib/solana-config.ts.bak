// Solana & Price Feed Configuration
export const solanaConfig = {
  helius: {
    apiKey: process.env.EXPO_PUBLIC_HELIUS_API_KEY || "",
    rpcUrl: process.env.EXPO_PUBLIC_HELIUS_API_KEY 
      ? `https://mainnet.helius-rpc.com/?api-key=${process.env.EXPO_PUBLIC_HELIUS_API_KEY}`
      : "https://api.mainnet-beta.solana.com",
  },
  jupiter: {
    baseUrl: "https://quote-api.jup.ag/v6",
    priceUrl: "https://api.jup.ag/price/v2", // Updated to v2 API
    tokenListUrl: "https://token.jup.ag/all",
  },
  dexscreener: {
    baseUrl: "https://api.dexscreener.com/latest/dex",
  },
  solana: {
    cluster: "mainnet-beta" as const,
    commitment: "confirmed" as const,
  },
} as const;
