import { useState, useEffect } from 'react';
import { Copy, TrendingUp, Users, Star, Eye, Settings } from 'lucide-react';
import { useApi, apiCall } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';

interface TopWallet {
  address: string;
  name?: string;
  winRate: number;
  profit30d: number;
  trades30d: number;
  followers: number;
  strategy: string;
  avgHoldTime: string;
  successfulRugs: number;
}

interface CopyTradeConfig {
  leaderWallet: string;
  copyPercentage: number;
  maxCopyAmount: number;
  stopLoss?: number;
  takeProfit?: number;
  onlyVerifiedTokens: boolean;
  skipHighTax: boolean;
  autoSellWithLeader: boolean;
}

export const EnhancedCopyTrading = () => {
  const [userId] = useState('user_123'); // In real app, get from auth
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [copyConfig, setCopyConfig] = useState<CopyTradeConfig>({
    leaderWallet: '',
    copyPercentage: 10,
    maxCopyAmount: 0.1,
    onlyVerifiedTokens: true,
    skipHighTax: true,
    autoSellWithLeader: true
  });

  // API hooks
  const { data: topWallets, loading: walletsLoading } = useApi('/copy-trading/wallets');
  const { data: followedWallets } = useApi(`/copy-trading/following/${userId}`);
  const { data: copyTrades } = useApi(`/copy-trading/trades/${userId}?limit=10`);

  // WebSocket for real-time updates
  const { isConnected, lastMessage, subscribe } = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    if (isConnected) {
      subscribe(`copy-trade-${userId}`);
    }
  }, [isConnected, userId]);

  useEffect(() => {
    if (lastMessage && lastMessage.data.channel === `copy-trade-${userId}`) {
      // Handle real-time copy trade updates
      console.log('Copy trade update:', lastMessage.data);
    }
  }, [lastMessage, userId]);

  const handleFollowWallet = async (wallet: TopWallet) => {
    setSelectedWallet(wallet.address);
    setCopyConfig(prev => ({ ...prev, leaderWallet: wallet.address }));
    setShowConfigModal(true);
  };

  const handleUnfollowWallet = async (walletAddress: string) => {
    try {
      await apiCall('/copy-trading/unfollow', {
        method: 'POST',
        body: JSON.stringify({ userId, leaderWallet: walletAddress })
      });
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error unfollowing wallet:', error);
    }
  };

  const handleSaveCopyConfig = async () => {
    try {
      await apiCall('/copy-trading/follow', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          ...copyConfig
        })
      });
      setShowConfigModal(false);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error saving copy config:', error);
    }
  };

  const isFollowing = (walletAddress: string) => {
    return followedWallets?.some((config: any) => config.leaderWallet === walletAddress);
  };

  if (walletsLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div className="text-gray-400">Loading top wallets...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Copy size={24} className="text-blue-400" />
          <h2 className="text-2xl font-bold">Enhanced Copy Trading</h2>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm">{isConnected ? 'Live Updates' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Following</div>
              <div className="text-2xl font-bold text-blue-400">{followedWallets?.length || 0}</div>
            </div>
            <Users className="text-blue-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Copy Profit</div>
              <div className="text-2xl font-bold text-green-400">+${copyTrades?.stats?.totalProfit || '0'}</div>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Success Rate</div>
              <div className="text-2xl font-bold text-orange-400">{copyTrades?.stats?.successRate || '0'}%</div>
            </div>
            <Star className="text-orange-400" size={24} />
          </div>
        </div>
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Active Copies</div>
              <div className="text-2xl font-bold text-purple-400">{copyTrades?.total || 0}</div>
            </div>
            <Eye className="text-purple-400" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Wallets */}
        <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Top Performing Wallets</h3>
          <div className="space-y-4">
            {topWallets?.map((wallet: TopWallet, index: number) => (
              <div key={wallet.address} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                      {wallet.name?.slice(0, 2) || wallet.address.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{wallet.name || `Wallet ${index + 1}`}</div>
                      <div className="text-sm text-gray-400 font-mono">{wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}</div>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                          {wallet.strategy}
                        </div>
                        <div className="text-xs text-gray-400">
                          Avg Hold: {wallet.avgHoldTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                      <div className="font-bold text-green-400">{wallet.winRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">30d Profit</div>
                      <div className="font-bold text-green-400">+${wallet.profit30d.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Trades</div>
                      <div className="font-bold text-blue-400">{wallet.trades30d}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Rugs Avoided</div>
                      <div className="font-bold text-orange-400">{wallet.successfulRugs}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => isFollowing(wallet.address) ? handleUnfollowWallet(wallet.address) : handleFollowWallet(wallet)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      isFollowing(wallet.address)
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                        : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                    }`}
                  >
                    {isFollowing(wallet.address) ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Copy Trades */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recent Copy Trades</h3>
          <div className="space-y-3">
            {copyTrades?.data?.length > 0 ? (
              copyTrades.data.map((trade: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      trade.action === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.action === 'buy' ? 'B' : 'S'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{trade.mint.slice(0, 8)}...</div>
                      <div className="text-xs text-gray-400">{trade.leaderWallet.slice(0, 8)}... • {trade.copiedAmount} SOL</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl > 0 ? '+' : ''}${trade.pnl?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(trade.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Copy size={48} className="mx-auto mb-2 opacity-50" />
                <div>No copy trades yet</div>
                <div className="text-sm">Follow a wallet to start copy trading</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copy Trading Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Settings size={18} className="mr-2 text-blue-400" />
              Copy Trading Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Copy Percentage (%)</label>
                <input
                  type="number"
                  value={copyConfig.copyPercentage}
                  onChange={(e) => setCopyConfig({...copyConfig, copyPercentage: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-blue-700 rounded px-3 py-2 text-white"
                  min="1"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Copy Amount (SOL)</label>
                <input
                  type="number"
                  value={copyConfig.maxCopyAmount}
                  onChange={(e) => setCopyConfig({...copyConfig, maxCopyAmount: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-blue-700 rounded px-3 py-2 text-white"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
                <input
                  type="number"
                  value={copyConfig.stopLoss || ''}
                  onChange={(e) => setCopyConfig({...copyConfig, stopLoss: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full bg-gray-800 border border-blue-700 rounded px-3 py-2 text-white"
                  min="0"
                  max="100"
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Take Profit (%)</label>
                <input
                  type="number"
                  value={copyConfig.takeProfit || ''}
                  onChange={(e) => setCopyConfig({...copyConfig, takeProfit: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full bg-gray-800 border border-blue-700 rounded px-3 py-2 text-white"
                  min="0"
                  placeholder="Optional"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={copyConfig.onlyVerifiedTokens}
                    onChange={(e) => setCopyConfig({...copyConfig, onlyVerifiedTokens: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-700 border-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-300">Only copy verified tokens</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={copyConfig.skipHighTax}
                    onChange={(e) => setCopyConfig({...copyConfig, skipHighTax: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-700 border-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-300">Skip high tax tokens ({'>'} 5%)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={copyConfig.autoSellWithLeader}
                    onChange={(e) => setCopyConfig({...copyConfig, autoSellWithLeader: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-700 border-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-300">Auto-sell when leader sells</label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2 text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCopyConfig}
                className="flex-1 bg-blue-500/20 border border-blue-500/30 rounded-lg py-2 text-blue-400 hover:bg-blue-500/30 transition-all"
              >
                Start Following
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};