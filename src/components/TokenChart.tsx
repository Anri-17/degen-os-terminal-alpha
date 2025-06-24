
import { useState } from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

export const TokenChart = () => {
  const [selectedToken, setSelectedToken] = useState('PEPE');

  const tokens = [
    { symbol: 'PEPE', price: '$0.000001247', change: '+23.4%', color: 'text-green-400' },
    { symbol: 'SHIB', price: '$0.000008932', change: '-5.7%', color: 'text-red-400' },
    { symbol: 'BONK', price: '$0.000012456', change: '+187.3%', color: 'text-green-400' },
  ];

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold">Live Chart</h3>
          <select 
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
          >
            {tokens.map(token => (
              <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-sm font-medium">
            BUY
          </button>
          <button className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm font-medium">
            SELL
          </button>
        </div>
      </div>

      {/* Mock Chart */}
      <div className="h-64 bg-black/30 rounded-lg flex items-center justify-center border border-gray-700">
        <div className="text-center">
          <BarChart3 size={48} className="text-gray-600 mx-auto mb-2" />
          <div className="text-gray-400">TradingView Chart Integration</div>
          <div className="text-sm text-gray-500 mt-1">Real-time price data for {selectedToken}</div>
        </div>
      </div>

      {/* Token Info */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-lg font-bold">{tokens.find(t => t.symbol === selectedToken)?.price}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">24h Change</div>
          <div className={`text-lg font-bold ${tokens.find(t => t.symbol === selectedToken)?.color}`}>
            {tokens.find(t => t.symbol === selectedToken)?.change}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Rug Score</div>
          <div className="text-lg font-bold text-green-400">SAFE</div>
        </div>
      </div>
    </div>
  );
};
