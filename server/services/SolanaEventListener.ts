import { Connection, PublicKey, AccountInfo, ParsedAccountData } from '@solana/web3.js';
import { EventEmitter } from 'events';

export interface TokenEvent {
  type: 'mint' | 'liquidity_add' | 'swap';
  mint: string;
  timestamp: number;
  data: any;
}

export class SolanaEventListener extends EventEmitter {
  private connection: Connection;
  private subscriptions: Map<string, number> = new Map();
  private isRunning = false;

  constructor(connection: Connection) {
    super();
    this.connection = connection;
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting Solana event listener...');

    // Subscribe to program logs for token creation
    await this.subscribeToTokenProgram();
    
    // Subscribe to Raydium and other DEX programs
    await this.subscribeToDEXPrograms();
    
    console.log('Solana event listener started');
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
    console.log('Solana event listener stopped');
  }

  private async subscribeToTokenProgram() {
    const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    
    try {
      const subscriptionId = this.connection.onAccountChange(
        TOKEN_PROGRAM_ID,
        (accountInfo: AccountInfo<Buffer>, context) => {
          this.handleTokenProgramChange(accountInfo, context);
        },
        'confirmed'
      );
      
      this.subscriptions.set('token_program', subscriptionId);
      console.log('Subscribed to Token Program');
    } catch (error) {
      console.error('Error subscribing to Token Program:', error);
    }
  }

  private async subscribeToDEXPrograms() {
    // Raydium AMM Program
    const RAYDIUM_AMM_PROGRAM = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
    
    try {
      const subscriptionId = this.connection.onAccountChange(
        RAYDIUM_AMM_PROGRAM,
        (accountInfo: AccountInfo<Buffer>, context) => {
          this.handleDEXProgramChange('raydium', accountInfo, context);
        },
        'confirmed'
      );
      
      this.subscriptions.set('raydium_amm', subscriptionId);
      console.log('Subscribed to Raydium AMM Program');
    } catch (error) {
      console.error('Error subscribing to Raydium AMM Program:', error);
    }
  }

  private handleTokenProgramChange(accountInfo: AccountInfo<Buffer>, context: any) {
    try {
      // Parse token mint creation events
      const event: TokenEvent = {
        type: 'mint',
        mint: context.accountId?.toString() || '',
        timestamp: Date.now(),
        data: {
          owner: accountInfo.owner.toString(),
          lamports: accountInfo.lamports,
          slot: context.slot
        }
      };

      this.emit('tokenEvent', event);
    } catch (error) {
      console.error('Error handling token program change:', error);
    }
  }

  private handleDEXProgramChange(dex: string, accountInfo: AccountInfo<Buffer>, context: any) {
    try {
      // Parse DEX events (liquidity adds, swaps)
      const event: TokenEvent = {
        type: 'liquidity_add',
        mint: '', // Extract from parsed data
        timestamp: Date.now(),
        data: {
          dex,
          owner: accountInfo.owner.toString(),
          lamports: accountInfo.lamports,
          slot: context.slot
        }
      };

      this.emit('tokenEvent', event);
    } catch (error) {
      console.error(`Error handling ${dex} program change:`, error);
    }
  }

  // Method to get fresh tokens from the last N minutes
  async getFreshTokens(minutes: number = 60): Promise<TokenEvent[]> {
    const cutoffTime = Date.now() - (minutes * 60 * 1000);
    
    // In a real implementation, this would query a database
    // For now, return mock data
    return [
      {
        type: 'mint',
        mint: 'BonkCoinMint123...abc',
        timestamp: Date.now() - 120000,
        data: { liquidity: 50000, verified: true }
      },
      {
        type: 'mint',
        mint: 'PepeCoinMint456...def',
        timestamp: Date.now() - 300000,
        data: { liquidity: 25000, verified: false }
      }
    ];
  }
}