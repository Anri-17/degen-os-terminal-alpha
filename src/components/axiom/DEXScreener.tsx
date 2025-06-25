import { useState, useEffect } from 'react';
import { Filter, Settings, TrendingUp } from 'lucide-react';
import { TokenRow } from './TokenRow';
import { useNavigate } from 'react-router-dom';

interface Token {
  mint: string;
  symbol: string;
  name: string;
  image: string;
  age: string;
  marketCap: number;
  liquidity: number;
  volume: number;
  txns: { buys: number; sells: number };
  change: number;
  price: number;
  verified: boolean;
}

interface DEXScreenerProps {
  tokens: Token[];
}

export const DEXScreener = ({ tokens }: DEXScreenerProps) => {
  const [activeTab, setActiveTab] = useState('trending');
  const [timeframe, setTimeframe] = useState('5m');
  const navigate = useNavigate();

  const tabs = [
    { id: 'dex-screener', label: 'DEX Screener' },
    { id: 'trending', label: 'Trending' },
    { id: 'pump-live', label: 'Pump Live' }
  ];

  const timeframes = ['1m', '5m', '30m', '1h'];

  const handleTokenClick = (token: Token) => {
    navigate(`/token/${token.mint}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-lg font-medium transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* Timeframe selector */}
          <div className="flex items-center space-x-1 bg-gray-900 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-white">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>

          <button className="p-2 text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Quick Buy</span>
            <span className="bg-gray-800 px-2 py-1 rounded">0.0</span>
          </div>

          <div className="flex items-center space-x-1">
            <button className="px-2 py-1 bg-blue-600 text-white rounded text-sm">P1</button>
            <button className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-sm">P2</button>
            <button className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-sm">P3</button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-gray-400 border-b border-gray-800">
        <div className="col-span-3">Pair Info</div>
        <div className="col-span-1 text-center">Market Cap</div>
        <div className="col-span-1 text-center">Liquidity</div>
        <div className="col-span-1 text-center">Volume</div>
        <div className="col-span-1 text-center">TXNS</div>
        <div className="col-span-3">Token Info</div>
        <div className="col-span-2 text-center">Action</div>
      </div>

      {/* Token List */}
      <div className="space-y-1">
        {tokens.map((token, index) => (
          <TokenRow
            key={token.mint}
            token={token}
            onClick={() => handleTokenClick(token)}
          />
        ))}
      </div>
    </div>
  );
};