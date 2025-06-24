
import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, PieChart } from 'lucide-react';

export const WalletAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const portfolioStats = {
    totalValue: '$12,847.52',
    totalInvested: '$8,450.00',
    unrealizedPnL: '+$4,397.52',
    realizedPnL: '+$2,134.28',
    winRate: '73.4%',
    avgHoldTime: '4.2 days',
    totalTrades: 156,
    successfulTrades: 114,
  };

  const holdings = [
    { 
      token: 'BONK', 
      amount: '2.4M', 
      value: '$4,820.33', 
      invested: '$2,500.00',
      pnl: '+92.8%',
      pnlAmount: '+$2,320.33',
      avgBuyPrice: '$0.000001042',
      currentPrice: '$0.000002009'
    },
    { 
      token: 'WIF', 
      amount: '456', 
      value: '$3,240.88', 
      invested: '$2,800.00',
      pnl: '+15.7%',
      pnlAmount: '+$440.88',
      avgBuyPrice: '$6.14',
      currentPrice: '$7.11'
    },
    { 
      token: 'PEPE', 
      amount: '89K', 
      value: '$2,890.12', 
      invested: '$1,200.00',
      pnl: '+140.8%',
      pnlAmount: '+$1,690.12',
      avgBuyPrice: '$0.000013483',
      currentPrice: '$0.000032468'
    },
    { 
      token: 'MYRO', 
      amount: '1.2K', 
      value: '$1,896.19', 
      invested: '$1,950.00',
      pnl: '-2.8%',
      pnlAmount: '-$53.81',
      avgBuyPrice: '$1.625',
      currentPrice: '$1.580'
    },
  ];

  const tradingHistory = [
    { token: 'BONK', action: 'SELL', amount: '50%', price: '$0.000002009', time: '2h ago', pnl: '+$1,160' },
    { token: 'WIF', action: 'BUY', amount: '100 WIF', price: '$7.11', time: '1d ago', pnl: '+$89' },
    { token: 'PEPE', action: 'BUY', amount: '25K', price: '$0.000032468', time: '3d ago', pnl: '+$420' },
    { token: 'MYRO', action: 'SELL', amount: '25%', price: '$1.580', time: '1w ago', pnl: '-$12' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 size={24} className="text-green-400" />
          <h2 className="text-2xl font-bold">Wallet Analytics</h2>
        </div>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="bg-gray-800 border border-green-700 rounded-lg px-3 py-2 text-white"
        >
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="90d">90 Days</option>
          <option value="1y">1 Year</option>
        </select>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Value</div>
              <div className="text-2xl font-bold text-green-400">{portfolioStats.totalValue}</div>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Unrealized P&L</div>
              <div className="text-2xl font-bold text-blue-400">{portfolioStats.unrealizedPnL}</div>
            </div>
            <TrendingUp className="text-blue-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Win Rate</div>
              <div className="text-2xl font-bold text-purple-400">{portfolioStats.winRate}</div>
            </div>
            <Target className="text-purple-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Trades</div>
              <div className="text-2xl font-bold text-orange-400">{portfolioStats.totalTrades}</div>
            </div>
            <PieChart className="text-orange-400" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Holdings */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <PieChart size={18} className="mr-2 text-green-400" />
            Current Holdings
          </h3>
          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <div key={index} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                      {holding.token.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{holding.token}</div>
                      <div className="text-sm text-gray-400">{holding.amount}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{holding.value}</div>
                    <div className={`text-sm ${holding.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.pnl}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Avg Buy Price</div>
                    <div className="text-white">{holding.avgBuyPrice}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Current Price</div>
                    <div className="text-white">{holding.currentPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading History */}
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recent Trading History</h3>
          <div className="space-y-3">
            {tradingHistory.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    trade.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.action === 'BUY' ? 'B' : 'S'}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">{trade.token}</div>
                    <div className="text-xs text-gray-400">{trade.amount} @ {trade.price}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${trade.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl}
                  </div>
                  <div className="text-xs text-gray-400">{trade.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Portfolio Performance</h3>
        <div className="h-64 bg-black/30 rounded-lg flex items-center justify-center border border-gray-700">
          <div className="text-center">
            <BarChart3 size={48} className="text-gray-600 mx-auto mb-2" />
            <div className="text-gray-400">Real-time Portfolio Chart</div>
            <div className="text-sm text-gray-500 mt-1">Performance tracking via Birdeye API</div>
          </div>
        </div>
      </div>
    </div>
  );
};
