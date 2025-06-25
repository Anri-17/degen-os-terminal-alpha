import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';

interface SniperConfig {
  enabled: boolean;
  maxBuyAmount: number;
  minLiquidity: number;
  maxSlippage: number;
  minRugScore: number;
  maxTax: number;
  autoSell: boolean;
  takeProfitPercent?: number;
  stopLossPercent?: number;
}

interface SniperLog {
  id: string;
  token: {
    mint: string;
    symbol: string;
  };
  amount: number;
  price: number;
  timestamp: number;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
  profit?: number;
}

export const useSniperBot = () => {
  const [config, setConfig] = useState<SniperConfig>({
    enabled: false,
    maxBuyAmount: 0.1,
    minLiquidity: 10000,
    maxSlippage: 20,
    minRugScore: 80,
    maxTax: 5,
    autoSell: false
  });
  const [logs, setLogs] = useState<SniperLog[]>([]);
  const [stats, setStats] = useState({
    totalSnipes: 0,
    successfulSnipes: 0,
    successRate: '0',
    totalProfit: 0
  });
  const { wallet } = useWallet();

  // Enable/disable sniper
  const toggleSniper = (enabled: boolean) => {
    setConfig(prev => ({ ...prev, enabled }));
    console.log(`Sniper bot ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Update sniper configuration
  const updateConfig = (newConfig: Partial<SniperConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Simulate sniper activity
  useEffect(() => {
    if (!config.enabled || !wallet.connected) return;

    const interval = setInterval(() => {
      // 10% chance of finding a new token to snipe
      if (Math.random() < 0.1) {
        const tokenSymbols = ['MOON', 'DEGEN', 'PEPE', 'SHIB', 'FLOKI', 'ELON'];
        const randomSymbol = tokenSymbols[Math.floor(Math.random() * tokenSymbols.length)];
        const randomMint = `mint_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const amount = config.maxBuyAmount * (0.5 + Math.random() * 0.5); // 50-100% of max amount
        const price = 0.000001 * (Math.random() * 10);
        
        const newLog: SniperLog = {
          id: `snipe_${Date.now()}`,
          token: {
            mint: randomMint,
            symbol: randomSymbol
          },
          amount,
          price,
          timestamp: Date.now(),
          status: 'pending'
        };
        
        setLogs(prev => [newLog, ...prev]);
        
        // Simulate transaction completion after 2 seconds
        setTimeout(() => {
          const success = Math.random() < 0.8; // 80% success rate
          const txHash = success ? `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` : undefined;
          const profit = success ? amount * price * (Math.random() * 2) : undefined;
          
          setLogs(prev => 
            prev.map(log => 
              log.id === newLog.id 
                ? { 
                    ...log, 
                    status: success ? 'success' : 'failed',
                    txHash,
                    profit,
                    error: success ? undefined : 'Slippage exceeded'
                  } 
                : log
            )
          );
          
          // Update stats
          setStats(prev => {
            const newTotalSnipes = prev.totalSnipes + 1;
            const newSuccessfulSnipes = prev.successfulSnipes + (success ? 1 : 0);
            const newTotalProfit = prev.totalProfit + (profit || 0);
            
            return {
              totalSnipes: newTotalSnipes,
              successfulSnipes: newSuccessfulSnipes,
              successRate: newTotalSnipes > 0 
                ? (newSuccessfulSnipes / newTotalSnipes * 100).toFixed(1) 
                : '0',
              totalProfit: newTotalProfit
            };
          });
        }, 2000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [config.enabled, wallet.connected, config.maxBuyAmount]);

  return {
    config,
    logs,
    stats,
    toggleSniper,
    updateConfig
  };
};