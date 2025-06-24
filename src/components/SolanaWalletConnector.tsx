
import { useState } from 'react';
import { Wallet, ChevronDown } from 'lucide-react';

export const SolanaWalletConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
    setShowDropdown(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowDropdown(false);
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-white hover:from-purple-600 hover:to-pink-600 transition-all"
      >
        <Wallet size={18} />
        <span>Connect Phantom</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-purple-700 rounded-lg text-white hover:bg-gray-700 transition-all"
      >
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
        <span className="font-mono text-sm">7fUf...kL9x</span>
        <ChevronDown size={16} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-purple-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-purple-700">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="font-bold text-purple-400">2.47 SOL</div>
          </div>
          <div className="p-2">
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
