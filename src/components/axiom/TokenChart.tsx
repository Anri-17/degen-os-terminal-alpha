import { useState, useEffect, useRef } from 'react';
import { Share2, Settings, ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Token {
  mint: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  liquidity: number;
}

interface TokenChartProps {
  token: Token;
}

export const TokenChart = ({ token }: TokenChartProps) => {
  const [timeframe, setTimeframe] = useState('1m');
  const [chartType, setChartType] = useState('candles');
  const chartRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const timeframes = ['1m', '3m', '5m', '15m', '1h', '4h', '1d', '1w'];

  useEffect(() => {
    // In a real implementation, this would initialize a chart library like TradingView
    if (chartRef.current) {
      // Initialize chart
    }
  }, [token, timeframe, chartType]);

  return (
    <div className="flex flex-col h-full">
      {/* Token Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-800 rounded-md overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                {token.symbol.slice(0, 2)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">{token.symbol}</span>
                <span className="text-gray-400 text-sm">1 coin = 1 tree</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">4m</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                  <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">${token.price.toFixed(2)}</div>
          <button className="p-2 text-gray-400 hover:text-white">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Chart Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="text-xs text-gray-400">Price</div>
            <div className="text-sm font-medium">${token.price.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Liquidity</div>
            <div className="text-sm font-medium">${token.liquidity.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Supply</div>
            <div className="text-sm font-medium">1B</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Global Fees Paid</div>
            <div className="text-sm font-medium">0.795</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">B.Curve</div>
            <div className="text-sm font-medium text-green-500">31.82%</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded-lg text-white">
            <span>Share PnL</span>
          </button>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 relative" ref={chartRef}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">
            Chart would be rendered here using TradingView or similar library
          </div>
        </div>
      </div>
      
      {/* Trading Panel */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
              Buy
            </button>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
              Sell
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-800 text-white rounded-lg text-sm">Market</button>
              <button className="px-3 py-1 bg-gray-900 text-gray-400 rounded-lg text-sm">Limit</button>
              <button className="px-3 py-1 bg-gray-900 text-gray-400 rounded-lg text-sm">Adv.</button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-4 gap-4">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
            0.001
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
            0.01
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
            1
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
            10
          </button>
        </div>
        
        <div className="mt-4">
          <button className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
            Buy {token.symbol}
          </button>
        </div>
      </div>
    </div>
  );
};