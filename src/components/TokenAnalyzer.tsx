
import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export const TokenAnalyzer = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  const rugScoreData = {
    score: 85,
    status: 'SAFE',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
  };

  const securityChecks = [
    { name: 'Contract Verified', status: 'pass', icon: CheckCircle },
    { name: 'Liquidity Locked', status: 'pass', icon: CheckCircle },
    { name: 'Owner Renounced', status: 'pass', icon: CheckCircle },
    { name: 'No Honeypot', status: 'pass', icon: CheckCircle },
    { name: 'Low Buy/Sell Tax', status: 'warning', icon: AlertTriangle },
    { name: 'No Hidden Functions', status: 'pass', icon: CheckCircle },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield size={24} className="text-blue-400" />
        <h2 className="text-2xl font-bold">Token Security Analyzer</h2>
      </div>

      {/* Token Input */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter token contract address..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !tokenAddress}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search size={18} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Token'}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {tokenAddress && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rug Score */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Rug Score</h3>
            <div className={`text-center p-6 rounded-lg ${rugScoreData.bgColor} border ${rugScoreData.borderColor}`}>
              <div className={`text-4xl font-bold ${rugScoreData.color} mb-2`}>
                {rugScoreData.score}/100
              </div>
              <div className={`text-xl font-medium ${rugScoreData.color}`}>
                {rugScoreData.status}
              </div>
            </div>
          </div>

          {/* Security Checks */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Security Checks</h3>
            <div className="space-y-3">
              {securityChecks.map((check, index) => {
                const Icon = check.icon;
                const isPass = check.status === 'pass';
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <span className="text-sm">{check.name}</span>
                    <Icon
                      size={18}
                      className={isPass ? 'text-green-400' : 'text-orange-400'}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tax Analysis */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Tax Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Buy Tax:</span>
                <span className="text-green-400 font-medium">2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sell Tax:</span>
                <span className="text-orange-400 font-medium">5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Slippage:</span>
                <span className="text-blue-400 font-medium">12%</span>
              </div>
            </div>
          </div>

          {/* Liquidity Info */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Liquidity Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Liquidity:</span>
                <span className="text-white font-medium">$127,453</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lock Duration:</span>
                <span className="text-green-400 font-medium">365 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">LP Provider:</span>
                <span className="text-blue-400 font-medium">Unicrypt</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
