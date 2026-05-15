export interface TokenConfig {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  coingeckoId?: string;
  address?: string;
}

export const TOKENS: TokenConfig[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    color: 'bg-purple-600',
    coingeckoId: 'solana',
    address: 'So11111111111111111111111111111111111111112',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    color: 'bg-green-600',
    coingeckoId: 'tether',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '$',
    color: 'bg-blue-500',
    coingeckoId: 'usd-coin',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  {
    symbol: 'SEEKER',
    name: 'Seeker',
    icon: 'SK',
    color: 'bg-blue-600',
  },
];

export const getTokenBySymbol = (symbol: string): TokenConfig | undefined => {
  return TOKENS.find((token) => token.symbol === symbol);
};

export const getTokenIcon = (symbol: string): string => {
  return getTokenBySymbol(symbol)?.icon || '?';
};

export const getTokenColor = (symbol: string): string => {
  return getTokenBySymbol(symbol)?.color || 'bg-gray-600';
};
