import { useState } from 'react';
import { SolanaNavigation } from '@/components/SolanaNavigation';
import { TokenDiscovery } from '@/components/TokenDiscovery';
import { FreshTokensFeed } from '@/components/FreshTokensFeed';
import { EnhancedSniperBot } from '@/components/EnhancedSniperBot';
import { EnhancedCopyTrading } from '@/components/EnhancedCopyTrading';
import { RuggerWatchlist } from '@/components/RuggerWatchlist';
import { EnhancedPortfolio } from '@/components/EnhancedPortfolio';
import { SolanaWalletConnector } from '@/components/SolanaWalletConnector';

const EnhancedIndex = () => {
  const [activeTab, setActiveTab] = useState('discovery');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'discovery':
        return <TokenDiscovery />;
      case 'fresh':
        return <FreshTokensFeed />;
      case 'sniper':
        return <EnhancedSniperBot />;
      case 'copy':
        return <EnhancedCopyTrading />;
      case 'rugwatch':
        return <RuggerWatchlist />;
      case 'analytics':
        return <EnhancedPortfolio />;
      default:
        return <TokenDiscovery />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-purple-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Solana Trading Terminal
            </div>
            <div className="text-xs text-gray-400 bg-purple-800 px-2 py-1 rounded">
              REAL-TIME • JUPITER • BIRDEYE • TELEGRAM
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-400">
              Platform Fee: 0.25% • MEV Protected
            </div>
            <SolanaWalletConnector />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <SolanaNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default EnhancedIndex;