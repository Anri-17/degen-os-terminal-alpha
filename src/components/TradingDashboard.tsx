
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { TokenChart } from './TokenChart';
import { LiveFeed } from './LiveFeed';
import { PortfolioOverview } from './PortfolioOverview';

export const TradingDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Portfolio Value</div>
              <div className="text-2xl font-bold text-green-400">$12,847</div>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">24h P&L</div>
              <div className="text-2xl font-bold text-green-400">+$2,431</div>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Win Rate</div>
              <div className="text-2xl font-bold text-blue-400">73%</div>
            </div>
            <Activity className="text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Rugs Avoided</div>
              <div className="text-2xl font-bold text-orange-400">17</div>
            </div>
            <TrendingDown className="text-orange-400" size={24} />
          </div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart and Trading */}
        <div className="lg:col-span-2 space-y-6">
          <TokenChart />
          <PortfolioOverview />
        </div>
        
        {/* Live Feed */}
        <div className="space-y-6">
          <LiveFeed />
        </div>
      </div>
    </div>
  );
};
