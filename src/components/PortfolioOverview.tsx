
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';

export const PortfolioOverview = () => {
  const holdings = [
    { token: 'PEPE', amount: '1.2B', value: '$4,820', change: '+23.4%', changeColor: 'text-green-400' },
    { token: 'SHIB', amount: '500K', value: '$3,240', change: '-5.7%', changeColor: 'text-red-400' },
    { token: 'BONK', amount: '2.8M', value: '$2,890', change: '+187.3%', changeColor: 'text-green-400' },
    { token: 'DOGE', amount: '1.5K', value: '$1,897', change: '+12.1%', changeColor: 'text-green-400' },
  ];

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <PieChart size={20} className="mr-2 text-blue-400" />
          Portfolio Holdings
        </h3>
        <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
      </div>

      <div className="space-y-3">
        {holdings.map((holding, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                {holding.token.slice(0, 2)}
              </div>
              <div>
                <div className="font-medium">{holding.token}</div>
                <div className="text-xs text-gray-400">{holding.amount}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">{holding.value}</div>
              <div className={`text-xs ${holding.changeColor}`}>{holding.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
