import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { Connection, PublicKey } from '@solana/web3.js';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

import { tokenRoutes } from './routes/tokens.js';
import { swapRoutes } from './routes/swaps.js';
import { sniperRoutes } from './routes/sniper.js';
import { copyTradingRoutes } from './routes/copyTrading.js';
import { portfolioRoutes } from './routes/portfolio.js';
import { alertRoutes } from './routes/alerts.js';
import { SolanaEventListener } from './services/SolanaEventListener.js';
import { TokenSafetyService } from './services/TokenSafetyService.js';
import { SniperBotService } from './services/SniperBotService.js';
import { CopyTradingService } from './services/CopyTradingService.js';
import { NotificationService } from './services/NotificationService.js';
import { WebSocketManager } from './services/WebSocketManager.js';
import { PriceService } from './services/PriceService.js';
import { DatabaseService } from './services/DatabaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const dbPath = path.join(__dirname, '../data/trading.db');
const db = new Database(dbPath);
const database = new DatabaseService(db);

// Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

// Initialize services
const eventListener = new SolanaEventListener(connection, database);
const tokenSafety = new TokenSafetyService(connection, database);
const sniperBot = new SniperBotService(connection, database);
const copyTrading = new CopyTradingService(connection, database);
const notifications = new NotificationService(database);
const wsManager = new WebSocketManager(wss);
const priceService = new PriceService(database, wsManager);

// Make services available globally
global.services = {
  connection,
  database,
  eventListener,
  tokenSafety,
  sniperBot,
  copyTrading,
  notifications,
  wsManager,
  priceService
};

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api/sniper', sniperRoutes);
app.use('/api/copy-trading', copyTradingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      database: database.isHealthy(),
      solana: true,
      websocket: wsManager.getConnectedClients() > 0
    }
  });
});

// Real-time price updates
setInterval(() => {
  priceService.updateAllPrices();
}, 5000); // Update every 5 seconds

// Start services
async function startServices() {
  try {
    console.log('Initializing database...');
    await database.initialize();
    
    console.log('Starting Solana event listener...');
    await eventListener.start();
    
    console.log('Starting sniper bot service...');
    await sniperBot.start();
    
    console.log('Starting copy trading service...');
    await copyTrading.start();
    
    console.log('Starting price service...');
    await priceService.start();
    
    console.log('All services started successfully');
  } catch (error) {
    console.error('Error starting services:', error);
  }
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Solana Trading Platform Server running on port ${PORT}`);
  console.log(`📊 Real-time WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
  startServices();
});

export { connection, database, tokenSafety, sniperBot, copyTrading, notifications, wsManager, priceService };