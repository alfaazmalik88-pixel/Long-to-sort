import React from 'react';
import { 
  Scissors, 
  Upload, 
  Film, 
  Settings, 
  Download, 
  Wand2 
} from 'lucide-react';
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
    <div className="w-full md:w-64 bg-zinc-950 md:border-r border-t md:border-t-0 border-zinc-800 flex flex-row md:flex-col h-auto md:h-full shrink-0 z-50">
      <div className="hidden md:flex p-6 items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Film className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          ClipGenius
        </span>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col px-2 py-2 md:px-4 md:py-4 md:space-y-2 justify-around md:justify-start">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 flex-1 md:flex-none",
              activeTab === item.id
                ? "md:bg-indigo-500/10 text-indigo-400"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <item.icon className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-base font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden md:block p-4 border-t border-zinc-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 rounded-xl transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
