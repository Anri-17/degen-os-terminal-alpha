import express from 'express';
import { connection, tokenSafety } from '../index.js';

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

    // Mock fresh tokens data - in real implementation, query database
    const freshTokens = [
      {
        mint: 'BonkCoinMint123...abc',
        symbol: 'BONK',
        name: 'Bonk Inu',
        price: '$0.000012456',
        change24h: '+187.3%',
        volume24h: '$2.4M',
        liquidity: '$890K',
        mcap: '$45.2M',
        rugScore: 85,
        lpLocked: true,
        mintRenounced: true,
        created: new Date(Date.now() - 120000).toISOString(),
        platform: 'pump.fun',
        graduationStatus: 'graduated',
        holders: 15420,
        trades24h: 2847
      },
      {
        mint: 'PepeCoinMint456...def',
        symbol: 'PEPE',
        name: 'Pepe Solana',
        price: '$0.000001247',
        change24h: '+23.4%',
        volume24h: '$1.8M',
        liquidity: '$567K',
        mcap: '$28.9M',
        rugScore: 92,
        lpLocked: true,
        mintRenounced: true,
        created: new Date(Date.now() - 300000).toISOString(),
        platform: 'moonshot',
        graduationStatus: 'soon',
        holders: 8934,
        trades24h: 1567
      }
    ];

    // Apply filters
    const filtered = freshTokens.filter(token => {
      if (parseInt(minLiquidity as string) > 0) {
        const liquidityValue = parseInt(token.liquidity.replace(/[$K,]/g, '')) * 1000;
        if (liquidityValue < parseInt(minLiquidity as string)) return false;
      }
      
      if (token.rugScore < parseInt(minRugScore as string)) return false;
      if (lpLocked === 'true' && !token.lpLocked) return false;
      if (mintRenounced === 'true' && !token.mintRenounced) return false;
      
      return true;
    });

    res.json({
      success: true,
      data: filtered,
      filters: {
        minutes: parseInt(minutes as string),
        minLiquidity: parseInt(minLiquidity as string),
        maxTax: parseInt(maxTax as string),
        minRugScore: parseInt(minRugScore as string),
        lpLocked: lpLocked === 'true',
        mintRenounced: mintRenounced === 'true'
      }
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
    
    // Get token safety analysis
    const safetyReport = await tokenSafety.analyzeToken(mint);
    
    // Mock token details - in real implementation, query multiple sources
    const tokenDetails = {
      mint,
      symbol: 'BONK',
      name: 'Bonk Inu',
      description: 'The first dog coin on Solana with a mission to bring fun and community to the blockchain.',
      price: '$0.000012456',
      change24h: '+187.3%',
      volume24h: '$2.4M',
      liquidity: '$890K',
      mcap: '$45.2M',
      totalSupply: '92,661,783,412,818',
      holdersCount: 147892,
      liquiditySOL: '1,247 SOL',
      createdAt: '2024-01-15',
      creator: '8xKv...9mNp',
      platform: 'pump.fun',
      graduationStatus: 'graduated',
      website: 'https://bonkcoin.com',
      twitter: 'https://twitter.com/bonk_inu',
      telegram: 'https://t.me/bonkinu',
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
    const safetyReport = await tokenSafety.analyzeToken(mint);
    
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

// Search tokens
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    // Mock search results - in real implementation, search database
    const searchResults = [
      {
        mint: 'BonkCoinMint123...abc',
        symbol: 'BONK',
        name: 'Bonk Inu',
        price: '$0.000012456',
        change24h: '+187.3%',
        mcap: '$45.2M',
        rugScore: 85
      }
    ].filter(token => 
      token.symbol.toLowerCase().includes(query.toLowerCase()) ||
      token.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: searchResults,
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