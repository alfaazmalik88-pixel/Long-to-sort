import React from 'react';
import { Scissors, Upload, Download, Wand2 } from 'lucide-react';
import { cn } from '../utils';

interface SidebarProps {
  activeTab: 'upload' | 'clips' | 'editor' | 'export';
  setActiveTab: (tab: 'upload' | 'clips' | 'editor' | 'export') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'clips', label: 'AI Clips', icon: Wand2 },
    { id: 'editor', label: 'Editor', icon: Scissors },
    { id: 'export', label: 'Export', icon: Download },
  ] as const;

  return (
    <div className="w-full md:w-24 bg-black border-t md:border-t-0 md:border-r border-zinc-900 flex flex-row md:flex-col shrink-0 z-50 fixed bottom-0 left-0 right-0 md:relative h-[65px] md:h-full">
      <nav className="flex-1 flex flex-row md:flex-col px-2 py-1 md:py-6 gap-1 justify-around md:justify-start w-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 flex-1 md:flex-none font-medium",
              activeTab === item.id
                ? "text-indigo-500"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <item.icon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[10px] md:text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
