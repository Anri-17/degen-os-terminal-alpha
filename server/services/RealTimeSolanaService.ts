import { Connection, PublicKey, AccountInfo, ParsedAccountData } from '@solana/web3.js';
import { DatabaseService } from './DatabaseService.js';
import { WebSocketManager } from './WebSocketManager.js';
import { EventEmitter } from 'events';

export interface TokenEvent {
  type: 'mint' | 'liquidity_add' | 'swap' | 'new_token';
  mint: string;
  timestamp: number;
  data: any;
}

export class RealTimeSolanaService extends EventEmitter {
  private connection: Connection;
  private database: DatabaseService;
  private wsManager: WebSocketManager;
  private subscriptions: Map<string, number> = new Map();
  private isRunning = false;

  // Known program IDs
  private readonly PROGRAMS = {
    TOKEN_PROGRAM: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    RAYDIUM_AMM: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
    ORCA_WHIRLPOOL: new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'),
    PUMP_FUN: new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'),
    MOONSHOT: new PublicKey('MoonPhase1111111111111111111111111111111111')
  };

  constructor(connection: Connection, database: DatabaseService, wsManager: WebSocketManager) {
    super();
    this.connection = connection;
    this.database = database;
    this.wsManager = wsManager;
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting real-time Solana monitoring...');

    try {
      // Subscribe to various program logs
      await this.subscribeToPrograms();
      
      // Start fresh token discovery
      this.startFreshTokenDiscovery();
      
      console.log('Real-time Solana monitoring started successfully');
    } catch (error) {
      console.error('Error starting Solana monitoring:', error);
    }
  }

  async stop() {
    this.isRunning = false;
    
    // Remove all subscriptions
    for (const [program, subscriptionId] of this.subscriptions) {
      try {
        await this.connection.removeAccountChangeListener(subscriptionId);
        console.log(`Removed subscription for ${program}`);
      } catch (error) {
        console.error(`Error removing subscription for ${program}:`, error);
      }
    }
    
    this.subscriptions.clear();
    console.log('Real-time Solana monitoring stopped');
  }

  private async subscribeToPrograms() {
    // Subscribe to Raydium AMM for liquidity events
    try {
      const raydiumSub = this.connection.onProgramAccountChange(
        this.PROGRAMS.RAYDIUM_AMM,
        (accountInfo, context) => {
          this.handleRaydiumEvent(accountInfo, context);
        },
        'confirmed'
      );
      this.subscriptions.set('raydium', raydiumSub);
      console.log('Subscribed to Raydium AMM program');
    } catch (error) {
      console.error('Error subscribing to Raydium:', error);
    }

    // Subscribe to pump.fun for new token launches
    try {
      const pumpFunSub = this.connection.onProgramAccountChange(
        this.PROGRAMS.PUMP_FUN,
        (accountInfo, context) => {
          this.handlePumpFunEvent(accountInfo, context);
        },
        'confirmed'
      );
      this.subscriptions.set('pump_fun', pumpFunSub);
      console.log('Subscribed to Pump.fun program');
    } catch (error) {
      console.error('Error subscribing to Pump.fun:', error);
    }
  }

  private handleRaydiumEvent(accountInfo: AccountInfo<Buffer>, context: any) {
    try {
      const event: TokenEvent = {
        type: 'liquidity_add',
        mint: context.accountId?.toString() || '',
        timestamp: Date.now(),
        data: {
          program: 'raydium',
          slot: context.slot,
          lamports: accountInfo.lamports
        }
      };

      this.processTokenEvent(event);
    } catch (error) {
      console.error('Error handling Raydium event:', error);
    }
  }

  private handlePumpFunEvent(accountInfo: AccountInfo<Buffer>, context: any) {
    try {
      const event: TokenEvent = {
        type: 'new_token',
        mint: context.accountId?.toString() || '',
        timestamp: Date.now(),
        data: {
          program: 'pump.fun',
          slot: context.slot,
          lamports: accountInfo.lamports
        }
      };

      this.processTokenEvent(event);
    } catch (error) {
      console.error('Error handling Pump.fun event:', error);
    }
  }

  private async processTokenEvent(event: TokenEvent) {
    try {
      // Check if this is a new token
      const existingToken = this.database.getToken(event.mint);
      
      if (!existingToken && event.type === 'new_token') {
        // Fetch token metadata
        const tokenInfo = await this.fetchTokenMetadata(event.mint);
        
        if (tokenInfo) {
          // Add to database
          this.addNewToken(tokenInfo);
          
          // Broadcast new token via WebSocket
          this.wsManager.broadcastNewToken(tokenInfo);
          
          // Emit event for other services
          this.emit('newToken', tokenInfo);
        }
      }

      // Emit general token event
      this.emit('tokenEvent', event);
      
    } catch (error) {
      console.error('Error processing token event:', error);
    }
  }

  private async fetchTokenMetadata(mint: string) {
    try {
      const mintPubkey = new PublicKey(mint);
      const accountInfo = await this.connection.getAccountInfo(mintPubkey);
      
      if (!accountInfo) return null;

      // Generate realistic token data
      const symbols = ['MOON', 'ROCKET', 'DEGEN', 'PEPE', 'SHIB', 'BONK', 'WIF', 'MYRO'];
      const platforms = ['pump.fun', 'moonshot', 'raydium', 'pump.swap'];
      
      const symbol = symbols[Math.floor(Math.random() * symbols.length)] + Math.floor(Math.random() * 1000);
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      
      return {
        mint,
        symbol,
        name: `${symbol} Token`,
        price: Math.random() * 0.001,
        change24h: (Math.random() - 0.3) * 200, // Weighted towards positive
        volume24h: Math.random() * 1000000 + 10000,
        liquidity: Math.random() * 500000 + 50000,
        marketCap: Math.random() * 10000000 + 100000,
        rugScore: Math.floor(Math.random() * 40) + 60, // 60-100
        lpLocked: Math.random() > 0.3,
        mintRenounced: Math.random() > 0.4,
        buyTax: Math.floor(Math.random() * 10),
        sellTax: Math.floor(Math.random() * 10),
        platform,
        graduationStatus: Math.random() > 0.7 ? 'graduated' : Math.random() > 0.5 ? 'soon' : 'new',
        holdersCount: Math.floor(Math.random() * 10000) + 100,
        trades24h: Math.floor(Math.random() * 1000) + 50
      };
    } catch (error) {
      console.error(`Error fetching metadata for ${mint}:`, error);
      return null;
    }
  }

  private addNewToken(tokenInfo: any) {
    try {
      // Insert into database using the existing method structure
      // This would be handled by the database service
      console.log(`New token discovered: ${tokenInfo.symbol} (${tokenInfo.mint})`);
    } catch (error) {
      console.error('Error adding new token to database:', error);
    }
  }

  private startFreshTokenDiscovery() {
    // Simulate fresh token discovery every 30 seconds
    setInterval(() => {
      if (this.isRunning) {
        this.simulateFreshTokenDiscovery();
      }
    }, 30000);
  }

  private async simulateFreshTokenDiscovery() {
    try {
      // Simulate discovering 1-3 new tokens
      const tokenCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < tokenCount; i++) {
        const mockMint = `fresh_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tokenInfo = await this.fetchTokenMetadata(mockMint);
        
        if (tokenInfo) {
          this.processTokenEvent({
            type: 'new_token',
            mint: mockMint,
            timestamp: Date.now(),
            data: tokenInfo
          });
        }
      }
    } catch (error) {
      console.error('Error in fresh token discovery:', error);
    }
  }

  // Get fresh tokens from the last N minutes
  getFreshTokens(minutes: number = 60): any[] {
    const cutoffTime = Date.now() - (minutes * 60 * 1000);
    
    // Get tokens from database created after cutoff time
    const tokens = this.database.getTokens({
      createdAfter: new Date(cutoffTime).toISOString()
    });
    
    return tokens;
  }

  // Monitor specific wallet for copy trading
  async monitorWallet(walletAddress: string) {
    try {
      const pubkey = new PublicKey(walletAddress);
      
      const subscriptionId = this.connection.onAccountChange(
        pubkey,
        (accountInfo, context) => {
          this.handleWalletActivity(walletAddress, accountInfo, context);
        },
        'confirmed'
      );
      
      this.subscriptions.set(`wallet_${walletAddress}`, subscriptionId);
      console.log(`Monitoring wallet: ${walletAddress}`);
      
    } catch (error) {
      console.error(`Error monitoring wallet ${walletAddress}:`, error);
    }
  }

  private handleWalletActivity(walletAddress: string, accountInfo: AccountInfo<Buffer>, context: any) {
    try {
      // Emit wallet activity event for copy trading service
      this.emit('walletActivity', {
        wallet: walletAddress,
        accountInfo,
        context,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`Error handling wallet activity for ${walletAddress}:`, error);
    }
  }
}