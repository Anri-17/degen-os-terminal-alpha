import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Token {
  mint: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface TokenTradingProps {
  token: Token;
}

export const TokenTrading = ({ token }: TokenTradingProps) => {
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [slippage, setSlippage] = useState(1);

  const handleBuy = () => {
    console.log(`Buying ${amount} ${token.symbol}`);
    // In a real implementation, this would call the swap API
  };

  const handleSell = () => {
    console.log(`Selling ${amount} ${token.symbol}`);
    // In a real implementation, this would call the swap API
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold">Trading</div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">5m Vol</span>
          <span className="text-sm text-white">$13.8K</span>
        </div>
      </div>
      
      <div className="flex mb-4">
        <button
          onClick={() => setTradeType('buy')}
          className={`flex-1 py-2 text-center rounded-l-lg ${
            tradeType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType('sell')}
          className={`flex-1 py-2 text-center rounded-r-lg ${
            tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Sell
        </button>
      </div>
      
      <div className="flex mb-4">
        <button className="flex-1 py-2 text-center bg-gray-800 text-white rounded-l-lg">Market</button>
        <button className="flex-1 py-2 text-center bg-gray-900 text-gray-400 rounded-none">Limit</button>
        <button className="flex-1 py-2 text-center bg-gray-900 text-gray-400 rounded-r-lg">Adv.</button>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">AMOUNT</div>
        <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="bg-transparent border-none outline-none text-white w-full"
          />
          <div className="flex items-center space-x-2">
            <button className="text-blue-400">Max</button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setAmount('0.001')}
          className="py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
        >
          0.001
        </button>
        <button
          onClick={() => setAmount('0.01')}
          className="py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
        >
          0.01
        </button>
        <button
          onClick={() => setAmount('1')}
          className="py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
        >
          1
        </button>
        <button
          onClick={() => setAmount('10')}
          className="py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
        >
          10
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">50%</span>
          <div className="flex items-center space-x-1 text-yellow-500 text-xs">
            <span>TP</span>
            <span>0.01Δ</span>
          </div>
          <div className="flex items-center space-x-1 text-orange-500 text-xs">
            <span>SL</span>
            <span>0.01Δ</span>
          </div>
          <div className="text-gray-400 text-xs">Off</div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-400">Advanced Trading Strategy</span>
        </label>
      </div>
      
      <button
        onClick={tradeType === 'buy' ? handleBuy : handleSell}
        className={`w-full py-3 rounded-lg text-white font-medium mb-4 ${
          tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {tradeType === 'buy' ? `Buy ${token.symbol}` : `Sell ${token.symbol}`}
      </button>
      
      <div className="grid grid-cols-4 gap-2 mb-4 text-center text-sm">
        <div>
          <div className="text-gray-400">Bought</div>
          <div className="text-green-500">$0.174</div>
        </div>
        <div>
          <div className="text-gray-400">Sold</div>
          <div className="text-red-500">$0</div>
        </div>
        <div>
          <div className="text-gray-400">Holding</div>
          <div className="text-white">$0.136</div>
        </div>
        <div>
          <div className="text-gray-400">PnL</div>
          <div className="text-red-500">-$0.039 (-22%)</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button className="py-2 bg-blue-600 text-white rounded-lg text-xs">PRESET 1</button>
        <button className="py-2 bg-gray-800 text-gray-400 rounded-lg text-xs">PRESET 2</button>
        <button className="py-2 bg-gray-800 text-gray-400 rounded-lg text-xs">PRESET 3</button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center space-x-2 text-gray-400">
          <span className="text-sm">Token Info</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-red-500 text-sm">18.51%</div>
          <div className="text-xs text-gray-400">Top 10 H.</div>
        </div>
        <div>
          <div className="text-green-500 text-sm">0%</div>
          <div className="text-xs text-gray-400">Dev H.</div>
        </div>
        <div>
          <div className="text-orange-500 text-sm">6.85%</div>
          <div className="text-xs text-gray-400">Snipers H.</div>
        </div>
      </div>
    </div>
  );
};