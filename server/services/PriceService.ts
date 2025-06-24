import { DatabaseService } from './DatabaseService.js';
import { WebSocketManager } from './WebSocketManager.js';

export class PriceService {
  private database: DatabaseService;
  private wsManager: WebSocketManager;
  private priceCache: Map<string, any> = new Map();
  private isRunning = false;

  constructor(database: DatabaseService, wsManager: WebSocketManager) {
    this.database = database;
    this.wsManager = wsManager;
  }

  async start() {
    this.isRunning = true;
    console.log('Price service started');
    
    // Start price update loop
    this.startPriceUpdates();
  }

  async stop() {
    this.isRunning = false;
    console.log('Price service stopped');
  }

  private startPriceUpdates() {
    setInterval(() => {
      if (this.isRunning) {
        this.updateAllPrices();
      }
    }, 5000); // Update every 5 seconds
  }

  async updateAllPrices() {
    try {
      // Get all tokens from database
      const tokens = this.database.getTokens();
      
      for (const token of tokens) {
        await this.updateTokenPrice(token.mint, token.symbol);
      }
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  }

  private async updateTokenPrice(mint: string, symbol: string) {
    try {
      // Simulate price updates with realistic fluctuations
      const cachedPrice = this.priceCache.get(mint);
      const basePrice = cachedPrice?.price || this.getBasePriceForSymbol(symbol);
      
      // Generate realistic price movement (-5% to +5%)
      const priceChange = (Math.random() - 0.5) * 0.1; // -5% to +5%
      const newPrice = basePrice * (1 + priceChange);
      
      // Generate 24h change (-50% to +500% for meme coins)
      const change24h = (Math.random() - 0.3) * 200; // Weighted towards positive
      
      // Generate volume (10K to 10M)
      const volume24h = Math.random() * 10000000 + 10000;

      // Update database
      this.database.updateTokenPrice(mint, newPrice, change24h, volume24h);
      
      // Update cache
      this.priceCache.set(mint, {
        price: newPrice,
        change24h,
        volume24h,
        timestamp: Date.now()
      });

      // Broadcast price update via WebSocket
      this.wsManager.broadcastPriceUpdate(mint, newPrice, change24h);
      
    } catch (error) {
      console.error(`Error updating price for ${mint}:`, error);
    }
  }

  private getBasePriceForSymbol(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'BONK': 0.000012456,
      'PEPE': 0.000001247,
      'DOGE2': 0.000008932,
      'MOONCAT': 0.000000234,
      'WIF': 7.11,
      'MYRO': 1.580
    };
    
    return basePrices[symbol] || Math.random() * 0.001;
  }

  // Get real-time price for a token
  getPrice(mint: string) {
    return this.priceCache.get(mint);
  }

  // Get price history for charts
  getPriceHistory(mint: string, timeframe: string = '24h') {
    // In a real implementation, this would query the price_history table
    // For now, generate mock chart data
    const dataPoints = [];
    const now = Date.now();
    const intervals = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : 7;
    const intervalMs = timeframe === '1h' ? 60000 : timeframe === '24h' ? 3600000 : 86400000;
    
    const basePrice = this.getBasePriceForSymbol(mint);
    
    for (let i = intervals; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const priceVariation = (Math.random() - 0.5) * 0.2; // ±10%
      const price = basePrice * (1 + priceVariation);
      
      dataPoints.push({
        timestamp,
        price,
        volume: Math.random() * 1000000
      });
    }
    
    return dataPoints;
  }

  // Simulate Jupiter price quote
  async getJupiterQuote(inputMint: string, outputMint: string, amount: number) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const inputPrice = this.getPrice(inputMint)?.price || 1;
    const outputPrice = this.getPrice(outputMint)?.price || 0.000001;
    
    const outputAmount = (amount * inputPrice) / outputPrice;
    const priceImpact = Math.random() * 2; // 0-2% price impact
    const platformFee = amount * 0.0025; // 0.25% platform fee
    
    return {
      inputMint,
      outputMint,
      inputAmount: amount,
      outputAmount: outputAmount * (1 - priceImpact / 100),
      priceImpact,
      platformFee,
      route: [
        { dex: 'Raydium', percentage: 60 },
        { dex: 'Orca', percentage: 40 }
      ],
      estimatedGas: 0.001
    };
  }

  // Simulate swap execution
  async executeSwap(inputMint: string, outputMint: string, amount: number, userWallet: string) {
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const quote = await this.getJupiterQuote(inputMint, outputMint, amount);
    const txHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        txHash,
        inputAmount: quote.inputAmount,
        outputAmount: quote.outputAmount,
        priceImpact: quote.priceImpact,
        platformFee: quote.platformFee
      };
    } else {
      throw new Error('Transaction failed - insufficient liquidity or slippage exceeded');
    }
  }
}