
import { useState } from 'react';
import { Copy, TrendingUp, Users, Star, Eye } from 'lucide-react';

export const CopyTradingEngine = () => {
  const [selectedWallet, setSelectedWallet] = useState(null);

  const topWallets = [
    {
      id: '1',
      address: '7fUf4QzKwVGkL9xM2aP...kL9x',
      name: 'SolanaWhale.sol',
      winRate: '89%',
      profit30d: '+$45,231',
      trades30d: 247,
      followers: 1247,
      strategy: 'Early Sniper',
      isFollowing: false,
      avgHoldTime: '4.2h',
      successfulRugs: 17,
    },
    {
      id: '2',
      address: '9aB2cD3eF4gH5iJ6kL7...mN8o',
      name: 'MemeKing',
      winRate: '73%',
      profit30d: '+$28,456',
      trades30d: 156,
      followers: 892,
      strategy: 'Swing Trader',
      isFollowing: true,
      avgHoldTime: '2.1d',
      successfulRugs: 8,
    },
    {
      id: '3',
      address: '5fE4dC3bA2zY1xW9vU8...tS7r',
      name: 'SafePlayer.sol',
      winRate: '91%',
      profit30d: '+$67,890',
      trades30d: 89,
      followers: 2156,
      strategy: 'Safe Conservative',
      isFollowing: false,
      avgHoldTime: '1.2w',
      successfulRugs: 23,
    },
  ];

  const recentCopyTrades = [
    { wallet: 'SolanaWhale.sol', token: 'MOON', action: 'BUY', amount: '0.5 SOL', time: '2m ago', profit: '+$234' },
    { wallet: 'MemeKing', token: 'DEGEN', action: 'SELL', amount: '50%', time: '15m ago', profit: '+$89' },
    { wallet: 'SafePlayer.sol', token: 'SAFE', action: 'BUY', amount: '0.3 SOL', time: '1h ago', profit: '+$12' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Copy size={24} className="text-blue-400" />
        <h2 className="text-2xl font-bold">Copy Trading Engine</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Following</div>
              <div className="text-2xl font-bold text-blue-400">3</div>
            </div>
            <Users className="text-blue-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Copy Profit</div>
              <div className="text-2xl font-bold text-green-400">+$8,234</div>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Success Rate</div>
              <div className="text-2xl font-bold text-orange-400">76%</div>
            </div>
            <Star className="text-orange-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Active Copies</div>
              <div className="text-2xl font-bold text-purple-400">12</div>
            </div>
            <Eye className="text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Top Wallets */}
      <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Top Performing Wallets</h3>
        <div className="space-y-4">
          {topWallets.map((wallet) => (
            <div key={wallet.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {wallet.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{wallet.name}</div>
                    <div className="text-sm text-gray-400 font-mono">{wallet.address}</div>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                        {wallet.strategy}
                      </div>
                      <div className="text-xs text-gray-400">
                        Avg Hold: {wallet.avgHoldTime}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="font-bold text-green-400">{wallet.winRate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">30d Profit</div>
                    <div className="font-bold text-green-400">{wallet.profit30d}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Trades</div>
                    <div className="font-bold text-blue-400">{wallet.trades30d}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Rugs Avoided</div>
                    <div className="font-bold text-orange-400">{wallet.successfulRugs}</div>
                  </div>
                </div>
                
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    wallet.isFollowing
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                      : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                  }`}
                >
                  {wallet.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Copy Trading Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Copy Amount per Trade (SOL)</label>
              <input
                type="number"
                placeholder="0.1"
                className="w-full bg-gray-800 border border-purple-700 rounded px-3 py-2 text-white"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Copy Percentage (%)</label>
              <input
                type="number"
                placeholder="10"
                className="w-full bg-gray-800 border border-purple-700 rounded px-3 py-2 text-white"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
              <input
                type="number"
                placeholder="20"
                className="w-full bg-gray-800 border border-purple-700 rounded px-3 py-2 text-white"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                <label className="text-sm text-gray-400">Only copy tokens with rug score 80+</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                <label className="text-sm text-gray-400">Skip if tax above 5%</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                <label className="text-sm text-gray-400">Auto-sell when followed wallet sells</label>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Copy Trades */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recent Copy Trades</h3>
          <div className="space-y-3">
            {recentCopyTrades.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    trade.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.action.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{trade.token}</div>
                    <div className="text-xs text-gray-400">{trade.wallet} • {trade.amount}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-sm">{trade.profit}</div>
                  <div className="text-xs text-gray-400">{trade.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
