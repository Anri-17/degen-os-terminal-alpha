
import { useState } from 'react';
import { Zap, ArrowUpDown, Settings, Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react';

export const SwapInterface = () => {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [tradeMode, setTradeMode] = useState<'fixed' | 'percentage'>('fixed');
  const [buyPresets, setBuyPresets] = useState([0.01, 0.1, 0.5, 1]);
  const [sellPresets, setSellPresets] = useState([25, 50, 75, 100]);
  const [customizing, setCustomizing] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTrade, setLastTrade] = useState<{ type: string; amount: string; token: string } | null>(null);

  const walletBalance = 2.47; // SOL balance
  const tokenHoldings = 1250000; // Example token holdings

  const handleQuickBuy = async (amount: number) => {
    if (!toToken) return;
    
    setIsExecuting(true);
    console.log(`Executing quick buy: ${amount} SOL for ${toToken}`);
    
    // Simulate trade execution
    setTimeout(() => {
      setLastTrade({ type: 'buy', amount: `${amount} SOL`, token: toToken });
      setIsExecuting(false);
    }, 2000);
  };

  const handleQuickSell = async (percentage: number) => {
    if (!toToken) return;
    
    setIsExecuting(true);
    const sellAmount = tradeMode === 'percentage' 
      ? (tokenHoldings * percentage / 100).toLocaleString()
      : `${percentage}`;
    
    console.log(`Executing quick sell: ${percentage}% of ${toToken}`);
    
    // Simulate trade execution
    setTimeout(() => {
      setLastTrade({ type: 'sell', amount: `${sellAmount} ${toToken}`, token: 'SOL' });
      setIsExecuting(false);
    }, 2000);
  };

  const handleSwap = () => {
    console.log('Executing custom swap via Jupiter...');
    setIsExecuting(true);
    setTimeout(() => {
      setLastTrade({ type: 'swap', amount: `${fromAmount} ${fromToken}`, token: toToken });
      setIsExecuting(false);
    }, 2000);
  };

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const updatePreset = (index: number, newValue: string, isBuy: boolean) => {
    const value = parseFloat(newValue) || 0;
    if (isBuy) {
      const newPresets = [...buyPresets];
      newPresets[index] = value;
      setBuyPresets(newPresets);
    } else {
      const newPresets = [...sellPresets];
      newPresets[index] = value;
      setSellPresets(newPresets);
    }
    setCustomizing(null);
    setTempValue('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap size={24} className="text-purple-400" />
          <h2 className="text-2xl font-bold">Jupiter Swap</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2">
            <button
              onClick={() => setTradeMode('fixed')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                tradeMode === 'fixed'
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Fixed
            </button>
            <button
              onClick={() => setTradeMode('percentage')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                tradeMode === 'percentage'
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Percentage
            </button>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Trade Execution Feedback */}
      {isExecuting && (
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
            <span className="text-purple-400 font-medium">Executing trade via Jupiter...</span>
          </div>
        </div>
      )}

      {/* Last Trade Feedback */}
      {lastTrade && !isExecuting && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">
              {lastTrade.type === 'buy' ? 'Buy' : lastTrade.type === 'sell' ? 'Sell' : 'Swap'} executed: {lastTrade.amount} → {lastTrade.token}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Trading Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Slippage Tolerance (%)</label>
                <div className="flex space-x-2">
                  {[0.5, 1, 2, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                        slippage === value
                          ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-purple-700'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-gray-300">MEV Protection (Jito)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-gray-300">Platform Fee (0.25%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-gray-300">Priority Gas Fee</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Buy Buttons */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-green-400">Quick Buy</h3>
            <TrendingUp size={20} className="text-green-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {buyPresets.map((amount, index) => (
              <div key={index} className="relative">
                {customizing === index ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updatePreset(index, tempValue, true);
                        if (e.key === 'Escape') setCustomizing(null);
                      }}
                      className="w-full bg-gray-800 border border-green-700 rounded px-2 py-1 text-sm text-white"
                      placeholder={tradeMode === 'fixed' ? 'SOL' : '%'}
                      autoFocus
                    />
                    <button
                      onClick={() => updatePreset(index, tempValue, true)}
                      className="text-green-400 hover:text-green-300"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleQuickBuy(amount)}
                    onDoubleClick={() => {
                      setCustomizing(index);
                      setTempValue(amount.toString());
                    }}
                    disabled={!toToken || isExecuting}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95"
                  >
                    {tradeMode === 'fixed' ? `${amount} SOL` : `${amount}%`}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Double-click any button to customize • Requires token selection
          </div>
        </div>

        {/* Swap Interface */}
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>From</span>
              <span>Balance: {walletBalance} SOL</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-gray-800 border border-purple-700 rounded-lg px-4 py-3 text-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="bg-gray-800 border border-purple-700 rounded-lg px-4 py-3 text-white font-medium"
              >
                <option value="SOL">SOL</option>
                <option value="USDC">USDC</option>
                <option value="BONK">BONK</option>
                <option value="WIF">WIF</option>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapTokens}
              className="p-2 bg-gray-800 border border-purple-700 rounded-lg hover:bg-gray-700 transition-all"
            >
              <ArrowUpDown size={20} className="text-purple-400" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>To</span>
              <span>Balance: {toToken ? `${tokenHoldings.toLocaleString()} ${toToken}` : '0.00'}</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter token address or symbol"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="flex-1 bg-gray-800 border border-purple-700 rounded-lg px-4 py-3 text-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            {toAmount && (
              <div className="text-right text-lg font-bold text-purple-400">
                ≈ {toAmount}
              </div>
            )}
          </div>

          {/* Route Info */}
          {fromAmount && toToken && (
            <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Route</span>
                <span className="text-white">Jupiter Best Route</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price Impact</span>
                <span className="text-green-400">0.12%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platform Fee</span>
                <span className="text-orange-400">0.25%</span>
              </div>
            </div>
          )}

          {/* Custom Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!fromAmount || !toToken || isExecuting}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            {isExecuting ? 'Executing...' : !fromAmount || !toToken ? 'Enter amounts' : 'Swap'}
          </button>
        </div>

        {/* Quick Sell Buttons */}
        <div className="bg-gray-900/50 border border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-red-400">Quick Sell</h3>
            <TrendingDown size={20} className="text-red-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sellPresets.map((percentage, index) => (
              <div key={index} className="relative">
                {customizing === (index + 10) ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updatePreset(index, tempValue, false);
                        if (e.key === 'Escape') setCustomizing(null);
                      }}
                      className="w-full bg-gray-800 border border-red-700 rounded px-2 py-1 text-sm text-white"
                      placeholder={tradeMode === 'fixed' ? 'Amount' : '%'}
                      autoFocus
                    />
                    <button
                      onClick={() => updatePreset(index, tempValue, false)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleQuickSell(percentage)}
                    onDoubleClick={() => {
                      setCustomizing(index + 10);
                      setTempValue(percentage.toString());
                    }}
                    disabled={!toToken || isExecuting}
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95"
                  >
                    {tradeMode === 'percentage' ? `${percentage}%` : `${percentage}`}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Double-click any button to customize • Requires token holdings
          </div>
        </div>

        {/* Recent Swaps */}
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">Recent Swaps</h3>
          <div className="space-y-2">
            {[
              { from: 'SOL', to: 'BONK', amount: '0.5 SOL → 2.4M BONK', time: '2m ago', status: 'success', type: 'Quick Buy' },
              { from: 'USDC', to: 'WIF', amount: '100 USDC → 456 WIF', time: '15m ago', status: 'success', type: 'Custom Swap' },
              { from: 'SOL', to: 'PEPE', amount: '0.2 SOL → 89K PEPE', time: '1h ago', status: 'failed', type: 'Quick Buy' },
            ].map((swap, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                <div className="text-sm">
                  <div className="text-white">{swap.amount}</div>
                  <div className="text-gray-400">{swap.time} • {swap.type}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  swap.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {swap.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
