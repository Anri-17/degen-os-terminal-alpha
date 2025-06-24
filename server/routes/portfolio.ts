import express from 'express';

const router = express.Router();

// Get portfolio overview
router.get('/:userWallet', async (req, res) => {
  try {
    const { userWallet } = req.params;

    // Mock portfolio data - in real implementation, aggregate from multiple sources
    const portfolio = {
      totalValue: 12847.52,
      totalInvested: 8450.00,
      unrealizedPnL: 4397.52,
      realizedPnL: 2134.28,
      winRate: 73.4,
      avgHoldTime: '4.2 days',
      totalTrades: 156,
      successfulTrades: 114,
      holdings: [
        {
          mint: 'BonkCoinMint123...abc',
          symbol: 'BONK',
          amount: 2400000,
          value: 4820.33,
          invested: 2500.00,
          pnl: 92.8,
          pnlAmount: 2320.33,
          avgBuyPrice: 0.000001042,
          currentPrice: 0.000002009,
          change24h: 5.2
        },
        {
          mint: 'WifCoinMint456...def',
          symbol: 'WIF',
          amount: 456,
          value: 3240.88,
          invested: 2800.00,
          pnl: 15.7,
          pnlAmount: 440.88,
          avgBuyPrice: 6.14,
          currentPrice: 7.11,
          change24h: -2.1
        },
        {
          mint: 'PepeCoinMint789...ghi',
          symbol: 'PEPE',
          amount: 89000,
          value: 2890.12,
          invested: 1200.00,
          pnl: 140.8,
          pnlAmount: 1690.12,
          avgBuyPrice: 0.000013483,
          currentPrice: 0.000032468,
          change24h: 12.3
        },
        {
          mint: 'MyroCoinMint012...jkl',
          symbol: 'MYRO',
          amount: 1200,
          value: 1896.19,
          invested: 1950.00,
          pnl: -2.8,
          pnlAmount: -53.81,
          avgBuyPrice: 1.625,
          currentPrice: 1.580,
          change24h: -1.5
        }
      ],
      recentTrades: [
        {
          id: 'trade_1',
          mint: 'BonkCoinMint123...abc',
          symbol: 'BONK',
          action: 'SELL',
          amount: '50%',
          price: 0.000002009,
          timestamp: Date.now() - 7200000,
          pnl: 1160,
          txHash: 'sell_tx_123...abc'
        },
        {
          id: 'trade_2',
          mint: 'WifCoinMint456...def',
          symbol: 'WIF',
          action: 'BUY',
          amount: '100 WIF',
          price: 7.11,
          timestamp: Date.now() - 86400000,
          pnl: 89,
          txHash: 'buy_tx_456...def'
        },
        {
          id: 'trade_3',
          mint: 'PepeCoinMint789...ghi',
          symbol: 'PEPE',
          action: 'BUY',
          amount: '25K',
          price: 0.000032468,
          timestamp: Date.now() - 259200000,
          pnl: 420,
          txHash: 'buy_tx_789...ghi'
        }
      ]
    };

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get portfolio performance chart data
router.get('/:userWallet/performance', async (req, res) => {
  try {
    const { userWallet } = req.params;
    const { timeframe = '30d' } = req.query;

    // Mock performance data
    const now = Date.now();
    const dataPoints = [];
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;

    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const baseValue = 8450;
      const growth = (days - i) / days * 4397.52;
      const noise = (Math.random() - 0.5) * 500;
      
      dataPoints.push({
        timestamp,
        value: baseValue + growth + noise,
        date: new Date(timestamp).toISOString().split('T')[0]
      });
    }

    res.json({
      success: true,
      data: {
        timeframe,
        dataPoints,
        startValue: dataPoints[0]?.value || 0,
        endValue: dataPoints[dataPoints.length - 1]?.value || 0,
        change: dataPoints.length > 1 ? 
          ((dataPoints[dataPoints.length - 1].value - dataPoints[0].value) / dataPoints[0].value * 100).toFixed(2) : '0'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get trading history
router.get('/:userWallet/trades', async (req, res) => {
  try {
    const { userWallet } = req.params;
    const { limit = 50, offset = 0, type } = req.query;

    // Mock trading history
    let trades = [
      {
        id: 'trade_1',
        mint: 'BonkCoinMint123...abc',
        symbol: 'BONK',
        action: 'SELL',
        amount: 1200000,
        price: 0.000002009,
        value: 2410.80,
        timestamp: Date.now() - 7200000,
        pnl: 1160,
        pnlPercent: 92.8,
        txHash: 'sell_tx_123...abc',
        status: 'success'
      },
      {
        id: 'trade_2',
        mint: 'WifCoinMint456...def',
        symbol: 'WIF',
        action: 'BUY',
        amount: 100,
        price: 7.11,
        value: 711.00,
        timestamp: Date.now() - 86400000,
        pnl: 89,
        pnlPercent: 15.7,
        txHash: 'buy_tx_456...def',
        status: 'success'
      },
      {
        id: 'trade_3',
        mint: 'PepeCoinMint789...ghi',
        symbol: 'PEPE',
        action: 'BUY',
        amount: 25000,
        price: 0.000032468,
        value: 811.70,
        timestamp: Date.now() - 259200000,
        pnl: 420,
        pnlPercent: 140.8,
        txHash: 'buy_tx_789...ghi',
        status: 'success'
      },
      {
        id: 'trade_4',
        mint: 'MyroCoinMint012...jkl',
        symbol: 'MYRO',
        action: 'SELL',
        amount: 300,
        price: 1.580,
        value: 474.00,
        timestamp: Date.now() - 604800000,
        pnl: -12,
        pnlPercent: -2.8,
        txHash: 'sell_tx_012...jkl',
        status: 'success'
      }
    ];

    // Filter by type if specified
    if (type && type !== 'all') {
      trades = trades.filter(trade => trade.action.toLowerCase() === type.toLowerCase());
    }

    // Paginate
    const paginatedTrades = trades.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );

    res.json({
      success: true,
      data: paginatedTrades,
      total: trades.length,
      filters: { type }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get portfolio analytics
router.get('/:userWallet/analytics', async (req, res) => {
  try {
    const { userWallet } = req.params;
    const { timeframe = '30d' } = req.query;

    // Mock analytics data
    const analytics = {
      timeframe,
      totalTrades: 156,
      winningTrades: 114,
      losingTrades: 42,
      winRate: 73.1,
      avgWin: 387.50,
      avgLoss: -125.30,
      profitFactor: 3.09,
      sharpeRatio: 1.85,
      maxDrawdown: -8.5,
      bestTrade: {
        symbol: 'PEPE',
        pnl: 1690.12,
        pnlPercent: 140.8
      },
      worstTrade: {
        symbol: 'MYRO',
        pnl: -53.81,
        pnlPercent: -2.8
      },
      topPerformers: [
        { symbol: 'PEPE', pnl: 1690.12, pnlPercent: 140.8 },
        { symbol: 'BONK', pnl: 2320.33, pnlPercent: 92.8 },
        { symbol: 'WIF', pnl: 440.88, pnlPercent: 15.7 }
      ],
      monthlyReturns: [
        { month: '2024-01', return: 12.5 },
        { month: '2024-02', return: 8.3 },
        { month: '2024-03', return: 15.7 },
        { month: '2024-04', return: -3.2 },
        { month: '2024-05', return: 22.1 }
      ]
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as portfolioRoutes };