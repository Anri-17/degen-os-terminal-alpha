
import { useState } from 'react';
import { Copy, TrendingUp, Users, Star } from 'lucide-react';

export const CopyTrading = () => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const topTraders = [
    {
      id: '1',
      name: 'DegenKing.eth',
      address: '0x742d35...a6f2',
      winRate: '89%',
      profit30d: '+$45,231',
      followers: 1247,
      strategy: 'Early Sniper',
      following: false,
    },
    {
      id: '2',
      name: 'MemeWhale',
      address: '0x1a4b8c...d7e9',
      winRate: '73%',
      profit30d: '+$28,456',
      followers: 892,
      strategy: 'Swing Trader',
      following: true,
    },
    {
      id: '3',
      name: 'RugHunter.eth',
      address: '0x5f2e9a...c3b1',
      winRate: '91%',
      profit30d: '+$67,890',
      followers: 2156,
      strategy: 'Safe Player',
      following: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Copy size={24} className="text-purple-400" />
        <h2 className="text-2xl font-bold">Copy Trading</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Following</div>
              <div className="text-2xl font-bold text-purple-400">3</div>
            </div>
            <Users className="text-purple-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Copy Profit</div>
              <div className="text-2xl font-bold text-green-400">+$8,234</div>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Success Rate</div>
              <div className="text-2xl font-bold text-blue-400">76%</div>
            </div>
            <Star className="text-blue-400" size={24} />
          </div>
        </div>
      </div>

      {/* Top Traders */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Top Performing Wallets</h3>
        <div className="space-y-4">
          {topTraders.map((trader) => (
            <div key={trader.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {trader.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{trader.name}</div>
                    <div className="text-sm text-gray-400">{trader.address}</div>
                    <div className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded mt-1 inline-block">
                      {trader.strategy}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                      <div className="font-bold text-green-400">{trader.winRate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">30d Profit</div>
                      <div className="font-bold text-green-400">{trader.profit30d}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Followers</div>
                      <div className="font-bold text-blue-400">{trader.followers}</div>
                    </div>
                  </div>
                  <button
                    className={`mt-3 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      trader.following
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                        : 'bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30'
                    }`}
                  >
                    {trader.following ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy Settings */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Copy Trading Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Max Copy Amount per Trade</label>
            <input
              type="number"
              placeholder="0.1"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Copy Percentage (%)</label>
            <input
              type="number"
              placeholder="10"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
            <input
              type="number"
              placeholder="20"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Take Profit (%)</label>
            <input
              type="number"
              placeholder="100"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-500" />
            <label className="text-sm text-gray-400">Only copy verified tokens</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-500" />
            <label className="text-sm text-gray-400">Skip if rug score below 70</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-500" />
            <label className="text-sm text-gray-400">Auto-sell with followed wallet</label>
          </div>
        </div>
      </div>
    </div>
  );
};
