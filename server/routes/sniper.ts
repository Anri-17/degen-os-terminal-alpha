import express from 'express';
import { sniperBot } from '../index.js';

const router = express.Router();

// Start sniper bot
router.post('/start', async (req, res) => {
  try {
    const { userId, config } = req.body;

    if (!userId || !config) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: userId, config'
      });
    }

    // Validate config
    const requiredFields = ['maxBuyAmount', 'minLiquidity', 'maxSlippage', 'minRugScore', 'maxTax'];
    for (const field of requiredFields) {
      if (config[field] === undefined || config[field] === null) {
        return res.status(400).json({
          success: false,
          error: `Missing required config field: ${field}`
        });
      }
    }

    // Set sniper config and enable
    const sniperConfig = {
      userId,
      enabled: true,
      ...config
    };

    sniperBot.setSniperConfig(userId, sniperConfig);
    sniperBot.enableSniper(userId);

    res.json({
      success: true,
      message: 'Sniper bot started successfully',
      config: sniperConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stop sniper bot
router.post('/stop', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: userId'
      });
    }

    sniperBot.disableSniper(userId);

    res.json({
      success: true,
      message: 'Sniper bot stopped successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get sniper config
router.get('/config/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const config = sniperBot.getSniperConfig(userId);

    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Sniper config not found for user'
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update sniper config
router.put('/config/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { config } = req.body;

    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: config'
      });
    }

    const currentConfig = sniperBot.getSniperConfig(userId);
    const updatedConfig = {
      userId,
      enabled: currentConfig?.enabled || false,
      ...config
    };

    sniperBot.setSniperConfig(userId, updatedConfig);

    res.json({
      success: true,
      message: 'Sniper config updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get sniper logs
router.get('/logs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const logs = sniperBot.getSniperLogs(userId);
    const paginatedLogs = logs.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );

    res.json({
      success: true,
      data: paginatedLogs,
      total: logs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get sniper status
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const config = sniperBot.getSniperConfig(userId);
    const logs = sniperBot.getSniperLogs(userId);

    const recentLogs = logs.slice(0, 10);
    const successfulSnipes = logs.filter(log => log.status === 'success').length;
    const totalSnipes = logs.length;

    res.json({
      success: true,
      data: {
        enabled: config?.enabled || false,
        config: config || null,
        stats: {
          totalSnipes,
          successfulSnipes,
          successRate: totalSnipes > 0 ? (successfulSnipes / totalSnipes * 100).toFixed(1) : '0'
        },
        recentLogs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as sniperRoutes };