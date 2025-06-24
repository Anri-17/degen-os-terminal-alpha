import Database from 'better-sqlite3';

export class DatabaseService {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  async initialize() {
    // Create tables
    this.createTables();
    console.log('Database initialized successfully');
  }

  private createTables() {
    // Tokens table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tokens (
        mint TEXT PRIMARY KEY,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL DEFAULT 0,
        change_24h REAL DEFAULT 0,
        volume_24h REAL DEFAULT 0,
        liquidity REAL DEFAULT 0,
        market_cap REAL DEFAULT 0,
        rug_score INTEGER DEFAULT 50,
        lp_locked BOOLEAN DEFAULT FALSE,
        mint_renounced BOOLEAN DEFAULT FALSE,
        buy_tax REAL DEFAULT 0,
        sell_tax REAL DEFAULT 0,
        platform TEXT DEFAULT 'unknown',
        graduation_status TEXT DEFAULT 'new',
        holders_count INTEGER DEFAULT 0,
        trades_24h INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sniper configs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sniper_configs (
        user_id TEXT PRIMARY KEY,
        enabled BOOLEAN DEFAULT FALSE,
        max_buy_amount REAL DEFAULT 0.1,
        min_liquidity REAL DEFAULT 10000,
        max_slippage REAL DEFAULT 20,
        min_rug_score INTEGER DEFAULT 80,
        max_tax REAL DEFAULT 5,
        auto_sell BOOLEAN DEFAULT FALSE,
        take_profit_percent REAL,
        stop_loss_percent REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Sniper logs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sniper_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        mint TEXT NOT NULL,
        action TEXT NOT NULL,
        amount REAL NOT NULL,
        price REAL DEFAULT 0,
        tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        error TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (mint) REFERENCES tokens (mint)
      )
    `);

    // Copy trading configs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS copy_trading_configs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        leader_wallet TEXT NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        copy_percentage REAL DEFAULT 10,
        max_copy_amount REAL DEFAULT 0.1,
        stop_loss REAL,
        take_profit REAL,
        only_verified_tokens BOOLEAN DEFAULT TRUE,
        skip_high_tax BOOLEAN DEFAULT TRUE,
        auto_sell_with_leader BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Copy trades table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS copy_trades (
        id TEXT PRIMARY KEY,
        follower_id TEXT NOT NULL,
        leader_wallet TEXT NOT NULL,
        mint TEXT NOT NULL,
        action TEXT NOT NULL,
        leader_amount REAL NOT NULL,
        copied_amount REAL NOT NULL,
        tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        pnl REAL DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (follower_id) REFERENCES users (id),
        FOREIGN KEY (mint) REFERENCES tokens (mint)
      )
    `);

    // Alerts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        data TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Portfolio holdings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS portfolio_holdings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        mint TEXT NOT NULL,
        amount REAL NOT NULL,
        avg_buy_price REAL NOT NULL,
        total_invested REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (mint) REFERENCES tokens (mint)
      )
    `);

    // Transactions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        mint TEXT NOT NULL,
        action TEXT NOT NULL,
        amount REAL NOT NULL,
        price REAL NOT NULL,
        value REAL NOT NULL,
        tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (mint) REFERENCES tokens (mint)
      )
    `);

    // Price history table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS price_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mint TEXT NOT NULL,
        price REAL NOT NULL,
        volume REAL DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mint) REFERENCES tokens (mint)
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON tokens (symbol);
      CREATE INDEX IF NOT EXISTS idx_tokens_platform ON tokens (platform);
      CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens (created_at);
      CREATE INDEX IF NOT EXISTS idx_sniper_logs_user_id ON sniper_logs (user_id);
      CREATE INDEX IF NOT EXISTS idx_sniper_logs_timestamp ON sniper_logs (timestamp);
      CREATE INDEX IF NOT EXISTS idx_copy_trades_follower_id ON copy_trades (follower_id);
      CREATE INDEX IF NOT EXISTS idx_copy_trades_timestamp ON copy_trades (timestamp);
      CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts (user_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts (timestamp);
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions (timestamp);
      CREATE INDEX IF NOT EXISTS idx_price_history_mint ON price_history (mint);
      CREATE INDEX IF NOT EXISTS idx_price_history_timestamp ON price_history (timestamp);
    `);

    // Insert sample data
    this.insertSampleData();
  }

  private insertSampleData() {
    // Insert sample tokens
    const insertToken = this.db.prepare(`
      INSERT OR REPLACE INTO tokens (
        mint, symbol, name, price, change_24h, volume_24h, liquidity, market_cap,
        rug_score, lp_locked, mint_renounced, buy_tax, sell_tax, platform,
        graduation_status, holders_count, trades_24h
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleTokens = [
      ['BonkCoinMint123abc', 'BONK', 'Bonk Inu', 0.000012456, 187.3, 2400000, 890000, 45200000, 85, true, true, 2, 3, 'pump.fun', 'graduated', 15420, 2847],
      ['PepeCoinMint456def', 'PEPE', 'Pepe Solana', 0.000001247, 23.4, 1800000, 567000, 28900000, 92, true, true, 1, 2, 'moonshot', 'soon', 8934, 1567],
      ['ShibCoinMint789ghi', 'DOGE2', 'Doge 2.0', 0.000008932, -5.7, 3200000, 1200000, 67100000, 45, false, true, 8, 12, 'raydium', 'new', 3456, 892],
      ['MoonCatMint012jkl', 'MOONCAT', 'Moon Cat', 0.000000234, 456.7, 234000, 89000, 2100000, 78, true, false, 3, 4, 'pump.swap', 'pumping', 567, 234]
    ];

    sampleTokens.forEach(token => {
      insertToken.run(...token);
    });

    // Insert sample user
    const insertUser = this.db.prepare(`
      INSERT OR REPLACE INTO users (id, wallet_address) VALUES (?, ?)
    `);
    insertUser.run('user_123', '7fUf4QzKwVGkL9xM2aP...kL9x');

    console.log('Sample data inserted successfully');
  }

  // Token operations
  getTokens(filters: any = {}) {
    let query = 'SELECT * FROM tokens WHERE 1=1';
    const params: any[] = [];

    if (filters.minLiquidity) {
      query += ' AND liquidity >= ?';
      params.push(filters.minLiquidity);
    }

    if (filters.minRugScore) {
      query += ' AND rug_score >= ?';
      params.push(filters.minRugScore);
    }

    if (filters.lpLocked) {
      query += ' AND lp_locked = ?';
      params.push(filters.lpLocked);
    }

    if (filters.mintRenounced) {
      query += ' AND mint_renounced = ?';
      params.push(filters.mintRenounced);
    }

    if (filters.platform && filters.platform !== 'all') {
      query += ' AND platform = ?';
      params.push(filters.platform);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    return this.db.prepare(query).all(...params);
  }

  getToken(mint: string) {
    return this.db.prepare('SELECT * FROM tokens WHERE mint = ?').get(mint);
  }

  updateTokenPrice(mint: string, price: number, change24h: number, volume24h: number) {
    const stmt = this.db.prepare(`
      UPDATE tokens 
      SET price = ?, change_24h = ?, volume_24h = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE mint = ?
    `);
    stmt.run(price, change24h, volume24h, mint);

    // Insert price history
    const historyStmt = this.db.prepare(`
      INSERT INTO price_history (mint, price, volume) VALUES (?, ?, ?)
    `);
    historyStmt.run(mint, price, volume24h);
  }

  // Sniper operations
  setSniperConfig(userId: string, config: any) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO sniper_configs (
        user_id, enabled, max_buy_amount, min_liquidity, max_slippage,
        min_rug_score, max_tax, auto_sell, take_profit_percent, stop_loss_percent,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    stmt.run(
      userId, config.enabled, config.maxBuyAmount, config.minLiquidity,
      config.maxSlippage, config.minRugScore, config.maxTax, config.autoSell,
      config.takeProfitPercent, config.stopLossPercent
    );
  }

  getSniperConfig(userId: string) {
    return this.db.prepare('SELECT * FROM sniper_configs WHERE user_id = ?').get(userId);
  }

  addSniperLog(log: any) {
    const stmt = this.db.prepare(`
      INSERT INTO sniper_logs (
        id, user_id, mint, action, amount, price, tx_hash, status, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      log.id, log.userId, log.mint, log.action, log.amount,
      log.price, log.txHash, log.status, log.error
    );
  }

  getSniperLogs(userId: string, limit: number = 50) {
    return this.db.prepare(`
      SELECT * FROM sniper_logs 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(userId, limit);
  }

  // Copy trading operations
  addCopyTradingConfig(config: any) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO copy_trading_configs (
        id, user_id, leader_wallet, enabled, copy_percentage, max_copy_amount,
        stop_loss, take_profit, only_verified_tokens, skip_high_tax,
        auto_sell_with_leader, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const id = `${config.userId}_${config.leaderWallet}`;
    stmt.run(
      id, config.userId, config.leaderWallet, config.enabled,
      config.copyPercentage, config.maxCopyAmount, config.stopLoss,
      config.takeProfit, config.onlyVerifiedTokens, config.skipHighTax,
      config.autoSellWithLeader
    );
  }

  getCopyTradingConfigs(userId: string) {
    return this.db.prepare(`
      SELECT * FROM copy_trading_configs WHERE user_id = ?
    `).all(userId);
  }

  addCopyTrade(trade: any) {
    const stmt = this.db.prepare(`
      INSERT INTO copy_trades (
        id, follower_id, leader_wallet, mint, action, leader_amount,
        copied_amount, tx_hash, status, pnl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      trade.id, trade.followerId, trade.leaderWallet, trade.mint,
      trade.action, trade.leaderAmount, trade.copiedAmount,
      trade.txHash, trade.status, trade.pnl
    );
  }

  getCopyTrades(userId: string, limit: number = 50) {
    return this.db.prepare(`
      SELECT * FROM copy_trades 
      WHERE follower_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(userId, limit);
  }

  // Alert operations
  addAlert(alert: any) {
    const stmt = this.db.prepare(`
      INSERT INTO alerts (id, user_id, type, title, message, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      alert.id, alert.userId, alert.type, alert.title,
      alert.message, JSON.stringify(alert.data || {})
    );
  }

  getAlerts(userId: string, limit: number = 50) {
    return this.db.prepare(`
      SELECT * FROM alerts 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(userId, limit);
  }

  markAlertAsRead(userId: string, alertId: string) {
    const stmt = this.db.prepare(`
      UPDATE alerts SET read = TRUE WHERE user_id = ? AND id = ?
    `);
    stmt.run(userId, alertId);
  }

  // Portfolio operations
  updatePortfolioHolding(userId: string, mint: string, amount: number, avgBuyPrice: number, totalInvested: number) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO portfolio_holdings (
        id, user_id, mint, amount, avg_buy_price, total_invested, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const id = `${userId}_${mint}`;
    stmt.run(id, userId, mint, amount, avgBuyPrice, totalInvested);
  }

  getPortfolioHoldings(userId: string) {
    return this.db.prepare(`
      SELECT ph.*, t.symbol, t.name, t.price, t.change_24h
      FROM portfolio_holdings ph
      JOIN tokens t ON ph.mint = t.mint
      WHERE ph.user_id = ?
    `).all(userId);
  }

  addTransaction(transaction: any) {
    const stmt = this.db.prepare(`
      INSERT INTO transactions (
        id, user_id, mint, action, amount, price, value, tx_hash, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      transaction.id, transaction.userId, transaction.mint, transaction.action,
      transaction.amount, transaction.price, transaction.value,
      transaction.txHash, transaction.status
    );
  }

  getTransactions(userId: string, limit: number = 50) {
    return this.db.prepare(`
      SELECT tr.*, t.symbol, t.name
      FROM transactions tr
      JOIN tokens t ON tr.mint = t.mint
      WHERE tr.user_id = ?
      ORDER BY tr.timestamp DESC
      LIMIT ?
    `).all(userId, limit);
  }

  isHealthy(): boolean {
    try {
      this.db.prepare('SELECT 1').get();
      return true;
    } catch {
      return false;
    }
  }
}