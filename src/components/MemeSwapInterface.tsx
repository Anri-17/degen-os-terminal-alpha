
import { useState } from 'react';
import { Zap, ArrowUpDown, Settings, TrendingUp, TrendingDown, Target, ExternalLink } from 'lucide-react';

export const MemeSwapInterface = () => {
  const [selectedMeme, setSelectedMeme] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [tradeMode, setTradeMode] = useState<'fixed' | 'percentage'>('fixed');
  const [buyPresets, setBuyPresets] = useState([0.01, 0.1, 0.5, 1]);
  const [sellPresets, setSellPresets] = useState([25, 50, 75, 100]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTrade, setLastTrade] = useState<{ type: string; amount: string; token: string } | null>(null);

  // Mock meme coin data from different platforms
  const memeCoins = [
    { 
      symbol: 'BONK', 
      name: 'Bonk Inu', 
      platform: 'Graduated',
      price: '$0.000012456',
      change24h: '+187.3%',
      volume: '$2.4M',
      mcap: '$45.2M',
      graduationStatus: 'graduated',
      launchPlatform: 'pump.fun'
    },
    { 
      symbol: 'PEPE', 
      name: 'Pepe Solana', 
      platform: 'Soon to Graduate',
      price: '$0.000001247',
      change24h: '+23.4%',
      volume: '$1.8M',
      mcap: '$28.9M',
      graduationStatus: 'soon',
      launchPlatform: 'moonshot'
    },
    { 
      symbol: 'DOGE2', 
      name: 'Doge2.0', 
      platform: 'New Launch',
      price: '$0.000000156',
      change24h: '+89.2%',
      volume: '$567K',
      mcap: '$2.1M',
      graduationStatus: 'new',
      launchPlatform: 'raydium'
    },
    { 
      symbol: 'MOONCAT', 
      name: 'Moon Cat', 
      platform: 'Pump Phase',
      price: '$0.000000034',
      change24h: '+456.7%',
      volume: '$234K',
      mcap: '$890K',
      graduationStatus: 'pumping',
      launchPlatform: 'pump.swap'
    }
  ];

  const walletBalance = 2.47; // SOL balance
  const tokenHoldings = 1250000; // Example token holdings

  const handleQuickBuy = async (amount: number) => {
    if (!selectedMeme) return;
    
    setIsExecuting(true);
    console.log(`Executing quick buy: ${amount} SOL for ${selectedMeme} via Jupiter`);
    
    // Simulate meme coin purchase with platform fee
    setTimeout(() => {
      setLastTrade({ type: 'buy', amount: `${amount} SOL`, token: selectedMeme });
      setIsExecuting(false);
    }, 2000);
  };

  const handleQuickSell = async (percentage: number) => {
    if (!selectedMeme) return;
    
    setIsExecuting(true);
    const sellAmount = tradeMode === 'percentage' 
      ? (tokenHoldings * percentage / 100).toLocaleString()
      : `${percentage}`;
    
    console.log(`Executing quick sell: ${percentage}% of ${selectedMeme} for SOL`);
    
    setTimeout(() => {
      setLastTrade({ type: 'sell', amount: `${sellAmount} ${selectedMeme}`, token: 'SOL' });
      setIsExecuting(false);
    }, 2000);
  };

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap size={24} className="text-purple-400" />
          <h2 className="text-2xl font-bold">Meme Coin Trading</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2">
            <button
              onClick={() => setTradeMode('fixed')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                tradeMode === 'fixed'
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Fixed SOL
            </button>
            <button
              onClick={() => setTradeMode('percentage')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                tradeMode === 'percentage'
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              % Holdings
            </button>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Platform Fee Notice */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Target size={16} className="text-purple-400" />
          <span className="text-sm text-purple-400">Platform Fee: 0.25% on all trades • Jupiter Best Route</span>
        </div>
      </div>

      {/* Trade Execution Feedback */}
      {isExecuting && (
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
            <span className="text-purple-400 font-medium">Executing meme coin trade via Jupiter...</span>
          </div>
        </div>
      )}

      {/* Last Trade Feedback */}
      {lastTrade && !isExecuting && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">
              {lastTrade.type === 'buy' ? 'Buy' : 'Sell'} executed: {lastTrade.amount} → {lastTrade.token}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Trading Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Slippage Tolerance (%)</label>
                <div className="flex space-x-2">
                  {[0.5, 1, 2, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                        slippage === value
                          ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-purple-700'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-gray-300">MEV Protection (Jito)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-gray-300">Platform Fee (0.25%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-purple-400 bg-gray-700 border-purple-600 rounded focus:ring-purple-500" />
                  <span className="text-sm text-gray-300">Priority Gas Fee</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meme Coin Selection */}
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Select Meme Coin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memeCoins.map((coin, index) => (
              <button
                key={index}
                onClick={() => setSelectedMeme(coin.symbol)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMeme === coin.symbol
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-800/30 hover:border-purple-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{coin.symbol}</div>
                      <div className="text-xs text-gray-400">{coin.name}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Price: </span>
                    <span className="text-white">{coin.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">24h: </span>
                    <span className={coin.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {coin.change24h}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded text-xs border ${getPlatformColor(coin.launchPlatform)}`}>
                    {coin.launchPlatform}
                  </span>
                  <span className={`text-xs font-medium ${getStatusColor(coin.graduationStatus)}`}>
                    {coin.platform}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Buy Buttons */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-green-400">Quick Buy Meme Coins</h3>
            <TrendingUp size={20} className="text-green-400" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {buyPresets.map((amount, index) => (
              <button
                key={index}
                onClick={() => handleQuickBuy(amount)}
                disabled={!selectedMeme || isExecuting}
                className="py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95"
              >
                {tradeMode === 'fixed' ? `${amount} SOL` : `${amount}%`}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Instant purchase via Jupiter • Platform fee: 0.25%
          </div>
        </div>

        {/* Token Amount Display */}
        {selectedMeme && (
          <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">You're trading</div>
              <div className="text-3xl font-bold text-purple-400 mb-2">{selectedMeme}</div>
              <div className="text-sm text-gray-400">
                Current holdings: {tokenHoldings.toLocaleString()} {selectedMeme}
              </div>
              <div className="text-sm text-gray-400">
                SOL Balance: {walletBalance} SOL
              </div>
            </div>
          </div>
        )}

        {/* Quick Sell Buttons */}
        <div className="bg-gray-900/50 border border-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-red-400">Quick Sell Meme Coins</h3>
            <TrendingDown size={20} className="text-red-400" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sellPresets.map((percentage, index) => (
              <button
                key={index}
                onClick={() => handleQuickSell(percentage)}
                disabled={!selectedMeme || isExecuting}
                className="py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95"
              >
                {tradeMode === 'percentage' ? `${percentage}%` : `${percentage}`}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Instant sell to SOL via Jupiter • Platform fee: 0.25%
          </div>
        </div>

        {/* Platform Stats */}
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
    </div>
  );
};
