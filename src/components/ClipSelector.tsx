import React from 'react';
import { Clip } from '../types';
import { formatTime, cn } from '../utils';
import { Scissors, Zap } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface ClipSelectorProps {
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  onRenderAll: () => void;
}

export const ClipSelector: React.FC<ClipSelectorProps> = ({ clips, selectedClipId, onSelectClip, onRenderAll }) => {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto bg-zinc-950">
      <div className="max-w-4xl w-full mx-auto space-y-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-zinc-100">
            <Scissors className="w-6 h-6 text-indigo-400" />
            Video Parts ({clips.length})
          </h2>
          <button 
            onClick={onRenderAll} 
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/50 transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Render All
          </button>
        </div>
        
        <AdBanner />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clips.map(clip => (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip.id)}
              className={cn(
                "p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-1",
                selectedClipId === clip.id 
                  ? "bg-indigo-500/10 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50" 
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg text-zinc-100">{clip.title}</h3>
                <span className="text-xs font-bold px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-300 shadow-inner">
                  {formatTime(clip.duration)}
                </span>
              </div>
              <div className="flex items-center text-sm text-zinc-500 font-medium">
                <span>{formatTime(clip.startTime)}</span>
                <span className="mx-2 text-zinc-700">-</span>
                <span>{formatTime(clip.endTime)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {clips.length > 3 && <AdBanner />}
      </div>
    </div>
  );
};
