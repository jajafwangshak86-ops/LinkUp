export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
}

export interface TokenDetail extends Token {
  supply: number;
  fdv: number;
  priceChange1h: number;
  priceChange6h: number;
  volumeChange24h: number;
  txCount24h: number;
  buyCount24h: number;
  sellCount24h: number;
}

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  logoURI?: string;
  price: number;
  value: number;
  priceChange24h: number;
}

export interface JupiterQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  routePlan: any[];
}
