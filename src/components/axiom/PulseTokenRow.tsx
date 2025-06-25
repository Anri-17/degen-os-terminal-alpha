import { useState } from 'react';

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

interface PulseTokenRowProps {
  token: Token;
  onClick: () => void;
}

export const PulseTokenRow = ({ token, onClick }: PulseTokenRowProps) => {
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

  return (
    <div 
      className="flex items-center justify-between p-3 bg-gray-900/30 hover:bg-gray-800/50 transition-colors cursor-pointer rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Left side - Token info */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-800 rounded-md overflow-hidden">
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
            <span className="text-gray-400 text-xs">{token.name}</span>
          </div>
          <div className="text-xs text-gray-500">{token.age}</div>
        </div>
      </div>

      {/* Right side - Price and stats */}
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="text-white font-medium">MC ${formatNumber(token.marketCap)}</div>
          <div className="text-gray-400 text-xs">V ${formatNumber(token.volume)}</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-end">
            <div className="text-white font-medium">${formatPrice(token.price)}</div>
            <div className={`text-xs ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {token.change >= 0 ? '+' : ''}{token.change.toFixed(1)}%
            </div>
          </div>
          
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors">
            0 SOL
          </button>
        </div>
      </div>
    </div>
  );
};