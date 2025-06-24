
import { useState, useEffect } from 'react';
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const FreshTokensFeed = () => {
  const [freshTokens, setFreshTokens] = useState([]);
  const [filters, setFilters] = useState({
    lpLocked: true,
    mintRenounced: true,
    minRugScore: 70,
    maxTax: 5,
    minLiquidity: 1000,
  });

  // Mock fresh tokens data
  const mockFreshTokens = [
    {
      mint: 'NewToken123...abc',
      symbol: 'MOON',
      name: 'MoonShot Token',
      price: '$0.000000123',
      liquidity: '$45K',
      volume1h: '$12K',
      rugScore: 88,
      lpLocked: true,
      mintRenounced: true,
      buyTax: 2,
      sellTax: 3,
      createdAgo: '3m ago',
      initialLiquidity: '$45K',
      trades: 47,
      holders: 23,
    },
    {
      mint: 'FreshToken456...def',
      symbol: 'DEGEN',
      name: 'Degen Moon',
      price: '$0.000000456',
      liquidity: '$78K',
      volume1h: '$8K',
      rugScore: 92,
      lpLocked: true,
      mintRenounced: true,
      buyTax: 1,
      sellTax: 2,
      createdAgo: '7m ago',
      initialLiquidity: '$78K',
      trades: 89,
      holders: 45,
    },
    {
      mint: 'RiskyToken789...ghi',
      symbol: 'RISK',
      name: 'High Risk Token',
      price: '$0.000000789',
      liquidity: '$12K',
      volume1h: '$2K',
      rugScore: 35,
      lpLocked: false,
      mintRenounced: false,
      buyTax: 8,
      sellTax: 12,
      createdAgo: '15m ago',
      initialLiquidity: '$12K',
      trades: 12,
      holders: 8,
    }
  ];

  useEffect(() => {
    // Simulate real-time feed
    setFreshTokens(mockFreshTokens);
    const interval = setInterval(() => {
      // Add new token every 30 seconds in real implementation
      console.log('Polling for new tokens...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredTokens = freshTokens.filter(token => {
    if (filters.lpLocked && !token.lpLocked) return false;
    if (filters.mintRenounced && !token.mintRenounced) return false;
    if (token.rugScore < filters.minRugScore) return false;
    if (Math.max(token.buyTax, token.sellTax) > filters.maxTax) return false;
    if (parseInt(token.liquidity.replace(/[$K,]/g, '')) * 1000 < filters.minLiquidity) return false;
    return true;
  });

  const getSafetyColor = (token) => {
    if (token.rugScore >= 80 && token.lpLocked && token.mintRenounced) {
      return 'border-green-500/50 bg-green-500/10';
    } else if (token.rugScore >= 60) {
      return 'border-orange-500/50 bg-orange-500/10';
    }
    return 'border-red-500/50 bg-red-500/10';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp size={24} className="text-green-400" />
          <h2 className="text-2xl font-bold">Fresh Tokens Feed</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live • {filteredTokens.length} safe tokens</span>
        </div>
      </div>

      {/* Safety Filters */}
      <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Shield size={18} className="mr-2 text-green-400" />
          100% Safe Filters
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Min Rug Score</label>
            <input
              type="number"
              value={filters.minRugScore}
              onChange={(e) => setFilters({...filters, minRugScore: Number(e.target.value)})}
              className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Max Tax (%)</label>
            <input
              type="number"
              value={filters.maxTax}
              onChange={(e) => setFilters({...filters, maxTax: Number(e.target.value)})}
              className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
              min="0"
              max="50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Min Liquidity ($)</label>
            <input
              type="number"
              value={filters.minLiquidity}
              onChange={(e) => setFilters({...filters, minLiquidity: Number(e.target.value)})}
              className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
              min="0"
            />
          </div>
          <div className="flex items-end space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.lpLocked}
                onChange={(e) => setFilters({...filters, lpLocked: e.target.checked})}
                className="w-4 h-4 text-green-400 bg-gray-700 border-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-300">LP Locked</span>
            </label>
          </div>
          <div className="flex items-end space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.mintRenounced}
                onChange={(e) => setFilters({...filters, mintRenounced: e.target.checked})}
                className="w-4 h-4 text-green-400 bg-gray-700 border-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-300">Mint Renounced</span>
            </label>
          </div>
        </div>
      </div>

      {/* Fresh Tokens List */}
      <div className="space-y-4">
        {filteredTokens.map((token, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getSafetyColor(token)} hover:border-opacity-75 transition-all`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                  {token.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-white">{token.symbol}</span>
                    <div className="flex items-center space-x-1">
                      {token.lpLocked && <CheckCircle size={14} className="text-green-400" />}
                      {token.mintRenounced && <Shield size={14} className="text-blue-400" />}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{token.name}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{token.createdAgo}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">{token.holders} holders</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-sm text-gray-400">Price</div>
                  <div className="font-bold text-white">{token.price}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Liquidity</div>
                  <div className="font-bold text-green-400">{token.liquidity}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Tax (B/S)</div>
                  <div className="font-bold text-orange-400">{token.buyTax}%/{token.sellTax}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Rug Score</div>
                  <div className={`font-bold ${token.rugScore >= 80 ? 'text-green-400' : token.rugScore >= 60 ? 'text-orange-400' : 'text-red-400'}`}>
                    {token.rugScore}/100
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium hover:bg-green-500/30">
                  Snipe
                </button>
                <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/30">
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle size={48} className="text-gray-600 mx-auto mb-4" />
          <div className="text-gray-400">No tokens match your safety filters</div>
          <div className="text-sm text-gray-500 mt-2">Try adjusting your filter criteria</div>
        </div>
      )}
    </div>
  );
};
