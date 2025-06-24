
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface CoinChartProps {
  coinData: {
    symbol: string;
    price: string;
    change24h: string;
  };
}

export const CoinChart = ({ coinData }: CoinChartProps) => {
  const [timeframe, setTimeframe] = useState('24h');

  // Mock chart data
  const chartData = {
    '5m': Array.from({ length: 100 }, (_, i) => ({
      time: `${i * 5}m`,
      price: 0.000012 + Math.random() * 0.000005,
      volume: Math.random() * 100000
    })),
    '1h': Array.from({ length: 24 }, (_, i) => ({
      time: `${i}h`,
      price: 0.000012 + Math.random() * 0.000005,
      volume: Math.random() * 500000
    })),
    '3h': Array.from({ length: 8 }, (_, i) => ({
      time: `${i * 3}h`,
      price: 0.000012 + Math.random() * 0.000005,
      volume: Math.random() * 1000000
    })),
    '24h': Array.from({ length: 24 }, (_, i) => ({
      time: `${i}h`,
      price: 0.000012 + Math.random() * 0.000005,
      volume: Math.random() * 2000000
    }))
  };

  const timeframes = ['5m', '1h', '3h', '24h'];

  return (
    <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Price Chart</h3>
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                timeframe === tf
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData[timeframe as keyof typeof chartData]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(8)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #7C3AED',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
              formatter={(value: any) => [`$${value.toFixed(8)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#A855F7" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#A855F7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-sm text-gray-400">High</div>
          <div className="text-lg font-bold text-green-400">$0.000015</div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-sm text-gray-400">Low</div>
          <div className="text-lg font-bold text-red-400">$0.000009</div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-sm text-gray-400">Avg</div>
          <div className="text-lg font-bold text-purple-400">$0.000012</div>
        </div>
      </div>
    </div>
  );
};
