import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { EventEmitter } from 'events';
import { TokenSafetyService } from './TokenSafetyService.js';

export interface SniperConfig {
  userId: string;
  enabled: boolean;
  maxBuyAmount: number; // in SOL
  minLiquidity: number; // in USD
  maxSlippage: number; // percentage
  minRugScore: number;
  maxTax: number; // percentage
  autoSell: boolean;
  takeProfitPercent?: number;
  stopLossPercent?: number;
}

export interface SniperLog {
  id: string;
  userId: string;
  mint: string;
  action: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
}

export class SniperBotService extends EventEmitter {
  private connection: Connection;
  private tokenSafety: TokenSafetyService;
  private activeConfigs: Map<string, SniperConfig> = new Map();
  private sniperLogs: Map<string, SniperLog[]> = new Map();
  private isRunning = false;

  constructor(connection: Connection) {
    super();
    this.connection = connection;
    this.tokenSafety = new TokenSafetyService(connection);
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting Sniper Bot Service...');
    
    // Listen for fresh token events
    this.setupTokenEventListeners();
    
    console.log('Sniper Bot Service started');
  }

  async stop() {
    this.isRunning = false;
    console.log('Sniper Bot Service stopped');
  }

  private setupTokenEventListeners() {
    // In a real implementation, this would listen to the SolanaEventListener
    // For now, simulate with periodic checks
    setInterval(() => {
      if (this.isRunning) {
        this.checkForSniperOpportunities();
      }
    }, 5000); // Check every 5 seconds
  }

  private async checkForSniperOpportunities() {
    // Get fresh tokens from the last 5 minutes
    const freshTokens = await this.getFreshTokens(5);
    
    for (const token of freshTokens) {
      await this.evaluateTokenForSnipe(token);
    }
  }

  private async evaluateTokenForSnipe(token: any) {
    for (const [userId, config] of this.activeConfigs) {
      if (!config.enabled) continue;
      
      try {
        // Analyze token safety
        const safetyReport = await this.tokenSafety.analyzeToken(token.mint);
        
        // Check if token meets sniper criteria
        if (this.meetsSnipeCriteria(safetyReport, config)) {
          await this.executeSnipe(userId, token.mint, config);
        }
      } catch (error) {
        console.error(`Error evaluating token ${token.mint} for user ${userId}:`, error);
      }
    }
  }

  private meetsSnipeCriteria(safetyReport: any, config: SniperConfig): boolean {
    return (
      safetyReport.rugScore >= config.minRugScore &&
      safetyReport.buyTax <= config.maxTax &&
      safetyReport.sellTax <= config.maxTax &&
      !safetyReport.isHoneypot &&
      safetyReport.liquidityLocked
    );
  }

  private async executeSnipe(userId: string, mint: string, config: SniperConfig) {
    const logId = `${userId}_${mint}_${Date.now()}`;
    
    const log: SniperLog = {
      id: logId,
      userId,
      mint,
      action: 'buy',
      amount: config.maxBuyAmount,
      price: 0, // Will be filled after execution
      timestamp: Date.now(),
      status: 'pending'
    };

    // Add to logs
    if (!this.sniperLogs.has(userId)) {
      this.sniperLogs.set(userId, []);
    }
    this.sniperLogs.get(userId)!.push(log);

    try {
      // Execute the snipe via Jupiter API
      const result = await this.executeSwap(mint, config.maxBuyAmount, 'buy');
      
      log.status = 'success';
      log.txHash = result.txHash;
      log.price = result.price;
      
      this.emit('snipeExecuted', { userId, log });
      
      // Set up auto-sell if enabled
      if (config.autoSell && config.takeProfitPercent) {
        this.setupAutoSell(userId, mint, config);
      }
      
    } catch (error) {
      log.status = 'failed';
      log.error = error.message;
      
      this.emit('snipeFailed', { userId, log, error });
    }
  }

  private async executeSwap(mint: string, amount: number, direction: 'buy' | 'sell'): Promise<{ txHash: string; price: number }> {
    // This would integrate with Jupiter API for actual swaps
    // For now, return mock data
    return {
      txHash: `mock_tx_${Date.now()}`,
      price: Math.random() * 0.001
    };
  }

  private setupAutoSell(userId: string, mint: string, config: SniperConfig) {
    // Set up price monitoring for auto-sell
    // This would be handled by a separate price monitoring service
    console.log(`Setting up auto-sell for ${mint} with ${config.takeProfitPercent}% profit target`);
  }

  private async getFreshTokens(minutes: number): Promise<any[]> {
    // Mock fresh tokens - in real implementation, this would query the database
    return [
      {
        mint: `fresh_token_${Date.now()}`,
        timestamp: Date.now(),
        liquidity: 50000
      }
    ];
  }

  // Public API methods
  setSniperConfig(userId: string, config: SniperConfig) {
    this.activeConfigs.set(userId, config);
    console.log(`Sniper config updated for user ${userId}`);
  }

  getSniperConfig(userId: string): SniperConfig | undefined {
    return this.activeConfigs.get(userId);
  }

  enableSniper(userId: string) {
    const config = this.activeConfigs.get(userId);
    if (config) {
      config.enabled = true;
      this.activeConfigs.set(userId, config);
    }
  }

  disableSniper(userId: string) {
    const config = this.activeConfigs.get(userId);
    if (config) {
      config.enabled = false;
      this.activeConfigs.set(userId, config);
    }
  }

  getSniperLogs(userId: string): SniperLog[] {
    return this.sniperLogs.get(userId) || [];
  }
}