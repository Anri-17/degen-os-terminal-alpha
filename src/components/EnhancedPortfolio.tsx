import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, PieChart, Calendar } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart as RechartsPieChart, Cell } from 'recharts';

export const EnhancedPortfolio = () => {
  const [userWallet] = useState('7fUf4QzKwVGkL9xM2aP...kL9x'); // In real app, get from wallet connection
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // API hooks
  const { data: portfolio, loading: portfolioLoading } = useApi(`/portfolio/${userWallet}`);
  const { data: performance } = useApi(`/portfolio/${userWallet}/performance?timeframe=${selectedTimeframe}`);
  const { data: analytics } = useApi(`/portfolio/${userWallet}/analytics?timeframe=${selectedTimeframe}`);

  if (portfolioLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div className="text-gray-400">Loading portfolio data...</div>
      </div>
    );
  }

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 size={24} className="text-green-400" />
          <h2 className="text-2xl font-bold">Enhanced Portfolio Analytics</h2>
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
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Value</div>
                <div className="text-2xl font-bold text-green-400">${portfolio.totalValue.toLocaleString()}</div>
              </div>
              <DollarSign className="text-green-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Unrealized P&L</div>
                <div className="text-2xl font-bold text-blue-400">+${portfolio.unrealizedPnL.toLocaleString()}</div>
              </div>
              <TrendingUp className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Win Rate</div>
                <div className="text-2xl font-bold text-purple-400">{portfolio.winRate}%</div>
              </div>
              <Target className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Trades</div>
                <div className="text-2xl font-bold text-orange-400">{portfolio.totalTrades}</div>
              </div>
              <PieChart className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <TrendingUp size={18} className="mr-2 text-green-400" />
            Portfolio Performance
          </h3>
          {performance && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance.dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #10B981',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Holdings Distribution */}
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <PieChart size={18} className="mr-2 text-blue-400" />
            Holdings Distribution
          </h3>
          {portfolio && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={portfolio.holdings}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ symbol, value }) => `${symbol}: $${value.toLocaleString()}`}
                  >
                    {portfolio.holdings.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #3B82F6',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Current Holdings */}
      {portfolio && (
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <PieChart size={18} className="mr-2 text-green-400" />
            Current Holdings
          </h3>
          <div className="space-y-4">
            {portfolio.holdings.map((holding: any, index: number) => (
              <div key={index} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                      {holding.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{holding.symbol}</div>
                      <div className="text-sm text-gray-400">{holding.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">${holding.value.toLocaleString()}</div>
                    <div className={`text-sm ${holding.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.pnl > 0 ? '+' : ''}{holding.pnl}%
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Avg Buy Price</div>
                    <div className="text-white">${holding.avgBuyPrice.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Current Price</div>
                    <div className="text-white">${holding.currentPrice.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">24h Change</div>
                    <div className={`${holding.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.change24h > 0 ? '+' : ''}{holding.change24h}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trading Analytics */}
      {analytics && (
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <BarChart3 size={18} className="mr-2 text-purple-400" />
            Trading Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Trades</span>
                <span className="text-white font-medium">{analytics.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Winning Trades</span>
                <span className="text-green-400 font-medium">{analytics.winningTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Losing Trades</span>
                <span className="text-red-400 font-medium">{analytics.losingTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-purple-400 font-medium">{analytics.winRate}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Win</span>
                <span className="text-green-400 font-medium">${analytics.avgWin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Loss</span>
                <span className="text-red-400 font-medium">${analytics.avgLoss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Profit Factor</span>
                <span className="text-blue-400 font-medium">{analytics.profitFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sharpe Ratio</span>
                <span className="text-orange-400 font-medium">{analytics.sharpeRatio}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-gray-400 text-sm">Best Trade</div>
                <div className="text-green-400 font-medium">{analytics.bestTrade.symbol}: +{analytics.bestTrade.pnlPercent}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Worst Trade</div>
                <div className="text-red-400 font-medium">{analytics.worstTrade.symbol}: {analytics.worstTrade.pnlPercent}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Max Drawdown</div>
                <div className="text-red-400 font-medium">{analytics.maxDrawdown}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trades */}
      {portfolio && (
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recent Trading History</h3>
          <div className="space-y-3">
            {portfolio.recentTrades.map((trade: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    trade.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.action === 'BUY' ? 'B' : 'S'}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">{trade.symbol}</div>
                    <div className="text-xs text-gray-400">{trade.amount} @ ${trade.price.toFixed(6)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                  </div>
                  <div className="text-xs text-gray-400">{new Date(trade.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};