import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';

interface TopWallet {
  address: string;
  name?: string;
  winRate: number;
  profit30d: number;
  trades30d: number;
  followers: number;
  strategy: string;
  avgHoldTime: string;
  successfulRugs: number;
}

interface CopyTradeConfig {
  leaderWallet: string;
  copyPercentage: number;
  maxCopyAmount: number;
  stopLoss?: number;
  takeProfit?: number;
  onlyVerifiedTokens: boolean;
  skipHighTax: boolean;
  autoSellWithLeader: boolean;
}

interface CopyTrade {
  id: string;
  leaderWallet: string;
  token: {
    mint: string;
    symbol: string;
  };
  action: 'buy' | 'sell';
  amount: number;
  timestamp: number;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  pnl?: number;
}

export const useCopyTrading = () => {
  const [topWallets, setTopWallets] = useState<TopWallet[]>([]);
  const [followedWallets, setFollowedWallets] = useState<CopyTradeConfig[]>([]);
  const [trades, setTrades] = useState<CopyTrade[]>([]);
  const [stats, setStats] = useState({
    totalTrades: 0,
    successfulTrades: 0,
    successRate: '0',
    totalProfit: 0
  });
  const { wallet } = useWallet();

  // Load top wallets
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    const mockTopWallets: TopWallet[] = [
      {
        address: '7fUf4QzKwVGkL9xM2aP...kL9x',
        name: 'SolanaWhale.sol',
        winRate: 89,
        profit30d: 45231,
        trades30d: 247,
        followers: 1247,
        strategy: 'Early Sniper',
        avgHoldTime: '4.2h',
        successfulRugs: 17
      },
      {
        address: '9aB2cD3eF4gH5iJ6kL7...mN8o',
        name: 'MemeKing',
        winRate: 73,
        profit30d: 28456,
        trades30d: 156,
        followers: 892,
        strategy: 'Swing Trader',
        avgHoldTime: '2.1d',
        successfulRugs: 8
      },
      {
        address: '5fE4dC3bA2zY1xW9vU8...tS7r',
        name: 'SafePlayer.sol',
        winRate: 91,
        profit30d: 67890,
        trades30d: 89,
        followers: 2156,
        strategy: 'Safe Conservative',
        avgHoldTime: '1.2w',
        successfulRugs: 23
      }
    ];
    
    setTopWallets(mockTopWallets);
  }, []);

  // Follow a wallet
  const followWallet = (config: CopyTradeConfig) => {
    setFollowedWallets(prev => {
      const existing = prev.findIndex(w => w.leaderWallet === config.leaderWallet);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = config;
        return updated;
      } else {
        return [...prev, config];
      }
    });
  };

  // Unfollow a wallet
  const unfollowWallet = (leaderWallet: string) => {
    setFollowedWallets(prev => prev.filter(w => w.leaderWallet !== leaderWallet));
  };

  // Simulate copy trading activity
  useEffect(() => {
    if (!wallet.connected || followedWallets.length === 0) return;

    const interval = setInterval(() => {
      // 20% chance of a new trade from a followed wallet
      if (Math.random() < 0.2) {
        const randomWalletIndex = Math.floor(Math.random() * followedWallets.length);
        const leaderWallet = followedWallets[randomWalletIndex].leaderWallet;
        const leaderName = topWallets.find(w => w.address === leaderWallet)?.name || leaderWallet;
        
        const tokenSymbols = ['MOON', 'DEGEN', 'PEPE', 'SHIB', 'FLOKI', 'ELON'];
        const randomSymbol = tokenSymbols[Math.floor(Math.random() * tokenSymbols.length)];
        const randomMint = `mint_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const action = Math.random() < 0.7 ? 'buy' : 'sell'; // 70% buys, 30% sells
        const amount = followedWallets[randomWalletIndex].maxCopyAmount * (0.5 + Math.random() * 0.5);
        
        const newTrade: CopyTrade = {
          id: `copy_${Date.now()}`,
          leaderWallet,
          token: {
            mint: randomMint,
            symbol: randomSymbol
          },
          action,
          amount,
          timestamp: Date.now(),
          status: 'pending'
        };
        
        setTrades(prev => [newTrade, ...prev]);
        
        // Simulate transaction completion after 2 seconds
        setTimeout(() => {
          const success = Math.random() < 0.9; // 90% success rate
          const txHash = success ? `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` : undefined;
          const pnl = action === 'sell' ? amount * (Math.random() * 2 - 0.5) : undefined; // -50% to +150% PnL for sells
          
          setTrades(prev => 
            prev.map(trade => 
              trade.id === newTrade.id 
                ? { 
                    ...trade, 
                    status: success ? 'success' : 'failed',
                    txHash,
                    pnl
                  } 
                : trade
            )
          );
          
          // Update stats
          if (success) {
            setStats(prev => {
              const newTotalTrades = prev.totalTrades + 1;
              const newSuccessfulTrades = prev.successfulTrades + 1;
              const newTotalProfit = prev.totalProfit + (pnl || 0);
              
              return {
                totalTrades: newTotalTrades,
                successfulTrades: newSuccessfulTrades,
                successRate: (newSuccessfulTrades / newTotalTrades * 100).toFixed(1),
                totalProfit: newTotalProfit
              };
            });
          }
        }, 2000);
      }
    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, [wallet.connected, followedWallets, topWallets]);

  return {
    topWallets,
    followedWallets,
    trades,
    stats,
    followWallet,
    unfollowWallet
  };
};