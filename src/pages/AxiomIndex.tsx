import { useState, useEffect } from 'react';
import { AxiomHeader } from '@/components/axiom/AxiomHeader';
import { AxiomSidebar } from '@/components/axiom/AxiomSidebar';
import { DEXScreener } from '@/components/axiom/DEXScreener';
import { useRealTimeTokens } from '@/hooks/useRealTimeTokens';

const AxiomIndex = () => {
  const [activeTab, setActiveTab] = useState('dex-screener');
  const { tokens, isConnected } = useRealTimeTokens();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AxiomHeader />
      <div className="flex">
        <AxiomSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          {activeTab === 'dex-screener' && <DEXScreener tokens={tokens} />}
        </main>
      </div>
    </div>
  );
};

export default AxiomIndex;