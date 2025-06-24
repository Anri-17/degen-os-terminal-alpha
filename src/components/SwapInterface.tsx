
import { useState } from 'react';
import { Zap, ArrowUpDown, Settings } from 'lucide-react';

export const SwapInterface = () => {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const handleSwap = () => {
    console.log('Executing swap via Jupiter...');
  };

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap size={24} className="text-purple-400" />
          <h2 className="text-2xl font-bold">Jupiter Swap</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-all"
        >
          <Settings size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Swap Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Slippage Tolerance (%)</label>
                <div className="flex space-x-2">
                  {[0.5, 1, 2, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-2 rounded text-sm font-medium ${
                        slippage === value
                          ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                          : 'bg-gray-800 border border-gray-700 text-gray-300'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                <span className="text-sm text-gray-300">MEV Protection (Jito)</span>
              </div>
            </div>
          </div>
        )}

        {/* Swap Interface */}
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>From</span>
              <span>Balance: 2.47 SOL</span>
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
              <span>Balance: 0.00</span>
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

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!fromAmount || !toToken}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {!fromAmount || !toToken ? 'Enter amounts' : 'Swap'}
          </button>
        </div>

        {/* Recent Swaps */}
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">Recent Swaps</h3>
          <div className="space-y-2">
            {[
              { from: 'SOL', to: 'BONK', amount: '0.5 SOL → 2.4M BONK', time: '2m ago', status: 'success' },
              { from: 'USDC', to: 'WIF', amount: '100 USDC → 456 WIF', time: '15m ago', status: 'success' },
              { from: 'SOL', to: 'PEPE', amount: '0.2 SOL → 89K PEPE', time: '1h ago', status: 'failed' },
            ].map((swap, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                <div className="text-sm">
                  <div className="text-white">{swap.amount}</div>
                  <div className="text-gray-400">{swap.time}</div>
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
