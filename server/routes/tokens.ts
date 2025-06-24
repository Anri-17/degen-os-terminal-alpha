import express from 'express';

const router = express.Router();

// Get fresh tokens with filters
router.get('/fresh', async (req, res) => {
  try {
    const {
      minutes = 60,
      minLiquidity = 1000,
      maxTax = 10,
      minRugScore = 70,
      lpLocked = 'true',
      mintRenounced = 'true',
      platforms = 'all'
    } = req.query;

    const filters = {
      minLiquidity: parseInt(minLiquidity as string),
      minRugScore: parseInt(minRugScore as string),
      lpLocked: lpLocked === 'true',
      mintRenounced: mintRenounced === 'true',
      platform: platforms === 'all' ? null : platforms
    };

    const tokens = global.services.database.getTokens(filters);

    // Apply additional filters
    const filtered = tokens.filter((token: any) => {
      if (Math.max(token.buy_tax, token.sell_tax) > parseInt(maxTax as string)) return false;
      return true;
    });

    res.json({
      success: true,
      data: filtered.map((token: any) => ({
        mint: token.mint,
        symbol: token.symbol,
        name: token.name,
        price: `$${token.price.toFixed(8)}`,
        change24h: `${token.change_24h > 0 ? '+' : ''}${token.change_24h.toFixed(1)}%`,
        volume24h: `$${(token.volume_24h / 1000).toFixed(1)}K`,
        liquidity: `$${(token.liquidity / 1000).toFixed(1)}K`,
        mcap: `$${(token.market_cap / 1000000).toFixed(1)}M`,
        rugScore: token.rug_score,
        lpLocked: token.lp_locked,
        mintRenounced: token.mint_renounced,
        created: token.created_at,
        platform: token.platform,
        graduationStatus: token.graduation_status,
        holders: token.holders_count,
        trades24h: token.trades_24h
      })),
      filters: {
        minutes: parseInt(minutes as string),
        minLiquidity: parseInt(minLiquidity as string),
        maxTax: parseInt(maxTax as string),
        minRugScore: parseInt(minRugScore as string),
        lpLocked: lpLocked === 'true',
        mintRenounced: mintRenounced === 'true'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get token details
router.get('/:mint', async (req, res) => {
  try {
    const { mint } = req.params;
    
    const token = global.services.database.getToken(mint);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    // Get token safety analysis
    const safetyReport = await global.services.tokenSafety.analyzeToken(mint);
    
    const tokenDetails = {
      mint: token.mint,
      symbol: token.symbol,
      name: token.name,
      description: `${token.name} is a community-driven meme token on Solana.`,
      price: `$${token.price.toFixed(8)}`,
      change24h: `${token.change_24h > 0 ? '+' : ''}${token.change_24h.toFixed(1)}%`,
      volume24h: `$${(token.volume_24h / 1000).toFixed(1)}K`,
      liquidity: `$${(token.liquidity / 1000).toFixed(1)}K`,
      mcap: `$${(token.market_cap / 1000000).toFixed(1)}M`,
      totalSupply: '1,000,000,000',
      holdersCount: token.holders_count,
      liquiditySOL: `${(token.liquidity / 100).toFixed(0)} SOL`,
      createdAt: token.created_at,
      creator: '8xKv...9mNp',
      platform: token.platform,
      graduationStatus: token.graduation_status,
      website: 'https://example.com',
      twitter: 'https://twitter.com/example',
      telegram: 'https://t.me/example',
      safety: safetyReport
    };

    res.json({
      success: true,
      data: tokenDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get token safety analysis
router.get('/:mint/safety', async (req, res) => {
  try {
    const { mint } = req.params;
    const safetyReport = await global.services.tokenSafety.analyzeToken(mint);
    
    res.json({
      success: true,
      data: safetyReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get token price history for charts
router.get('/:mint/chart', async (req, res) => {
  try {
    const { mint } = req.params;
    const { timeframe = '24h' } = req.query;
    
    const priceHistory = global.services.priceService.getPriceHistory(mint, timeframe as string);
    
    res.json({
      success: true,
      data: {
        timeframe,
        dataPoints: priceHistory.map(point => ({
          timestamp: point.timestamp,
          price: point.price,
          volume: point.volume,
          time: new Date(point.timestamp).toLocaleTimeString()
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search tokens
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const allTokens = global.services.database.getTokens();
    const searchResults = allTokens.filter((token: any) => 
      token.symbol.toLowerCase().includes(query.toLowerCase()) ||
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.mint.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20);

    res.json({
      success: true,
      data: searchResults.map((token: any) => ({
        mint: token.mint,
        symbol: token.symbol,
        name: token.name,
        price: `$${token.price.toFixed(8)}`,
        change24h: `${token.change_24h > 0 ? '+' : ''}${token.change_24h.toFixed(1)}%`,
        mcap: `$${(token.market_cap / 1000000).toFixed(1)}M`,
        rugScore: token.rug_score
      })),
      query
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as tokenRoutes };