import { useState } from 'react';
import { Search, Star, Bell, Wallet, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AxiomHeader = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletBalance, setWalletBalance] = useState('0.0');
  const navigate = useNavigate();

  const navItems = [
    { label: 'Discover', active: false, onClick: () => navigate('/') },
    { label: 'Pulse', active: false, onClick: () => navigate('/pulse') },
    { label: 'Trackers', active: false },
    { label: 'Perpetuals', active: false },
    { label: 'Yield', active: false },
    { label: 'Portfolio', active: false },
    { label: 'Rewards', active: false },
  ];

  const handleWalletConnect = () => {
    if (!isWalletConnected) {
      setIsWalletConnected(true);
      setWalletBalance('2.47');
    } else {
      setIsWalletConnected(false);
      setWalletBalance('0.0');
    }
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-sm">▲</span>
            </div>
            <span className="text-white font-bold text-lg">AXIOM</span>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Pro</span>
          </div>
          
          <nav className="flex items-center space-x-6">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`text-sm font-medium transition-colors ${
                  item.active ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by token or CA..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">/</span>
          </div>
        </div>

        {/* Right side - Actions and Wallet */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleWalletConnect}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isWalletConnected
                ? 'bg-gray-800 text-white border border-gray-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isWalletConnected ? 'Deposit' : 'Deposit'}
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white">
            <Star className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
            <Wallet className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-white">{walletBalance}</span>
            <span className="text-xs text-gray-400">SOL</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">0</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <button className="p-2 text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};