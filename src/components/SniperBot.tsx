
import { useState } from 'react';
import { Target, Zap, Settings, Play, Pause, AlertTriangle } from 'lucide-react';

export const SniperBot = () => {
  const [sniperEnabled, setSniperEnabled] = useState(false);
  const [settings, setSettings] = useState({
    maxBuyAmount: 0.1,
    minLiquidity: 10000,
    maxSlippage: 20,
    minRugScore: 80,
    maxTax: 5,
    autoSell: false,
    takeProfitPercent: 200,
    stopLossPercent: 50,
  });

  const recentSnipes = [
    { token: 'MOON', entry: '$0.000000123', amount: '0.05 SOL', profit: '+347%', time: '2m ago', status: 'profit' },
    { token: 'DEGEN', entry: '$0.000000456', amount: '0.08 SOL', profit: '+89%', time: '15m ago', status: 'profit' },
    { token: 'SAFE', entry: '$0.000000789', amount: '0.03 SOL', profit: '+12%', time: '1h ago', status: 'holding' },
    { token: 'RISK', entry: '$0.000001234', amount: '0.02 SOL', profit: '-25%', time: '2h ago', status: 'loss' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target size={24} className="text-green-400" />
          <h2 className="text-2xl font-bold">Auto Sniper Bot</h2>
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

      {/* Status Banner */}
      <div className={`p-4 rounded-lg border ${
        sniperEnabled 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-gray-800/50 border-gray-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${sniperEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="font-medium">
              {sniperEnabled ? 'Sniper Bot Active - Monitoring Liquidity Adds' : 'Sniper Bot Inactive'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {sniperEnabled ? 'Scanning via Birdeye Webhooks + Solana RPC' : 'Configure settings to start'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sniper Settings */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Settings size={18} className="mr-2 text-green-400" />
            Sniper Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Buy Amount (SOL)</label>
              <input
                type="number"
                value={settings.maxBuyAmount}
                onChange={(e) => setSettings({...settings, maxBuyAmount: Number(e.target.value)})}
                className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                step="0.01"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Min Liquidity ($)</label>
              <input
                type="number"
                value={settings.minLiquidity}
                onChange={(e) => setSettings({...settings, minLiquidity: Number(e.target.value)})}
                className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Slippage (%)</label>
              <input
                type="number"
                value={settings.maxSlippage}
                onChange={(e) => setSettings({...settings, maxSlippage: Number(e.target.value)})}
                className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Min Rug Score</label>
              <input
                type="number"
                value={settings.minRugScore}
                onChange={(e) => setSettings({...settings, minRugScore: Number(e.target.value)})}
                className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Tax (%)</label>
              <input
                type="number"
                value={settings.maxTax}
                onChange={(e) => setSettings({...settings, maxTax: Number(e.target.value)})}
                className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* Auto-Sell Settings */}
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Zap size={18} className="mr-2 text-orange-400" />
            Auto-Sell Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.autoSell}
                onChange={(e) => setSettings({...settings, autoSell: e.target.checked})}
                className="w-4 h-4 text-orange-400 bg-gray-700 border-orange-600 rounded focus:ring-orange-500"
              />
              <label className="text-sm text-gray-300">Enable Auto-Sell</label>
            </div>
            
            {settings.autoSell && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Take Profit (%)</label>
                  <input
                    type="number"
                    value={settings.takeProfitPercent}
                    onChange={(e) => setSettings({...settings, takeProfitPercent: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-orange-700 rounded px-3 py-2 text-white"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
                  <input
                    type="number"
                    value={settings.stopLossPercent}
                    onChange={(e) => setSettings({...settings, stopLossPercent: Number(e.target.value)})}
                    className="w-full bg-gray-800 border border-orange-700 rounded px-3 py-2 text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </>
            )}
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle size={16} className="text-orange-400 mt-0.5" />
                <div className="text-xs text-orange-300">
                  Auto-sell uses price monitoring via Birdeye API and executes via Jupiter when thresholds are met.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Snipes */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Recent Snipes</h3>
        <div className="space-y-3">
          {recentSnipes.map((snipe, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {snipe.token.slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-sm">{snipe.token}</div>
                  <div className="text-xs text-gray-400">{snipe.entry} • {snipe.amount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  snipe.status === 'profit' ? 'text-green-400' : 
                  snipe.status === 'loss' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {snipe.profit}
                </div>
                <div className="text-xs text-gray-400">{snipe.time}</div>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                snipe.status === 'profit' ? 'bg-green-500/20 text-green-400' :
                snipe.status === 'loss' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {snipe.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
