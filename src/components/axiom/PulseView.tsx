import { useState, useEffect } from 'react';
import { Filter, Settings, TrendingUp, ChevronRight } from 'lucide-react';
import { PulseTokenRow } from './PulseTokenRow';
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

interface PulseViewProps {
  tokens: Token[];
}

export const PulseView = ({ tokens }: PulseViewProps) => {
  const [activeSection, setActiveSection] = useState('new-pairs');
  const [timeframe, setTimeframe] = useState('5m');
  const navigate = useNavigate();

  const sections = [
    { id: 'new-pairs', label: 'New Pairs' },
    { id: 'final-stretch', label: 'Final Stretch' },
    { id: 'migrated', label: 'Migrated' }
  ];

  const timeframes = ['5s', '1m', '5m', '30m', '1h'];

  const handleTokenClick = (token: Token) => {
    navigate(`/token/${token.mint}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold">Pulse</div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white">
            <span className="text-sm">Display</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{section.label}</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-white">
                  <TrendingUp className="w-4 h-4" />
                </button>
                <span className="text-gray-400 text-sm">0</span>
              </div>
            </div>

            {/* Token List */}
            <div className="space-y-3">
              {tokens.slice(0, 5).map((token, index) => (
                <PulseTokenRow
                  key={`${section.id}-${token.mint}`}
                  token={token}
                  onClick={() => handleTokenClick(token)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};