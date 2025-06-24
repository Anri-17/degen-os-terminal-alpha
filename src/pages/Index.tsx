
import { useState } from 'react';
import { TradingDashboard } from '@/components/TradingDashboard';
import { Navigation } from '@/components/Navigation';
import { TokenAnalyzer } from '@/components/TokenAnalyzer';
import { SniperPanel } from '@/components/SniperPanel';
import { CopyTrading } from '@/components/CopyTrading';
import { WalletConnector } from '@/components/WalletConnector';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TradingDashboard />;
      case 'analyzer':
        return <TokenAnalyzer />;
      case 'sniper':
        return <SniperPanel />;
      case 'copy':
        return <CopyTrading />;
      default:
        return <TradingDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              DegenOS
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              v2.0 ALPHA
            </div>
          </div>
          <WalletConnector />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default Index;
