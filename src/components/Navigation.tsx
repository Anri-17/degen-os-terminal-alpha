
import { Activity, Target, Copy, BarChart3, Shield, Zap } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'analyzer', label: 'Token Analyzer', icon: Shield },
    { id: 'sniper', label: 'Sniper AI', icon: Target },
    { id: 'copy', label: 'Copy Trading', icon: Copy },
  ];

  return (
    <nav className="w-64 bg-gray-900/50 border-r border-gray-800 p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-green-400'
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Stats */}
      <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Degen Level</div>
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold text-green-400">7</div>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">2,847 XP</div>
      </div>
    </nav>
  );
};
