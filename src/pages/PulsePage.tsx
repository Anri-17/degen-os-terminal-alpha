import { useState, useEffect } from 'react';
import { AxiomHeader } from '@/components/axiom/AxiomHeader';
import { AxiomSidebar } from '@/components/axiom/AxiomSidebar';
import { PulseView } from '@/components/axiom/PulseView';
import { useRealTimeTokens } from '@/hooks/useRealTimeTokens';

const PulsePage = () => {
  const [activeTab, setActiveTab] = useState('pulse');
  const { tokens, isConnected } = useRealTimeTokens();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AxiomHeader />
      <div className="flex">
        <AxiomSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          <PulseView tokens={tokens} />
        </main>
      </div>
    </div>
  );
};

export default PulsePage;