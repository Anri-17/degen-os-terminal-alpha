
interface CoinStatsProps {
  coinData: {
    symbol: string;
    totalSupply: string;
    liquiditySOL: string;
    createdAt: string;
    creator: string;
  };
}

export const CoinStats = ({ coinData }: CoinStatsProps) => {
  const timeframes = ['5min', '1h', '3h', '24h'];
  
  const stats = {
    '5min': {
      transactions: '1,247',
      volume: '$45.2K',
      buyers: '89',
      sellers: '76',
      avgBuy: '0.12 SOL',
      avgSell: '0.08 SOL',
      priceChange: '+2.3%',
      volumeChange: '+15.7%'
    },
    '1h': {
      transactions: '14,892',
      volume: '$567.8K',
      buyers: '1,234',
      sellers: '987',
      avgBuy: '0.15 SOL',
      avgSell: '0.11 SOL',
      priceChange: '+12.8%',
      volumeChange: '+34.2%'
    },
    '3h': {
      transactions: '43,567',
      volume: '$1.2M',
      buyers: '3,456',
      sellers: '2,987',
      avgBuy: '0.18 SOL',
      avgSell: '0.14 SOL',
      priceChange: '+45.6%',
      volumeChange: '+78.9%'
    },
    '24h': {
      transactions: '156,789',
      volume: '$2.4M',
      buyers: '12,345',
      sellers: '9,876',
      avgBuy: '0.21 SOL',
      avgSell: '0.16 SOL',
      priceChange: '+187.3%',
      volumeChange: '+234.5%'
    }
  };

  return (
    <div className="space-y-6">
      {/* Time-based Stats */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Trading Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeframes.map((timeframe) => {
            const data = stats[timeframe as keyof typeof stats];
            return (
              <div key={timeframe} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <div className="text-center mb-3">
                  <div className="text-lg font-bold text-purple-400">{timeframe.toUpperCase()}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transactions</span>
                    <span className="text-white font-medium">{data.transactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-white font-medium">{data.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Buyers</span>
                    <span className="text-green-400 font-medium">{data.buyers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sellers</span>
                    <span className="text-red-400 font-medium">{data.sellers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Buy</span>
                    <span className="text-green-400 font-medium">{data.avgBuy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Sell</span>
                    <span className="text-red-400 font-medium">{data.avgSell}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price</span>
                      <span className={`font-medium ${data.priceChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {data.priceChange}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volume</span>
                      <span className={`font-medium ${data.volumeChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {data.volumeChange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Token Information */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Token Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Supply</div>
              <div className="text-lg font-bold">{coinData.totalSupply} {coinData.symbol}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Liquidity (SOL)</div>
              <div className="text-lg font-bold">{coinData.liquiditySOL}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Created</div>
              <div className="text-lg font-bold">{new Date(coinData.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Creator</div>
              <div className="text-lg font-bold font-mono">{coinData.creator}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Circulating Supply</div>
              <div className="text-lg font-bold">{coinData.totalSupply} {coinData.symbol}</div>
              <div className="text-sm text-green-400">100% (No locks)</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Liquidity (USD)</div>
              <div className="text-lg font-bold">$122,847</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Age</div>
              <div className="text-lg font-bold">
                {Math.floor((Date.now() - new Date(coinData.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Security Score</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold text-green-400">95/100</div>
                <div className="text-sm text-green-400">✓ Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Traders */}
      <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Top Traders (24h)</h3>
        
        <div className="space-y-3">
          {[
            { address: '8xKv...9mNp', trades: 47, volume: '$12,456', pnl: '+$2,345', winRate: '89%' },
            { address: '7pLm...8xQr', trades: 32, volume: '$8,923', pnl: '+$1,567', winRate: '76%' },
            { address: '9rTn...7vBc', trades: 28, volume: '$6,789', pnl: '+$987', winRate: '71%' },
            { address: '6qWe...5dFg', trades: 24, volume: '$5,432', pnl: '+$654', winRate: '83%' },
            { address: '4hUi...3sAj', trades: 19, volume: '$3,210', pnl: '+$432', winRate: '68%' },
          ].map((trader, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-mono text-gray-300">#{index + 1}</div>
                <div className="font-mono text-white">{trader.address}</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Trades</div>
                  <div className="text-white font-medium">{trader.trades}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Volume</div>
                  <div className="text-white font-medium">{trader.volume}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">PnL</div>
                  <div className="text-green-400 font-medium">{trader.pnl}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Win Rate</div>
                  <div className="text-purple-400 font-medium">{trader.winRate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
