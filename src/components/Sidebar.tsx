import React from 'react';
import { Scissors, Upload, Download, Wand2 } from 'lucide-react';
import { cn } from '../utils';

interface SidebarProps {
  activeTab: 'upload' | 'clips' | 'editor' | 'export';
  setActiveTab: (tab: 'upload' | 'clips' | 'editor' | 'export') => void;
  activeRenderCount?: number;
  onOpenAuth?: () => void;
  onOpenPricing?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeRenderCount = 0
}) => {
  const navItems = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'clips', label: 'AI Clips', icon: Wand2 },
    { id: 'editor', label: 'Editor', icon: Scissors },
    { id: 'export', label: 'Download', icon: Download, badge: activeRenderCount > 0 ? activeRenderCount : undefined },
  ] as const;

  return (
    <div className="w-full md:w-20 lg:w-24 bg-zinc-950/90 backdrop-blur-xl border-t md:border-t-0 md:border-r border-zinc-800/80 flex flex-row md:flex-col shrink-0 z-50 fixed bottom-0 left-0 right-0 md:relative h-[66px] md:h-full justify-between shadow-2xl touch-manipulation select-none">
      <nav className="flex-1 flex flex-row md:flex-col px-3 py-1.5 md:py-8 gap-2 justify-around md:justify-start w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 p-2 md:py-3.5 rounded-2xl transition-all duration-200 flex-1 md:flex-none font-semibold cursor-pointer relative group",
                isActive
                  ? "text-indigo-400 bg-indigo-500/15 shadow-sm shadow-indigo-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/60"
              )}
            >
              {/* Active Left/Top Indicator Pill */}
              {isActive && (
                <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-md shadow-indigo-500/50" />
              )}
              {isActive && (
                <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-b-full shadow-md shadow-indigo-500/50" />
              )}

              <div className="relative">
                <item.icon className={cn(
                  "w-5 h-5 md:w-5 md:h-5 transition-transform group-hover:scale-110",
                  isActive ? "stroke-[2.5]" : "stroke-[1.8]"
                )} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-[9px] font-black shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] md:text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
