import { useState, useEffect } from 'react';

interface WalletInfo {
  address: string;
  balance: number;
  connected: boolean;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    balance: 0,
    connected: false
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    try {
      setIsConnecting(true);
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddress = '7fUf4QzKwVGkL9xM2aP...kL9x';
      const mockBalance = 2.47;
      
      setWallet({
        address: mockAddress,
        balance: mockBalance,
        connected: true
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet({
      address: '',
      balance: 0,
      connected: false
    });
  };

  const executeTransaction = async (transaction: any) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Simulate transaction execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      return {
        success: true,
        txHash
      };
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  };

  return {
    wallet,
    isConnecting,
    connect,
    disconnect,
    executeTransaction
  };
};