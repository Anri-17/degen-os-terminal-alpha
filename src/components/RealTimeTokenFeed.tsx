import { useState, useEffect } from 'react';
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Clock, Zap, Target, ExternalLink } from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useApi, apiCall } from '@/hooks/useApi';

export const RealTimeTokenFeed = () => {
  const [filters, setFilters] = useState({
    lpLocked: true,
    mintRenounced: true,
    minRugScore: 70,
    maxTax: 5,
    minLiquidity: 1000,
    selectedPlatforms: ['pump.fun', 'moonshot', 'raydium', 'pump.swap'],
  });

  const { isConnected, freshTokens, getRecentTokens } = useRealTimeData();
  const { data: tokens, loading } = useApi('/tokens/fresh?' + new URLSearchParams({
    minLiquidity: filters.minLiquidity.toString(),
    minRugScore: filters.minRugScore.toString(),
    maxTax: filters.maxTax.toString(),
    lpLocked: filters.lpLocked.toString(),
    mintRenounced: filters.mintRenounced.toString()
  }));

  const [allTokens, setAllTokens] = useState<any[]>([]);

  useEffect(() => {
    if (tokens) {
      setAllTokens(tokens);
    }
  }, [tokens]);

  useEffect(() => {
    // Add real-time tokens to the list
    const recentTokens = getRecentTokens(60);
    if (recentTokens.length > 0) {
      setAllTokens(prev => {
        const newTokens = recentTokens.filter(rt => 
          !prev.some(pt => pt.mint === rt.mint)
        );
        return [...newTokens, ...prev];
      });
    }
  }, [freshTokens]);

  const filteredTokens = allTokens.filter(token => {
    if (filters.selectedPlatforms.length > 0 && !filters.selectedPlatforms.includes(token.platform)) {
      return false;
    }
    return true;
  });

  const handleQuickSnipe = async (tokenSymbol: string, mint: string) => {
    try {
      console.log(`Quick sniping ${tokenSymbol} with safety filters`);
      // This would trigger the sniper bot for this specific token
    } catch (error) {
      console.error('Error sniping token:', error);
    }
  };

  const handleQuickBuy = async (tokenSymbol: string, mint: string) => {
    try {
      await apiCall('/swap/buy', {
        method: 'POST',
        body: JSON.stringify({
          mint,
          amount: 0.1, // Default 0.1 SOL
          userWallet: '7fUf4QzKwVGkL9xM2aP...kL9x' // Get from wallet context
        })
      });
      console.log(`Successfully bought ${tokenSymbol}`);
    } catch (error) {
      console.error('Error buying token:', error);
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'pump.fun': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'moonshot': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'raydium': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'pump.swap': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graduated': return 'text-green-400';
      case 'soon': return 'text-yellow-400';
      case 'new': return 'text-blue-400';
      case 'pumping': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div className="text-gray-400">Loading real-time token feed...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp size={24} className="text-green-400" />
          <h2 className="text-2xl font-bold">Real-Time Fresh Tokens</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
            isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Live Feed' : 'Disconnected'}</span>
          </div>
          <div className="text-sm text-gray-400">
            {filteredTokens.length} tokens • Updated every second
          </div>
        </div>
      </div>

      {/* Platform Toggles */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-3">Platform Sources</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['pump.fun', 'moonshot', 'raydium', 'pump.swap'].map(platform => (
            <button
              key={platform}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  selectedPlatforms: prev.selectedPlatforms.includes(platform)
                    ? prev.selectedPlatforms.filter(p => p !== platform)
                    : [...prev.selectedPlatforms, platform]
                }));
              }}
              className={`p-3 rounded-lg border transition-all ${
                filters.selectedPlatforms.includes(platform)
                  ? getPlatformColor(platform)
                  : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
              }`}
            >
              <div className="font-bold">{platform}</div>
              <div className="text-xs">
                {allTokens.filter(t => t.platform === platform).length} tokens
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Filters */}
      <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Shield size={18} className="mr-2 text-green-400" />
          Real-Time Safety Filters
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

      {/* Real-Time Token List */}
      <div className="space-y-4">
        {filteredTokens.length > 0 ? (
          filteredTokens.map((token, index) => (
            <div key={token.mint || index} className="bg-gray-900/50 border border-purple-800 rounded-lg p-4 hover:border-purple-600 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {token.symbol?.slice(0, 2) || 'TK'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-bold text-lg text-white">{token.symbol}</span>
                      <span className={`px-3 py-1 rounded-full text-sm border ${getPlatformColor(token.platform)}`}>
                        {token.platform}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(token.graduationStatus)}`}>
                        {token.graduationStatus}
                      </span>
                      <div className="flex items-center space-x-1">
                        {token.lpLocked && <CheckCircle size={14} className="text-green-400" />}
                        {token.mintRenounced && <Shield size={14} className="text-blue-400" />}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {token.created ? new Date(token.created).toLocaleTimeString() : 'Just now'}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{token.holders || 0} holders</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-sm text-gray-400">Price</div>
                    <div className="font-bold text-white">{token.price || '$0.000001'}</div>
                    <div className={`text-xs ${(token.change24h || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.change24h ? `${token.change24h > 0 ? '+' : ''}${token.change24h}%` : '+0.0%'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Liquidity</div>
                    <div className="font-bold text-green-400">{token.liquidity || '$50K'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Tax (B/S)</div>
                    <div className="font-bold text-orange-400">{token.buyTax || 2}%/{token.sellTax || 3}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Rug Score</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(token.rugScore || 75)}`}>
                      {token.rugScore || 75}/100
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleQuickSnipe(token.symbol, token.mint)}
                    className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-all flex items-center space-x-1"
                  >
                    <Target size={14} />
                    <span>Snipe</span>
                  </button>
                  <button 
                    onClick={() => handleQuickBuy(token.symbol, token.mint)}
                    className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium hover:bg-green-500/30 transition-all"
                  >
                    Buy
                  </button>
                  <button className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-all">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <AlertTriangle size={48} className="text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400">No tokens match your safety filters</div>
            <div className="text-sm text-gray-500 mt-2">Try adjusting your filter criteria</div>
          </div>
        )}
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{filteredTokens.length}</div>
          <div className="text-sm text-gray-400">Safe Tokens Live</div>
        </div>
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {filteredTokens.filter(t => {
              const created = t.created ? new Date(t.created) : new Date();
              return Date.now() - created.getTime() < 3600000;
            }).length}
          </div>
          <div className="text-sm text-gray-400">Last Hour</div>
        </div>
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {filteredTokens.reduce((sum, t) => sum + (t.holders || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Holders</div>
        </div>
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {filteredTokens.length > 0 ? Math.round(filteredTokens.reduce((sum, t) => sum + (t.rugScore || 75), 0) / filteredTokens.length) : 0}
          </div>
          <div className="text-sm text-gray-400">Avg Safety Score</div>
        </div>
      </div>
    </div>
  );
};