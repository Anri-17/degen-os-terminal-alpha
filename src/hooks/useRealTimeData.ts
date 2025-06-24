import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface RealTimePrice {
  mint: string;
  price: number;
  change24h: number;
  timestamp: number;
}

interface RealTimeToken {
  mint: string;
  symbol: string;
  name: string;
  platform: string;
  timestamp: number;
}

export const useRealTimeData = () => {
  const [prices, setPrices] = useState<Map<string, RealTimePrice>>(new Map());
  const [freshTokens, setFreshTokens] = useState<RealTimeToken[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  const { isConnected, lastMessage, subscribe } = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    if (isConnected) {
      // Subscribe to real-time channels
      subscribe('price-updates');
      subscribe('fresh-tokens');
      subscribe('rugger-alerts');
    }
  }, [isConnected, subscribe]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'data') {
      const { channel, ...data } = lastMessage.data;

      switch (channel) {
        case 'price-updates':
          setPrices(prev => {
            const newPrices = new Map(prev);
            newPrices.set(data.mint, {
              mint: data.mint,
              price: data.price,
              change24h: data.change24h,
              timestamp: Date.now()
            });
            return newPrices;
          });
          break;

        case 'fresh-tokens':
          setFreshTokens(prev => {
            const newToken = {
              mint: data.mint,
              symbol: data.symbol,
              name: data.name,
              platform: data.platform,
              timestamp: Date.now()
            };
            return [newToken, ...prev.slice(0, 49)]; // Keep last 50
          });
          break;

        case 'rugger-alerts':
          setAlerts(prev => [data, ...prev.slice(0, 19)]); // Keep last 20
          break;
      }
    }
  }, [lastMessage]);

  const getPrice = (mint: string): RealTimePrice | null => {
    return prices.get(mint) || null;
  };

  const getRecentTokens = (minutes: number = 60): RealTimeToken[] => {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return freshTokens.filter(token => token.timestamp > cutoff);
  };

  return {
    isConnected,
    prices: Array.from(prices.values()),
    freshTokens,
    alerts,
    getPrice,
    getRecentTokens
  };
};