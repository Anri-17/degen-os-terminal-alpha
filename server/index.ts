import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { Connection, PublicKey } from '@solana/web3.js';
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

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

// Initialize services
const eventListener = new SolanaEventListener(connection);
const tokenSafety = new TokenSafetyService(connection);
const sniperBot = new SniperBotService(connection);
const copyTrading = new CopyTradingService(connection);
const notifications = new NotificationService();
const wsManager = new WebSocketManager(wss);

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api/sniper', sniperRoutes);
app.use('/api/copy-trading', copyTradingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start services
async function startServices() {
  try {
    await eventListener.start();
    await sniperBot.start();
    await copyTrading.start();
    console.log('All services started successfully');
  } catch (error) {
    console.error('Error starting services:', error);
  }
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startServices();
});

export { connection, tokenSafety, sniperBot, copyTrading, notifications, wsManager };