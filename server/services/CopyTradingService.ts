import { Connection, PublicKey } from '@solana/web3.js';
import { EventEmitter } from 'events';

export interface TopWallet {
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

export interface CopyTradeConfig {
  userId: string;
  leaderWallet: string;
  enabled: boolean;
  copyPercentage: number; // 1-100%
  maxCopyAmount: number; // in SOL
  stopLoss?: number; // percentage
  takeProfit?: number; // percentage
  onlyVerifiedTokens: boolean;
  skipHighTax: boolean;
  autoSellWithLeader: boolean;
}

export interface CopyTrade {
  id: string;
  followerId: string;
  leaderWallet: string;
  mint: string;
  action: 'buy' | 'sell';
  leaderAmount: number;
  copiedAmount: number;
  timestamp: number;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  pnl?: number;
}

export class CopyTradingService extends EventEmitter {
  private connection: Connection;
  private topWallets: Map<string, TopWallet> = new Map();
  private copyConfigs: Map<string, CopyTradeConfig[]> = new Map();
  private activeTrades: Map<string, CopyTrade[]> = new Map();
  private isRunning = false;

  constructor(connection: Connection) {
    super();
    this.connection = connection;
    this.loadTopWallets();
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting Copy Trading Service...');
    
    // Monitor top wallets for trades
    this.startWalletMonitoring();
    
    console.log('Copy Trading Service started');
  }

  async stop() {
    this.isRunning = false;
    console.log('Copy Trading Service stopped');
  }

  private loadTopWallets() {
    // Load top performing wallets from database or API
    const mockWallets: TopWallet[] = [
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

    mockWallets.forEach(wallet => {
      this.topWallets.set(wallet.address, wallet);
    });
  }

  private startWalletMonitoring() {
    // Monitor transactions from top wallets
    setInterval(() => {
      if (this.isRunning) {
        this.checkWalletTransactions();
      }
    }, 10000); // Check every 10 seconds
  }

  private async checkWalletTransactions() {
    for (const [address, wallet] of this.topWallets) {
      try {
        // Get recent transactions for this wallet
        const recentTxs = await this.getRecentTransactions(address);
        
        for (const tx of recentTxs) {
          await this.processPotentialCopyTrade(address, tx);
        }
      } catch (error) {
        console.error(`Error checking transactions for wallet ${address}:`, error);
      }
    }
  }

  private async getRecentTransactions(walletAddress: string): Promise<any[]> {
    try {
      const pubkey = new PublicKey(walletAddress);
      const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit: 10 });
      
      // Parse transactions to identify token swaps
      // This is a simplified version - real implementation would be more complex
      return signatures.map(sig => ({
        signature: sig.signature,
        slot: sig.slot,
        timestamp: sig.blockTime,
        // Mock trade data
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        mint: `token_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.random() * 10
      }));
    } catch (error) {
      console.error(`Error fetching transactions for ${walletAddress}:`, error);
      return [];
    }
  }

  private async processPotentialCopyTrade(leaderWallet: string, transaction: any) {
    // Find all users following this wallet
    const followers = this.getFollowers(leaderWallet);
    
    for (const config of followers) {
      if (!config.enabled) continue;
      
      try {
        await this.executeCopyTrade(config, transaction);
      } catch (error) {
        console.error(`Error executing copy trade for user ${config.userId}:`, error);
      }
    }
  }

  private async executeCopyTrade(config: CopyTradeConfig, leaderTx: any) {
    const tradeId = `${config.userId}_${leaderTx.signature}_${Date.now()}`;
    
    // Calculate copy amount based on percentage
    const copyAmount = Math.min(
      leaderTx.amount * (config.copyPercentage / 100),
      config.maxCopyAmount
    );

    const copyTrade: CopyTrade = {
      id: tradeId,
      followerId: config.userId,
      leaderWallet: config.leaderWallet,
      mint: leaderTx.mint,
      action: leaderTx.type,
      leaderAmount: leaderTx.amount,
      copiedAmount: copyAmount,
      timestamp: Date.now(),
      status: 'pending'
    };

    // Add to active trades
    if (!this.activeTrades.has(config.userId)) {
      this.activeTrades.set(config.userId, []);
    }
    this.activeTrades.get(config.userId)!.push(copyTrade);

    try {
      // Execute the copy trade
      const result = await this.executeSwap(leaderTx.mint, copyAmount, leaderTx.type);
      
      copyTrade.status = 'success';
      copyTrade.txHash = result.txHash;
      
      this.emit('copyTradeExecuted', { userId: config.userId, trade: copyTrade });
      
    } catch (error) {
      copyTrade.status = 'failed';
      this.emit('copyTradeFailed', { userId: config.userId, trade: copyTrade, error });
    }
  }

  private async executeSwap(mint: string, amount: number, direction: 'buy' | 'sell'): Promise<{ txHash: string }> {
    // This would integrate with Jupiter API for actual swaps
    return {
      txHash: `copy_trade_tx_${Date.now()}`
    };
  }

  private getFollowers(leaderWallet: string): CopyTradeConfig[] {
    const followers: CopyTradeConfig[] = [];
    
    for (const [userId, configs] of this.copyConfigs) {
      const config = configs.find(c => c.leaderWallet === leaderWallet);
      if (config) {
        followers.push(config);
      }
    }
    
    return followers;
  }

  // Public API methods
  getTopWallets(): TopWallet[] {
    return Array.from(this.topWallets.values());
  }

  followWallet(userId: string, config: CopyTradeConfig) {
    if (!this.copyConfigs.has(userId)) {
      this.copyConfigs.set(userId, []);
    }
    
    const userConfigs = this.copyConfigs.get(userId)!;
    const existingIndex = userConfigs.findIndex(c => c.leaderWallet === config.leaderWallet);
    
    if (existingIndex >= 0) {
      userConfigs[existingIndex] = config;
    } else {
      userConfigs.push(config);
    }
    
    console.log(`User ${userId} is now following wallet ${config.leaderWallet}`);
  }

  unfollowWallet(userId: string, leaderWallet: string) {
    const userConfigs = this.copyConfigs.get(userId);
    if (userConfigs) {
      const filteredConfigs = userConfigs.filter(c => c.leaderWallet !== leaderWallet);
      this.copyConfigs.set(userId, filteredConfigs);
    }
    
    console.log(`User ${userId} unfollowed wallet ${leaderWallet}`);
  }

  getFollowedWallets(userId: string): CopyTradeConfig[] {
    return this.copyConfigs.get(userId) || [];
  }

  getCopyTrades(userId: string): CopyTrade[] {
    return this.activeTrades.get(userId) || [];
  }
}