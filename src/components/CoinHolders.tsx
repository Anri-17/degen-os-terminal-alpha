interface CoinHoldersProps {
  coinData: {
    symbol: string;
    holdersCount: number;
  };
}

export const CoinHolders = ({ coinData }: CoinHoldersProps) => {
  const mockHolders = [
    { address: '8xKv...9mNp', balance: '45,234,567', percentage: '12.4%', value: '$563.45', type: 'whale' },
    { address: '7pLm...8xQr', balance: '23,456,789', percentage: '6.8%', value: '$291.78', type: 'whale' },
    { address: '9rTn...7vBc', balance: '12,345,678', percentage: '3.5%', value: '$153.67', type: 'large' },
    { address: '6qWe...5dFg', balance: '8,765,432', percentage: '2.4%', value: '$109.12', type: 'large' },
    { address: '4hUi...3sAj', balance: '5,432,109', percentage: '1.6%', value: '$67.58', type: 'medium' },
    { address: '3gTr...2kLm', balance: '3,210,987', percentage: '0.9%', value: '$39.95', type: 'medium' },
    { address: '2fYu...1pOi', balance: '1,876,543', percentage: '0.5%', value: '$23.34', type: 'small' },
    { address: '1eWq...9hNb', balance: '987,654', percentage: '0.3%', value: '$12.29', type: 'small' },
  ];

  const getHolderTypeColor = (type: string) => {
    switch (type) {
      case 'whale': return 'text-red-400 bg-red-500/10';
      case 'large': return 'text-orange-400 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'small': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Top Holders</h3>
        <div className="text-sm text-gray-400">
          Total Holders: {coinData.holdersCount.toLocaleString()}
        </div>
      </div>

      <div className="space-y-3">
        {mockHolders.map((holder, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-mono text-gray-300">{index + 1}</div>
              <div>
                <div className="font-mono text-white">{holder.address}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${getHolderTypeColor(holder.type)}`}>
                    {holder.type}
                  </span>
                  <span className="text-xs text-gray-400">{holder.percentage}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white">{holder.balance} {coinData.symbol}</div>
              <div className="text-sm text-gray-400">{holder.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
        <h4 className="font-bold mb-3">Holder Distribution</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Whales ({'>'}10%)</div>
            <div className="text-lg font-bold text-red-400">2</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Large (1-10%)</div>
            <div className="text-lg font-bold text-orange-400">8</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Medium (0.1-1%)</div>
            <div className="text-lg font-bold text-yellow-400">45</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Small ({'<'}0.1%)</div>
            <div className="text-lg font-bold text-green-400">147,837</div>
          </div>
        </div>
      </div>
    </div>
  );
};