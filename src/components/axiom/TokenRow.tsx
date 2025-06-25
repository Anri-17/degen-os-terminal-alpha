import { useState } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Search } from 'lucide-react';

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

interface TokenRowProps {
  token: Token;
  onClick: () => void;
}

export const TokenRow = ({ token, onClick }: TokenRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.000001) return price.toExponential(2);
    return price.toFixed(price < 0.01 ? 8 : 2);
  };

  const formatChange = (change: number) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)}%`;
  };

  return (
    <div 
      className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#0a0a0a] hover:bg-gray-900 transition-colors cursor-pointer border-b border-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Pair Info */}
      <div className="col-span-3 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-800 rounded-md overflow-hidden">
          {token.image ? (
            <img src={token.image} alt={token.symbol} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
              {token.symbol.slice(0, 2)}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">{token.symbol}</span>
            <span className="text-gray-400 text-sm">{token.name}</span>
          </div>
          <div className="text-xs text-gray-500">{token.age}</div>
        </div>
      </div>

      {/* Market Cap */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="text-white font-medium">
          {formatNumber(token.marketCap)}
          <div className={`text-xs ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {token.change >= 0 ? '+' : ''}{token.change.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Liquidity */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="text-white font-medium">{formatNumber(token.liquidity)}</div>
      </div>

      {/* Volume */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="text-white font-medium">{formatNumber(token.volume)}</div>
      </div>

      {/* TXNS */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="text-sm">
          <div className="flex items-center justify-between">
            <span className="text-green-500">{token.txns.buys}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-red-500">{token.txns.sells}</span>
          </div>
        </div>
      </div>

      {/* Token Info */}
      <div className="col-span-3 flex items-center space-x-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${token.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatChange(token.change)}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-blue-500">0%</span>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-green-500">0%</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-green-500">0%</span>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm text-red-500">Unpaid</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="col-span-2 flex items-center justify-center">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          Buy
        </button>
      </div>
    </div>
  );
};