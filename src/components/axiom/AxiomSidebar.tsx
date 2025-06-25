import { Star, BarChart3 } from 'lucide-react';

interface AxiomSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AxiomSidebar = ({ activeTab, setActiveTab }: AxiomSidebarProps) => {
  return (
    <div className="w-16 bg-[#0a0a0a] border-r border-gray-800 flex flex-col items-center py-4 space-y-4">
      <button className="p-2 text-gray-400 hover:text-white">
        <Star className="w-5 h-5" />
      </button>
      
      <button className="p-2 text-gray-400 hover:text-white">
        <BarChart3 className="w-5 h-5" />
      </button>
    </div>
  );
};