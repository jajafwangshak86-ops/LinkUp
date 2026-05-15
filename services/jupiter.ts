import { solanaConfig } from '@/lib/solana-config';
import { JupiterQuote } from '@/types/token';

class JupiterService {
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ): Promise<JupiterQuote | null> {
    try {
      const response = await fetch(
        `${solanaConfig.jupiter.baseUrl}/quote?` +
        `inputMint=${inputMint}&` +
        `outputMint=${outputMint}&` +
        `amount=${amount}&` +
        `slippageBps=${slippageBps}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Jupiter quote error:', error);
      return null;
    }
  }

  async getSwapTransaction(
    quoteResponse: any,
    userPublicKey: string
  ): Promise<string | null> {
    try {
      const response = await fetch(`${solanaConfig.jupiter.baseUrl}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey,
          wrapAndUnwrapSol: true,
        }),
      });
      const data = await response.json();
      return data.swapTransaction;
    } catch (error) {
      console.error('Jupiter swap error:', error);
      return null;
    }
  }

  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      // Jupiter v2 API format
      const response = await fetch(
        `${solanaConfig.jupiter.priceUrl}?ids=${tokenAddress}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        console.error('Jupiter price API error:', response.status, response.statusText);
        return 0;
      }
      
      const data = await response.json();
      const priceData = data.data?.[tokenAddress];
      const price = priceData?.price || 0;
      
      console.log(`Jupiter price for ${tokenAddress}:`, price, 'Full data:', priceData);
      return price;
    } catch (error) {
      console.error('Jupiter price error:', error);
      return 0;
    }
  }
}

export const jupiterService = new JupiterService();
