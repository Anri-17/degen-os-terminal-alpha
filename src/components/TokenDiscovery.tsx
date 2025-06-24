import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, DollarSign, Shield, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TokenDiscovery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('volume');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock meme coin data from different platforms
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
      created: '2h ago',
      platform: 'pump.fun',
      graduationStatus: 'graduated',
      holders: 15420,
      trades24h: 2847
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
      created: '4h ago',
      platform: 'moonshot',
      graduationStatus: 'soon',
      holders: 8934,
      trades24h: 1567
    },
    {
      mint: 'ShibCoinMint789...ghi',
      symbol: 'DOGE2',
      name: 'Doge 2.0',
      price: '$0.000008932',
      change24h: '-5.7%',
      volume24h: '$3.2M',
      liquidity: '$1.2M',
      mcap: '$67.1M',
      rugScore: 45,
      status: 'WARNING',
      lpLocked: false,
      mintRenounced: true,
      created: '6h ago',
      platform: 'raydium',
      graduationStatus: 'new',
      holders: 3456,
      trades24h: 892
    },
    {
      mint: 'MoonCatMint012...jkl',
      symbol: 'MOONCAT',
      name: 'Moon Cat',
      price: '$0.000000234',
      change24h: '+456.7%',
      volume24h: '$234K',
      liquidity: '$89K',
      mcap: '$2.1M',
      rugScore: 78,
      status: 'SAFE',
      lpLocked: true,
      mintRenounced: false,
      created: '30m ago',
      platform: 'pump.swap',
      graduationStatus: 'pumping',
      holders: 567,
      trades24h: 234
    }
  ];

  useEffect(() => {
    // Simulate API call to Birdeye and platform APIs
    setTimeout(() => {
      setTokens(mockTokens);
      setLoading(false);
    }, 1000);
  }, []);

  const platforms = ['all', 'pump.fun', 'moonshot', 'raydium', 'pump.swap'];
  const statuses = ['all', 'new', 'pumping', 'soon', 'graduated'];

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = searchTerm === '' || 
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = selectedPlatform === 'all' || token.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || token.graduationStatus === selectedStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'pump.fun': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'moonshot': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'raydium': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'pump.swap': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'graduated': return 'text-green-400';
      case 'soon': return 'text-yellow-400';
      case 'new': return 'text-blue-400';
      case 'pumping': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const handleQuickBuy = (tokenSymbol) => {
    console.log(`Quick buying ${tokenSymbol} via Jupiter`);
    // This would integrate with the MemeSwapInterface
  };

  const handleCoinClick = (address: string) => {
    navigate(`/coin/${address}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Search size={24} className="text-purple-400" />
          <h2 className="text-2xl font-bold">Meme Coin Discovery</h2>
        </div>
        <div className="text-sm text-gray-400">
          Real-time • Pump.fun • Moonshot • Raydium • Pump.swap
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search meme coins by symbol, name, or mint address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-800 border border-purple-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-white hover:from-purple-600 hover:to-pink-600">
            Search
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-white"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'All Platforms' : platform}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="volume">Volume</option>
              <option value="price">Price</option>
              <option value="holders">Holders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading meme coins from all platforms...
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTokens.map((token, index) => (
              <div key={index} className="p-4 hover:bg-gray-800/30 transition-all border-b border-purple-800/30 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-white">{token.symbol}</span>
                        <span className={`px-2 py-1 rounded text-xs border ${getPlatformColor(token.platform)}`}>
                          {token.platform}
                        </span>
                        <span className={`text-xs font-medium ${getStatusColor(token.graduationStatus)}`}>
                          {token.graduationStatus}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {token.lpLocked && <CheckCircle size={12} className="text-green-400" />}
                        {token.mintRenounced && <Shield size={12} className="text-blue-400" />}
                        <span className="text-xs text-gray-500">{token.created}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-sm text-gray-400">Price</div>
                      <div className="font-bold text-white">{token.price}</div>
                      <div className={`text-xs ${token.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change24h}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Volume</div>
                      <div className="font-bold text-white">{token.volume24h}</div>
                      <div className="text-xs text-gray-400">{token.trades24h} trades</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Market Cap</div>
                      <div className="font-bold text-white">{token.mcap}</div>
                      <div className="text-xs text-gray-400">{token.holders} holders</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Rug Score</div>
                      <div className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(token.rugScore)}`}>
                        {token.rugScore}/100
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleQuickBuy(token.symbol)}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium hover:bg-green-500/30 transition-all"
                    >
                      Quick Buy
                    </button>
                    <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-all">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredTokens.length === 0 && !loading && (
        <div className="text-center py-8">
          <AlertTriangle size={48} className="text-gray-600 mx-auto mb-4" />
          <div className="text-gray-400">No meme coins found matching your criteria</div>
          <div className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</div>
        </div>
      )}

      {/* Platform Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">247</div>
          <div className="text-sm text-gray-400">Pump.fun Active</div>
        </div>
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">89</div>
          <div className="text-sm text-gray-400">Moonshot Listed</div>
        </div>
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">156</div>
          <div className="text-sm text-gray-400">Raydium Labs</div>
        </div>
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">67</div>
          <div className="text-sm text-gray-400">Pump.swap New</div>
        </div>
      </div>
    </div>
  );
};