import express from 'express';

const router = express.Router();

// Execute instant buy
router.post('/buy', async (req, res) => {
  try {
    const { mint, amount, slippage = 1, userWallet } = req.body;

    if (!mint || !amount || !userWallet) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: mint, amount, userWallet'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Execute swap via price service
    const result = await global.services.priceService.executeSwap(
      'SOL', // Input mint (SOL)
      mint,  // Output mint (token)
      amount,
      userWallet
    );

    // Add transaction to database
    const transactionId = `buy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    global.services.database.addTransaction({
      id: transactionId,
      userId: userWallet, // In real app, map wallet to user ID
      mint,
      action: 'buy',
      amount: result.outputAmount,
      price: result.inputAmount / result.outputAmount,
      value: result.inputAmount,
      txHash: result.txHash,
      status: 'success'
    });

    // Update portfolio holdings
    const currentHoldings = global.services.database.getPortfolioHoldings(userWallet);
    const existingHolding = currentHoldings.find((h: any) => h.mint === mint);
    
    if (existingHolding) {
      const newAmount = existingHolding.amount + result.outputAmount;
      const newTotalInvested = existingHolding.total_invested + result.inputAmount;
      const newAvgPrice = newTotalInvested / newAmount;
      
      global.services.database.updatePortfolioHolding(
        userWallet, mint, newAmount, newAvgPrice, newTotalInvested
      );
    } else {
      global.services.database.updatePortfolioHolding(
        userWallet, mint, result.outputAmount, 
        result.inputAmount / result.outputAmount, result.inputAmount
      );
    }

    // Send notification
    await global.services.notifications.sendAlert({
      userId: userWallet,
      type: 'swap',
      title: 'Buy Order Executed',
      message: `Successfully bought ${result.outputAmount.toLocaleString()} tokens for ${result.inputAmount} SOL`
    });

    res.json({
      success: true,
      data: {
        ...result,
        transactionId,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute instant sell
router.post('/sell', async (req, res) => {
  try {
    const { mint, amount, percentage, slippage = 1, userWallet } = req.body;

    if (!mint || (!amount && !percentage) || !userWallet) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: mint, (amount or percentage), userWallet'
      });
    }

    // Get user's current holdings
    const holdings = global.services.database.getPortfolioHoldings(userWallet);
    const holding = holdings.find((h: any) => h.mint === mint);
    
    if (!holding) {
      return res.status(400).json({
        success: false,
        error: 'No holdings found for this token'
      });
    }

    // Calculate sell amount
    let sellAmount = amount;
    if (percentage) {
      sellAmount = holding.amount * (percentage / 100);
    }

    if (sellAmount <= 0 || sellAmount > holding.amount) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sell amount'
      });
    }

    // Execute swap via price service
    const result = await global.services.priceService.executeSwap(
      mint, // Input mint (token)
      'SOL', // Output mint (SOL)
      sellAmount,
      userWallet
    );

    // Add transaction to database
    const transactionId = `sell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    global.services.database.addTransaction({
      id: transactionId,
      userId: userWallet,
      mint,
      action: 'sell',
      amount: sellAmount,
      price: result.outputAmount / sellAmount,
      value: result.outputAmount,
      txHash: result.txHash,
      status: 'success'
    });

    // Update portfolio holdings
    const newAmount = holding.amount - sellAmount;
    if (newAmount > 0) {
      global.services.database.updatePortfolioHolding(
        userWallet, mint, newAmount, holding.avg_buy_price, 
        holding.total_invested * (newAmount / holding.amount)
      );
    } else {
      // Remove holding if fully sold
      // This would require a delete method in the database service
    }

    // Calculate P&L
    const avgBuyPrice = holding.avg_buy_price;
    const sellPrice = result.outputAmount / sellAmount;
    const pnl = (sellPrice - avgBuyPrice) * sellAmount;
    const pnlPercent = ((sellPrice - avgBuyPrice) / avgBuyPrice) * 100;

    // Send notification
    await global.services.notifications.sendAlert({
      userId: userWallet,
      type: 'swap',
      title: 'Sell Order Executed',
      message: `Successfully sold ${sellAmount.toLocaleString()} tokens for ${result.outputAmount} SOL. P&L: ${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent.toFixed(1)}%)`
    });

    res.json({
      success: true,
      data: {
        ...result,
        transactionId,
        pnl,
        pnlPercent,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get swap quote
router.post('/quote', async (req, res) => {
  try {
    const { inputMint, outputMint, amount, slippage = 1 } = req.body;

    if (!inputMint || !outputMint || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: inputMint, outputMint, amount'
      });
    }

    const quote = await global.services.priceService.getJupiterQuote(
      inputMint, outputMint, amount
    );

    res.json({
      success: true,
      data: {
        ...quote,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get swap history for user
router.get('/history/:userWallet', async (req, res) => {
  try {
    const { userWallet } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = global.services.database.getTransactions(
      userWallet, 
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: transactions.map((tx: any) => ({
        id: tx.id,
        txHash: tx.tx_hash,
        type: tx.action,
        symbol: tx.symbol,
        inputMint: tx.action === 'buy' ? 'SOL' : tx.mint,
        outputMint: tx.action === 'buy' ? tx.mint : 'SOL',
        inputAmount: tx.action === 'buy' ? tx.value : tx.amount,
        outputAmount: tx.action === 'buy' ? tx.amount : tx.value,
        timestamp: new Date(tx.timestamp).getTime(),
        status: tx.status
      })),
      total: transactions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as swapRoutes };