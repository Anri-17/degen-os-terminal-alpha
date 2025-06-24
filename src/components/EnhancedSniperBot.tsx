import { useState, useEffect } from 'react';
import { Target, Zap, Settings, Play, Pause, AlertTriangle, TrendingUp } from 'lucide-react';
import { useApi, apiCall } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SniperConfig {
  maxBuyAmount: number;
  minLiquidity: number;
  maxSlippage: number;
  minRugScore: number;
  maxTax: number;
  autoSell: boolean;
  takeProfitPercent?: number;
  stopLossPercent?: number;
}

interface SniperLog {
  id: string;
  mint: string;
  action: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
}

export const EnhancedSniperBot = () => {
  const [userId] = useState('user_123'); // In real app, get from auth
  const [sniperEnabled, setSniperEnabled] = useState(false);
  const [config, setConfig] = useState<SniperConfig>({
    maxBuyAmount: 0.1,
    minLiquidity: 10000,
    maxSlippage: 20,
    minRugScore: 80,
    maxTax: 5,
    autoSell: false,
    takeProfitPercent: 200,
    stopLossPercent: 50,
  });
  const [showSettings, setShowSettings] = useState(false);

  // API hooks
  const { data: sniperStatus, loading } = useApi(`/sniper/status/${userId}`);
  const { data: sniperLogs } = useApi(`/sniper/logs/${userId}?limit=10`);

  // WebSocket for real-time updates
  const { isConnected, lastMessage, subscribe } = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    if (isConnected) {
      subscribe(`sniper-${userId}`);
    }
  }, [isConnected, userId]);

  useEffect(() => {
    if (lastMessage && lastMessage.data.channel === `sniper-${userId}`) {
      // Handle real-time sniper updates
      console.log('Sniper update:', lastMessage.data);
    }
  }, [lastMessage, userId]);

  const handleStartSniper = async () => {
    try {
      await apiCall('/sniper/start', {
        method: 'POST',
        body: JSON.stringify({ userId, config })
      });
      setSniperEnabled(true);
    } catch (error) {
      console.error('Error starting sniper:', error);
    }
  };

  const handleStopSniper = async () => {
    try {
      await apiCall('/sniper/stop', {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      setSniperEnabled(false);
    } catch (error) {
      console.error('Error stopping sniper:', error);
    }
  };

  const handleConfigUpdate = async () => {
    try {
      await apiCall(`/sniper/config/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ config })
      });
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div className="text-gray-400">Loading sniper status...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target size={24} className="text-green-400" />
          <h2 className="text-2xl font-bold">Enhanced Auto Sniper</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
            isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button
            onClick={sniperEnabled ? handleStopSniper : handleStartSniper}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              sniperEnabled
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {sniperEnabled ? <Pause size={18} /> : <Play size={18} />}
            <span>{sniperEnabled ? 'Stop Sniping' : 'Start Sniping'}</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg border ${
        sniperEnabled 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-gray-800/50 border-gray-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${sniperEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="font-medium">
              {sniperEnabled ? 'Sniper Bot Active - Monitoring Fresh Tokens' : 'Sniper Bot Inactive'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {sniperEnabled ? 'Real-time monitoring via Solana RPC + Birdeye' : 'Configure settings to start'}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {sniperStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Snipes</div>
                <div className="text-2xl font-bold text-green-400">{sniperStatus.stats.totalSnipes}</div>
              </div>
              <Target className="text-green-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Success Rate</div>
                <div className="text-2xl font-bold text-blue-400">{sniperStatus.stats.successRate}%</div>
              </div>
              <TrendingUp className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Successful Snipes</div>
                <div className="text-2xl font-bold text-purple-400">{sniperStatus.stats.successfulSnipes}</div>
              </div>
              <Zap className="text-purple-400" size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sniper Settings */}
        <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Settings size={18} className="mr-2 text-green-400" />
              Sniper Configuration
            </h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-green-400 hover:text-green-300"
            >
              {showSettings ? 'Hide' : 'Show'} Settings
            </button>
          </div>
          
          {showSettings && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Buy Amount (SOL)</label>
                <input
                  type="number"
                  value={config.maxBuyAmount}
                  onChange={(e) => setConfig({...config, maxBuyAmount: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Min Liquidity ($)</label>
                <input
                  type="number"
                  value={config.minLiquidity}
                  onChange={(e) => setConfig({...config, minLiquidity: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Slippage (%)</label>
                <input
                  type="number"
                  value={config.maxSlippage}
                  onChange={(e) => setConfig({...config, maxSlippage: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Min Rug Score</label>
                <input
                  type="number"
                  value={config.minRugScore}
                  onChange={(e) => setConfig({...config, minRugScore: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Tax (%)</label>
                <input
                  type="number"
                  value={config.maxTax}
                  onChange={(e) => setConfig({...config, maxTax: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                  min="0"
                  max="50"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.autoSell}
                  onChange={(e) => setConfig({...config, autoSell: e.target.checked})}
                  className="w-4 h-4 text-green-400 bg-gray-700 border-green-600 rounded focus:ring-green-500"
                />
                <label className="text-sm text-gray-300">Enable Auto-Sell</label>
              </div>

              {config.autoSell && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Take Profit (%)</label>
                    <input
                      type="number"
                      value={config.takeProfitPercent}
                      onChange={(e) => setConfig({...config, takeProfitPercent: Number(e.target.value)})}
                      className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Stop Loss (%)</label>
                    <input
                      type="number"
                      value={config.stopLossPercent}
                      onChange={(e) => setConfig({...config, stopLossPercent: Number(e.target.value)})}
                      className="w-full bg-gray-800 border border-green-700 rounded px-3 py-2 text-white"
                      min="0"
                      max="100"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleConfigUpdate}
                className="w-full bg-green-500/20 border border-green-500/30 rounded-lg py-2 text-green-400 hover:bg-green-500/30 transition-all"
              >
                Update Configuration
              </button>
            </div>
          )}
        </div>

        {/* Recent Snipes */}
        <div className="bg-gray-900/50 border border-purple-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recent Snipes</h3>
          <div className="space-y-3">
            {sniperLogs && sniperLogs.length > 0 ? (
              sniperLogs.map((log: SniperLog, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {log.mint.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{log.mint.slice(0, 8)}...</div>
                      <div className="text-xs text-gray-400">{log.amount} SOL • {new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      log.status === 'success' ? 'text-green-400' : 
                      log.status === 'failed' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {log.status === 'success' ? '+$' + (log.price * log.amount * 100).toFixed(2) : 
                       log.status === 'failed' ? 'Failed' : 'Pending'}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      log.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      log.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {log.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target size={48} className="mx-auto mb-2 opacity-50" />
                <div>No snipes yet</div>
                <div className="text-sm">Start the sniper to begin monitoring</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle size={20} className="text-orange-400 mt-0.5" />
          <div className="text-sm text-orange-300">
            <div className="font-medium mb-1">Safety Notice</div>
            <div>The sniper bot uses advanced safety filters including rug score analysis, tax detection, and liquidity verification. Only tokens meeting all safety criteria will be auto-purchased. Always monitor your positions and set appropriate stop-losses.</div>
          </div>
        </div>
      </div>
    </div>
  );
};