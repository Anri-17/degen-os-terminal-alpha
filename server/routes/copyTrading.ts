import express from 'express';
import { copyTrading } from '../index.js';

const router = express.Router();

// Get top wallets to follow
router.get('/wallets', async (req, res) => {
  try {
    const { sortBy = 'profit30d', limit = 20 } = req.query;
    
    let wallets = copyTrading.getTopWallets();
    
    // Sort wallets
    switch (sortBy) {
      case 'winRate':
        wallets.sort((a, b) => b.winRate - a.winRate);
        break;
      case 'followers':
        wallets.sort((a, b) => b.followers - a.followers);
        break;
      case 'trades30d':
        wallets.sort((a, b) => b.trades30d - a.trades30d);
        break;
      default:
        wallets.sort((a, b) => b.profit30d - a.profit30d);
    }

    // Limit results
    wallets = wallets.slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: wallets,
      sortBy,
      total: copyTrading.getTopWallets().length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Follow a wallet
router.post('/follow', async (req, res) => {
  try {
    const {
      userId,
      leaderWallet,
      copyPercentage = 10,
      maxCopyAmount = 0.1,
      stopLoss,
      takeProfit,
      onlyVerifiedTokens = true,
      skipHighTax = true,
      autoSellWithLeader = true
    } = req.body;

    if (!userId || !leaderWallet) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: userId, leaderWallet'
      });
    }

    // Validate parameters
    if (copyPercentage < 1 || copyPercentage > 100) {
      return res.status(400).json({
        success: false,
        error: 'Copy percentage must be between 1 and 100'
      });
    }

    if (maxCopyAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Max copy amount must be greater than 0'
      });
    }

    const config = {
      userId,
      leaderWallet,
      enabled: true,
      copyPercentage,
      maxCopyAmount,
      stopLoss,
      takeProfit,
      onlyVerifiedTokens,
      skipHighTax,
      autoSellWithLeader
    };

    copyTrading.followWallet(userId, config);

    res.json({
      success: true,
      message: 'Successfully following wallet',
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Unfollow a wallet
router.post('/unfollow', async (req, res) => {
  try {
    const { userId, leaderWallet } = req.body;

    if (!userId || !leaderWallet) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: userId, leaderWallet'
      });
    }

    copyTrading.unfollowWallet(userId, leaderWallet);

    res.json({
      success: true,
      message: 'Successfully unfollowed wallet'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get followed wallets for user
router.get('/following/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const followedWallets = copyTrading.getFollowedWallets(userId);

    res.json({
      success: true,
      data: followedWallets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get copy trade history
router.get('/trades/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const trades = copyTrading.getCopyTrades(userId);
    const paginatedTrades = trades.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );

    // Calculate stats
    const successfulTrades = trades.filter(t => t.status === 'success').length;
    const totalProfit = trades
      .filter(t => t.pnl)
      .reduce((sum, t) => sum + (t.pnl || 0), 0);

    res.json({
      success: true,
      data: paginatedTrades,
      total: trades.length,
      stats: {
        totalTrades: trades.length,
        successfulTrades,
        successRate: trades.length > 0 ? (successfulTrades / trades.length * 100).toFixed(1) : '0',
        totalProfit: totalProfit.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update copy trading config
router.put('/config/:userId/:leaderWallet', async (req, res) => {
  try {
    const { userId, leaderWallet } = req.params;
    const { config } = req.body;

    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: config'
      });
    }

    const updatedConfig = {
      userId,
      leaderWallet,
      enabled: true,
      ...config
    };

    copyTrading.followWallet(userId, updatedConfig);

    res.json({
      success: true,
      message: 'Copy trading config updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as copyTradingRoutes };