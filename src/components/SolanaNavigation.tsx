import { Search, TrendingUp, Target, Copy, Shield, BarChart3, AlertTriangle } from 'lucide-react';

interface SolanaNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SolanaNavigation = ({ activeTab, setActiveTab }: SolanaNavigationProps) => {
  const navItems = [
    { id: 'discovery', label: 'Meme Discovery', icon: Search },
    { id: 'fresh', label: 'Fresh Memes', icon: TrendingUp },
    { id: 'sniper', label: 'Auto Sniper', icon: Target },
    { id: 'copy', label: 'Copy Trading', icon: Copy },
    { id: 'rugwatch', label: 'Rugger Watch', icon: AlertTriangle },
    { id: 'analytics', label: 'Portfolio', icon: BarChart3 },
  ];

  return (
    <nav className="w-64 bg-gray-900/50 border-r border-purple-800 p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400'
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Meme Coin Stats */}
      <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-purple-700">
        <div className="text-sm text-gray-400 mb-2">Meme Coin Market</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">SOL Price</span>
            <div className="text-right">
              <div className="text-sm font-bold text-purple-400">$98.45</div>
              <div className="text-xs text-green-400">+5.2%</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Active Memes</span>
            <div className="text-sm font-bold text-green-400">1,247</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">24h Volume</span>
            <div className="text-sm font-bold text-orange-400">$12.4M</div>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-green-700">
        <div className="text-sm text-gray-400 mb-2">Platform Status</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-orange-400">Pump.fun</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400">Moonshot</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Raydium</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-400">Pump.swap</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};
