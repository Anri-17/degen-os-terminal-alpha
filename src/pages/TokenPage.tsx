import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AxiomHeader } from '@/components/axiom/AxiomHeader';
import { TokenChart } from '@/components/axiom/TokenChart';
import { TokenTrading } from '@/components/axiom/TokenTrading';
import { useTokenData } from '@/hooks/useTokenData';

const TokenPage = () => {
  const { address } = useParams<{ address: string }>();
  const { token, loading } = useTokenData(address);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-400">Loading token data...</div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">Token not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AxiomHeader />
      <div className="flex">
        <div className="flex-1 p-4">
          <TokenChart token={token} />
        </div>
        <div className="w-80 border-l border-gray-800">
          <TokenTrading token={token} />
        </div>
      </div>
    </div>
  );
};

export default TokenPage;