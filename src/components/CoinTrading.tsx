
import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Settings } from 'lucide-react';

interface CoinTradingProps {
  coinData: {
    symbol: string;
    name: string;
    price: string;
    address: string;
  };
}

export const CoinTrading = ({ coinData }: CoinTradingProps) => {
  const [tradeMode, setTradeMode] = useState<'fixed' | 'percentage'>('fixed');
  const [buyPresets, setBuyPresets] = useState([0.01, 0.1, 0.5, 1]);
  const [sellPresets, setSellPresets] = useState([25, 50, 75, 100]);
  const [slippage, setSlippage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTrade, setLastTrade] = useState<{ type: string; amount: string; token: string } | null>(null);
  const [holdings, setHoldings] = useState({
    tokens: 1250000,
    solValue: 1.247,
    usdValue: 125.34,
    pnl: '+$23.45',
    pnlPercent: '+23.1%'
  });

  const handleQuickBuy = async (amount: number) => {
    setIsExecuting(true);
    console.log(`Executing quick buy: ${amount} SOL for ${coinData.symbol}`);
    
    setTimeout(() => {
      const newTokens = amount * 89456; // Mock calculation
      setHoldings(prev => ({
        ...prev,
        tokens: prev.tokens + newTokens,
        solValue: prev.solValue + amount,
        usdValue: prev.usdValue + (amount * 98.45),
        pnl: '+$' + (parseFloat(prev.pnl.replace(/[$+]/g, '')) + (amount * 5.2)).toFixed(2),
        pnlPercent: '+' + (parseFloat(prev.pnlPercent.replace(/[%+]/g, '')) + 2.1).toFixed(1) + '%'
      }));
      setLastTrade({ type: 'buy', amount: `${amount} SOL`, token: coinData.symbol });
      setIsExecuting(false);
    }, 2000);
  };

  const handleQuickSell = async (percentage: number) => {
    setIsExecuting(true);
    const sellAmount = tradeMode === 'percentage' 
      ? (holdings.tokens * percentage / 100).toLocaleString()
      : `${percentage}`;
    
    console.log(`Executing quick sell: ${percentage}% of ${coinData.symbol} for SOL`);
    
    setTimeout(() => {
      if (tradeMode === 'percentage') {
        const tokensToSell = holdings.tokens * percentage / 100;
        const solReceived = tokensToSell * 0.000012456; // Mock price
        setHoldings(prev => ({
          ...prev,
          tokens: prev.tokens - tokensToSell,
          solValue: prev.solValue + solReceived,
          usdValue: prev.usdValue - (tokensToSell * 0.000012456 * 98.45),
        }));
      }
      setLastTrade({ type: 'sell', amount: `${sellAmount} ${coinData.symbol}`, token: 'SOL' });
      setIsExecuting(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Instant Trade</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setTradeMode('fixed')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                tradeMode === 'fixed'
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              SOL
            </button>
            <button
              onClick={() => setTradeMode('percentage')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                tradeMode === 'percentage'
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              %
            </button>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <Settings size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Platform Fee Notice */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Target size={14} className="text-purple-400" />
          <span className="text-xs text-purple-400">Platform Fee: 0.25% • Jupiter Best Route</span>
        </div>
      </div>

      {/* Trade Execution Feedback */}
      {isExecuting && (
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            <span className="text-sm text-purple-400">Executing trade...</span>
          </div>
        </div>
      )}

      {/* Last Trade Feedback */}
      {lastTrade && !isExecuting && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-400">
              {lastTrade.type === 'buy' ? 'Buy' : 'Sell'} executed: {lastTrade.amount}
            </span>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
          <h4 className="font-bold mb-3">Settings</h4>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Slippage (%)</label>
            <div className="flex space-x-1">
              {[0.5, 1, 2, 5].map(value => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    slippage === value
                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                      : 'bg-gray-800 border border-gray-700 text-gray-300'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Holdings Display */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
        <h4 className="font-bold mb-3">Your Holdings</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Tokens</span>
            <span className="font-bold">{holdings.tokens.toLocaleString()} {coinData.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">SOL Value</span>
            <span className="font-bold">{holdings.solValue.toFixed(3)} SOL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">USD Value</span>
            <span className="font-bold">${holdings.usdValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-2">
            <span className="text-gray-400">PnL</span>
            <div className="text-right">
              <div className="font-bold text-green-400">{holdings.pnl}</div>
              <div className="text-sm text-green-400">{holdings.pnlPercent}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Buy Buttons */}
      <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-green-400">Quick Buy</h4>
          <TrendingUp size={16} className="text-green-400" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {buyPresets.map((amount, index) => (
            <button
              key={index}
              onClick={() => handleQuickBuy(amount)}
              disabled={isExecuting}
              className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95"
            >
              {tradeMode === 'fixed' ? `${amount} SOL` : `${amount}%`}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Sell Buttons */}
      <div className="bg-gray-900/50 border border-red-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-red-400">Quick Sell</h4>
          <TrendingDown size={16} className="text-red-400" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sellPresets.map((percentage, index) => (
            <button
              key={index}
              onClick={() => handleQuickSell(percentage)}
              disabled={isExecuting || holdings.tokens === 0}
              className="py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95"
            >
              {tradeMode === 'percentage' ? `${percentage}%` : `${percentage}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
