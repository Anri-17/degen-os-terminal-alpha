
import { useState } from 'react';
import { Target, Zap, Settings, Play, Pause } from 'lucide-react';

export const SniperPanel = () => {
  const [sniperEnabled, setSniperEnabled] = useState(false);
  const [settings, setSettings] = useState({
    maxBuyAmount: '0.1',
    minLiquidity: '10',
    maxTax: '10',
    autoSell: false,
    takeProfitPercent: '200',
    stopLossPercent: '50',
  });

  const sniperTargets = [
    { name: 'New Pancakeswap Listings', enabled: true, count: 247 },
    { name: 'Uniswap V3 Launches', enabled: true, count: 89 },
    { name: 'Base Network Tokens', enabled: false, count: 156 },
    { name: 'Verified Contracts Only', enabled: true, count: 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target size={24} className="text-green-400" />
          <h2 className="text-2xl font-bold">Sniper AI</h2>
        </div>
        <button
          onClick={() => setSniperEnabled(!sniperEnabled)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            sniperEnabled
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {sniperEnabled ? <Pause size={18} /> : <Play size={18} />}
          <span>{sniperEnabled ? 'Stop Sniping' : 'Start Sniping'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sniper Targets */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Zap size={18} className="mr-2 text-yellow-400" />
            Active Targets
          </h3>
          <div className="space-y-3">
            {sniperTargets.map((target, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={target.enabled}
                    className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">{target.name}</span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {target.count} tokens
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Settings size={18} className="mr-2 text-blue-400" />
            Sniper Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Buy Amount (ETH)</label>
              <input
                type="number"
                value={settings.maxBuyAmount}
                onChange={(e) => setSettings({...settings, maxBuyAmount: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Min Liquidity ($)</label>
              <input
                type="number"
                value={settings.minLiquidity}
                onChange={(e) => setSettings({...settings, minLiquidity: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Tax (%)</label>
              <input
                type="number"
                value={settings.maxTax}
                onChange={(e) => setSettings({...settings, maxTax: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.autoSell}
                onChange={(e) => setSettings({...settings, autoSell: e.target.checked})}
                className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <label className="text-sm text-gray-400">Enable Auto-Sell</label>
            </div>
            {settings.autoSell && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Take Profit (%)</label>
                  <input
                    type="number"
                    value={settings.takeProfitPercent}
                    onChange={(e) => setSettings({...settings, takeProfitPercent: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
                  <input
                    type="number"
                    value={settings.stopLossPercent}
                    onChange={(e) => setSettings({...settings, stopLossPercent: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Snipes */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Recent Snipes</h3>
        <div className="space-y-3">
          {[
            { token: 'MOONSHOT', price: '$0.000012', amount: '0.05 ETH', profit: '+347%', time: '2m ago' },
            { token: 'ROCKET', price: '$0.000067', amount: '0.08 ETH', profit: '+89%', time: '15m ago' },
            { token: 'DEGEN', price: '$0.000234', amount: '0.03 ETH', profit: '+12%', time: '1h ago' },
          ].map((snipe, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {snipe.token.slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-sm">{snipe.token}</div>
                  <div className="text-xs text-gray-400">{snipe.price} • {snipe.amount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-sm">{snipe.profit}</div>
                <div className="text-xs text-gray-400">{snipe.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
