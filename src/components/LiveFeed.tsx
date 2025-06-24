
import { Activity, TrendingUp, Target, AlertTriangle } from 'lucide-react';

export const LiveFeed = () => {
  const feedItems = [
    {
      type: 'snipe',
      token: 'DOGE2.0',
      action: 'Auto-sniped',
      amount: '+$500',
      time: '2s ago',
      icon: Target,
      color: 'text-green-400',
    },
    {
      type: 'alert',
      token: 'RUGME',
      action: 'Rug detected',
      amount: 'Trade blocked',
      time: '15s ago',
      icon: AlertTriangle,
      color: 'text-red-400',
    },
    {
      type: 'copy',
      token: 'PUMP',
      action: 'Copied whale buy',
      amount: '$1,200',
      time: '32s ago',
      icon: Activity,
      color: 'text-blue-400',
    },
    {
      type: 'profit',
      token: 'MOON',
      action: 'Take profit hit',
      amount: '+$850',
      time: '1m ago',
      icon: TrendingUp,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Activity size={20} className="mr-2 text-green-400" />
        Live Activity Feed
      </h3>
      
      <div className="space-y-3">
        {feedItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <Icon size={16} className={item.color} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.token}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                <div className="text-xs text-gray-400">{item.action}</div>
              </div>
              <div className={`text-sm font-bold ${item.color}`}>
                {item.amount}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 space-y-2">
        <button className="w-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg py-2 text-sm font-medium text-green-400 hover:from-green-500/30 hover:to-blue-500/30 transition-all">
          Enable Auto-Sniper
        </button>
        <button className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-all">
          Configure MEV Protection
        </button>
      </div>
    </div>
  );
};
