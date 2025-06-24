
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Users, DollarSign, Clock, Target, ExternalLink } from 'lucide-react';
import { CoinChart } from '@/components/CoinChart';
import { CoinTrading } from '@/components/CoinTrading';
import { CoinHolders } from '@/components/CoinHolders';
import { CoinStats } from '@/components/CoinStats';

interface CoinData {
  symbol: string;
  name: string;
  address: string;
  platform: string;
  price: string;
  change24h: string;
  volume: string;
  mcap: string;
  graduationStatus: string;
  launchPlatform: string;
  description: string;
  totalSupply: string;
  holdersCount: number;
  liquiditySOL: string;
  createdAt: string;
  creator: string;
  website?: string;
  twitter?: string;
  telegram?: string;
}

const CoinPage = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [activeTab, setActiveTab] = useState('chart');
  const [loading, setLoading] = useState(true);

  // Mock coin data - in real app, this would be fetched from API
  useEffect(() => {
    const mockCoinData: CoinData = {
      symbol: 'BONK',
      name: 'Bonk Inu',
      address: address || '',
      platform: 'Graduated',
      price: '$0.000012456',
      change24h: '+187.3%',
      volume: '$2.4M',
      mcap: '$45.2M',
      graduationStatus: 'graduated',
      launchPlatform: 'pump.fun',
      description: 'The first dog coin on Solana with a mission to bring fun and community to the blockchain.',
      totalSupply: '92,661,783,412,818',
      holdersCount: 147892,
      liquiditySOL: '1,247 SOL',
      createdAt: '2024-01-15',
      creator: '8xKv...9mNp',
      website: 'https://bonkcoin.com',
      twitter: 'https://twitter.com/bonk_inu',
      telegram: 'https://t.me/bonkinu'
    };

    setTimeout(() => {
      setCoinData(mockCoinData);
      setLoading(false);
    }, 1000);
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <div className="text-purple-400">Loading coin data...</div>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">Coin not found</div>
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'pump.fun': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'moonshot': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'raydium': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'pump.swap': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graduated': return 'text-green-400';
      case 'soon': return 'text-yellow-400';
      case 'new': return 'text-blue-400';
      case 'pumping': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Terminal</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-400 bg-purple-800 px-2 py-1 rounded">
              {address?.slice(0, 8)}...{address?.slice(-8)}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Coin Header */}
          <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                  {coinData.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{coinData.symbol}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getPlatformColor(coinData.launchPlatform)}`}>
                      {coinData.launchPlatform}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(coinData.graduationStatus)}`}>
                      {coinData.platform}
                    </span>
                  </div>
                  <div className="text-gray-400 mb-2">{coinData.name}</div>
                  <p className="text-gray-300 max-w-2xl">{coinData.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {coinData.website && (
                  <a href={coinData.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <ExternalLink size={16} className="text-gray-400" />
                  </a>
                )}
                {coinData.twitter && (
                  <a href={coinData.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="text-gray-400 text-sm">X</span>
                  </a>
                )}
                {coinData.telegram && (
                  <a href={coinData.telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="text-gray-400 text-sm">TG</span>
                  </a>
                )}
              </div>
            </div>

            {/* Price & Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
              <div>
                <div className="text-sm text-gray-400">Price</div>
                <div className="text-2xl font-bold">{coinData.price}</div>
                <div className={`text-sm ${coinData.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {coinData.change24h}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Market Cap</div>
                <div className="text-xl font-bold">{coinData.mcap}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">24h Volume</div>
                <div className="text-xl font-bold">{coinData.volume}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Holders</div>
                <div className="text-xl font-bold">{coinData.holdersCount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-900/30 rounded-lg p-1">
            {[
              { id: 'chart', label: 'Chart', icon: TrendingUp },
              { id: 'trades', label: 'Trades', icon: DollarSign },
              { id: 'holders', label: 'Holders', icon: Users },
              { id: 'stats', label: 'Stats', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="mb-6">
            {activeTab === 'chart' && <CoinChart coinData={coinData} />}
            {activeTab === 'trades' && <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6 text-center text-gray-400">Recent trades will be displayed here</div>}
            {activeTab === 'holders' && <CoinHolders coinData={coinData} />}
            {activeTab === 'stats' && <CoinStats coinData={coinData} />}
          </div>
        </div>

        {/* Trading Sidebar */}
        <div className="w-96 border-l border-purple-800 bg-gray-900/30">
          <CoinTrading coinData={coinData} />
        </div>
      </div>
    </div>
  );
};

export default CoinPage;
