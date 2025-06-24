
import { useState, useEffect } from 'react';
import { Search, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export const TokenDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockTokens = [
    {
      mint: 'BonkCoinMint123...abc',
      symbol: 'BONK',
      name: 'Bonk Inu',
      price: '$0.000012456',
      change24h: '+187.3%',
      volume24h: '$2.4M',
      liquidity: '$890K',
      mcap: '$45.2M',
      rugScore: 85,
      status: 'SAFE',
      lpLocked: true,
      mintRenounced: true,
      created: '2h ago'
    },
    {
      mint: 'PepeCoinMint456...def',
      symbol: 'PEPE',
      name: 'Pepe Solana',
      price: '$0.000001247',
      change24h: '+23.4%',
      volume24h: '$1.8M',
      liquidity: '$567K',
      mcap: '$28.9M',
      rugScore: 92,
      status: 'SAFE',
      lpLocked: true,
      mintRenounced: true,
      created: '4h ago'
    },
    {
      mint: 'ShibCoinMint789...ghi',
      symbol: 'SHIB',
      name: 'Shiba Solana',
      price: '$0.000008932',
      change24h: '-5.7%',
      volume24h: '$3.2M',
      liquidity: '$1.2M',
      mcap: '$67.1M',
      rugScore: 45,
      status: 'WARNING',
      lpLocked: false,
      mintRenounced: true,
      created: '6h ago'
    }
  ];

  useEffect(() => {
    // Simulate API call to Birdeye
    setTimeout(() => {
      setTokens(mockTokens);
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Search size={24} className="text-purple-400" />
          <h2 className="text-2xl font-bold">Token Discovery</h2>
        </div>
        <div className="text-sm text-gray-400">
          Powered by Birdeye API • Updated every 30s
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by symbol, name, or mint address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-800 border border-purple-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-white hover:from-purple-600 hover:to-pink-600">
            Search
          </button>
        </div>
        
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
            <span className="text-sm text-gray-300">LP Locked Only</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
            <span className="text-sm text-gray-300">Mint Renounced</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
            <span className="text-sm text-gray-300">Rug Score 80+</span>
          </label>
        </div>
      </div>

      {/* Token List */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800/50 border-b border-purple-700 text-sm font-medium text-gray-400">
          <div className="col-span-3">Token</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-1">24h %</div>
          <div className="col-span-2">Volume</div>
          <div className="col-span-2">Liquidity</div>
          <div className="col-span-1">Rug Score</div>
          <div className="col-span-1">Actions</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading tokens from Birdeye...
          </div>
        ) : (
          <div className="divide-y divide-purple-800/50">
            {tokens.map((token, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/30 transition-all">
                <div className="col-span-3 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-gray-400">{token.name}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {token.lpLocked && <CheckCircle size={12} className="text-green-400" />}
                      {token.mintRenounced && <Shield size={12} className="text-blue-400" />}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col justify-center">
                  <div className="font-medium text-white">{token.price}</div>
                  <div className="text-xs text-gray-400">{token.mcap}</div>
                </div>
                <div className="col-span-1 flex items-center">
                  <span className={token.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                    {token.change24h}
                  </span>
                </div>
                <div className="col-span-2 flex items-center text-white">
                  {token.volume24h}
                </div>
                <div className="col-span-2 flex items-center text-white">
                  {token.liquidity}
                </div>
                <div className="col-span-1 flex items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(token.rugScore)}`}>
                    {token.rugScore}
                  </span>
                </div>
                <div className="col-span-1 flex items-center space-x-2">
                  <button className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 text-xs hover:bg-purple-500/30">
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
