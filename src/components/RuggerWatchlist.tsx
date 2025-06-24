
import { useState } from 'react';
import { AlertTriangle, Eye, Plus, TrendingDown, Shield } from 'lucide-react';

export const RuggerWatchlist = () => {
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [watchedWallets, setWatchedWallets] = useState([
    {
      address: '7fUf4QzKwVGkL9xM2aP...kL9x',
      label: 'Known Rugger #1',
      rugCount: 12,
      lastActivity: '2m ago',
      isActive: true,
      reputation: 'High Risk'
    },
    {
      address: '9aB2cD3eF4gH5iJ6kL7...mN8o',
      label: 'Suspected Dev Wallet',
      rugCount: 5,
      lastActivity: '1h ago',
      isActive: false,
      reputation: 'Medium Risk'
    },
    {
      address: '5fE4dC3bA2zY1xW9vU8...tS7r',
      label: 'Honeypot Creator',
      rugCount: 18,
      lastActivity: '3h ago',
      isActive: true,
      reputation: 'Extreme Risk'
    }
  ]);

  const recentActivity = [
    {
      wallet: 'Known Rugger #1',
      action: 'Large Buy',
      token: 'SCAM',
      amount: '50 SOL',
      time: '2m ago',
      risk: 'high',
      details: 'Unusual large buy before potential rug'
    },
    {
      wallet: 'Suspected Dev Wallet',
      action: 'LP Remove',
      token: 'HONEYPOT',
      amount: '100% LP',
      time: '1h ago',
      risk: 'extreme',
      details: 'Full liquidity removal detected'
    },
    {
      wallet: 'Honeypot Creator',
      action: 'Token Deploy',
      token: 'NEWTRAP',
      amount: 'New Contract',
      time: '3h ago',
      risk: 'high',
      details: 'New token deployment from known rugger'
    }
  ];

  const addWallet = () => {
    if (newWalletAddress) {
      setWatchedWallets([...watchedWallets, {
        address: newWalletAddress,
        label: `Wallet ${watchedWallets.length + 1}`,
        rugCount: 0,
        lastActivity: 'Just added',
        isActive: false,
        reputation: 'Unknown'
      }]);
      setNewWalletAddress('');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'extreme': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={24} className="text-red-400" />
          <h2 className="text-2xl font-bold">Rugger Watchlist</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Real-time monitoring</span>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Watched Wallets</div>
              <div className="text-2xl font-bold text-red-400">{watchedWallets.length}</div>
            </div>
            <Eye className="text-red-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Active Alerts</div>
              <div className="text-2xl font-bold text-orange-400">7</div>
            </div>
            <AlertTriangle className="text-orange-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Rugs Prevented</div>
              <div className="text-2xl font-bold text-yellow-400">23</div>
            </div>
            <Shield className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Funds Saved</div>
              <div className="text-2xl font-bold text-green-400">$45K</div>
            </div>
            <TrendingDown className="text-green-400" size={24} />
          </div>
        </div>
      </div>

      {/* Add New Wallet */}
      <div className="bg-gray-900/50 border border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-3">Add Wallet to Watchlist</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter Solana wallet address..."
            value={newWalletAddress}
            onChange={(e) => setNewWalletAddress(e.target.value)}
            className="flex-1 bg-gray-800 border border-red-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
          />
          <button
            onClick={addWallet}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30"
          >
            <Plus size={18} />
            <span>Watch</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Watched Wallets */}
        <div className="bg-gray-900/50 border border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Monitored Wallets</h3>
          <div className="space-y-3">
            {watchedWallets.map((wallet, index) => (
              <div key={index} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${wallet.isActive ? 'bg-red-400 animate-pulse' : 'bg-gray-600'}`}></div>
                    <div>
                      <div className="font-medium text-sm text-white">{wallet.label}</div>
                      <div className="text-xs text-gray-400 font-mono">{wallet.address}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs border ${getRiskColor(wallet.reputation.toLowerCase().split(' ')[0])}`}>
                        {wallet.reputation}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{wallet.rugCount} rugs</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Suspicious Activity */}
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recent Suspicious Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getRiskColor(activity.risk)}`}>
                      !
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-white">{activity.action}</div>
                      <div className="text-xs text-gray-400">{activity.wallet}</div>
                      <div className="text-xs text-orange-400 mt-1">{activity.details}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{activity.token}</div>
                    <div className="text-xs text-gray-400">{activity.amount}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Alert Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-red-400 bg-gray-700 border-red-600 rounded focus:ring-red-500" />
              <label className="text-sm text-gray-300">Large buy alerts ({'>'}10 SOL)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-red-400 bg-gray-700 border-red-600 rounded focus:ring-red-500" />
              <label className="text-sm text-gray-300">Liquidity removal alerts</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-red-400 bg-gray-700 border-red-600 rounded focus:ring-red-500" />
              <label className="text-sm text-gray-300">New token deployments</label>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-red-400 bg-gray-700 border-red-600 rounded focus:ring-red-500" />
              <label className="text-sm text-gray-300">Telegram notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 text-red-400 bg-gray-700 border-red-600 rounded focus:ring-red-500" />
              <label className="text-sm text-gray-300">Email alerts</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-red-400 bg-gray-700 border-red-600 rounded focus:ring-red-500" />
              <label className="text-sm text-gray-300">Discord webhooks</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
