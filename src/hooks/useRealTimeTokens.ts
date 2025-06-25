import { useState, useEffect } from 'react';

interface Token {
  mint: string;
  symbol: string;
  name: string;
  image: string;
  age: string;
  marketCap: number;
  liquidity: number;
  volume: number;
  txns: { buys: number; sells: number };
  change: number;
  price: number;
  verified: boolean;
}

export const useRealTimeTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    // In a real implementation, this would connect to a WebSocket
    setIsConnected(true);
    
    // Generate mock tokens
    const mockTokens: Token[] = [
      {
        mint: 'web4-social-monies',
        symbol: 'WEB4',
        name: 'Social Monies',
        image: 'https://via.placeholder.com/40',
        age: '39s',
        marketCap: 52700,
        liquidity: 11700,
        volume: 87100,
        txns: { buys: 602, sells: 417 },
        change: 30.9,
        price: 0.000012456,
        verified: true
      },
      {
        mint: 'mochiyo-token',
        symbol: 'MOCHIYO',
        name: 'Mochiyo',
        image: 'https://via.placeholder.com/40',
        age: '5m',
        marketCap: 28400,
        liquidity: 11600,
        volume: 47400,
        txns: { buys: 324, sells: 227 },
        change: 326.2,
        price: 0.000008932,
        verified: true
      },
      {
        mint: 'web4-social-monies-2',
        symbol: 'WEB4',
        name: 'Social Monies',
        image: 'https://via.placeholder.com/40',
        age: '9d',
        marketCap: 133000,
        liquidity: 19600,
        volume: 55600,
        txns: { buys: 278, sells: 303 },
        change: -28.8,
        price: 0.000001247,
        verified: true
      },
      {
        mint: 'a858-stonehenge',
        symbol: 'r/A858',
        name: 'The Stonehenge',
        image: 'https://via.placeholder.com/40',
        age: '4m',
        marketCap: 10100,
        liquidity: 6880,
        volume: 32400,
        txns: { buys: 198, sells: 135 },
        change: 96.37,
        price: 0.000000234,
        verified: false
      },
      {
        mint: 'bunny-moonbunny',
        symbol: 'bunny',
        name: 'Moonbunny',
        image: 'https://via.placeholder.com/40',
        age: '3m',
        marketCap: 80200,
        liquidity: 14400,
        volume: 47600,
        txns: { buys: 409, sells: 308 },
        change: 58.4,
        price: 0.000032468,
        verified: true
      },
      {
        mint: 'childcoin-token',
        symbol: 'childcoin',
        name: '1 coin = 1 child',
        image: 'https://via.placeholder.com/40',
        age: '1h',
        marketCap: 17400,
        liquidity: 22400,
        volume: 33500,
        txns: { buys: 350, sells: 180 },
        change: -19.8,
        price: 0.000001042,
        verified: true
      },
      {
        mint: 'egg-token',
        symbol: 'EGG',
        name: 'egg',
        image: 'https://via.placeholder.com/40',
        age: '2h',
        marketCap: 27800,
        liquidity: 26900,
        volume: 19500,
        txns: { buys: 88, sells: 76 },
        change: -25.3,
        price: 0.000006140,
        verified: false
      }
    ];

    setTokens(mockTokens);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTokens(prevTokens => 
        prevTokens.map(token => ({
          ...token,
          price: token.price * (1 + (Math.random() * 0.02 - 0.01)), // -1% to +1% change
          volume: token.volume * (1 + (Math.random() * 0.05)), // 0% to +5% change
          txns: {
            buys: token.txns.buys + Math.floor(Math.random() * 3),
            sells: token.txns.sells + Math.floor(Math.random() * 2)
          },
          change: token.change * (1 + (Math.random() * 0.04 - 0.02)) // -2% to +2% relative change
        }))
      );
      setLastUpdate(Date.now());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    tokens,
    isConnected,
    lastUpdate
  };
};