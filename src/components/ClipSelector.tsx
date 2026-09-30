import React from 'react';
import { Clip } from '../types';
import { formatTime, cn } from '../utils';
import { Scissors, Zap, Flame, Sparkles, Clock, Play, ArrowRight } from 'lucide-react';

interface ClipSelectorProps {
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  onRenderAll: () => void;
}

export const ClipSelector: React.FC<ClipSelectorProps> = ({ clips, selectedClipId, onSelectClip, onRenderAll }) => {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-black text-zinc-100">
      <div className="max-w-5xl w-full mx-auto space-y-6 pb-24 md:pb-8">
        
        {/* Top Header & Bulk Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Scissors className="w-4 h-4" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                AI Generated Shorts ({clips.length})
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Each clip is auto-cut for high retention with Part 1, Part 2 Series Tags & 9:16 framing.
            </p>
          </div>

          <button 
            onClick={onRenderAll} 
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Render All {clips.length} Clips</span>
          </button>
        </div>
        
        {/* Clips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clips.map((clip, index) => {
            const isSelected = selectedClipId === clip.id;
            // Simulated virality score for UI richness
            const simulatedScore = Math.max(88, 99 - (index * 2));
            return (
              <div
                key={clip.id}
                onClick={() => onSelectClip(clip.id)}
                className={cn(
                  "p-5 rounded-3xl border cursor-pointer transition-all duration-200 relative overflow-hidden group flex flex-col justify-between min-h-[170px]",
                  isSelected 
                    ? "bg-zinc-900 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-1 ring-indigo-500" 
                    : "bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60"
                )}
              >
                {/* Top Row: Part Name & Virality Score */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white tracking-tight">
                        {clip.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      <span>{simulatedScore}/100</span>
                    </div>
                  </div>

                  {/* Audio Waveform Simulation */}
                  <div className="flex items-center gap-1 h-6 py-1">
                    {[12, 18, 8, 22, 16, 24, 10, 14, 20, 15, 9, 22, 14, 18, 12, 8, 16, 20].map((h, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 rounded-full transition-all",
                          isSelected ? "bg-indigo-400" : "bg-zinc-700 group-hover:bg-zinc-500"
                        )}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Timecode & Open CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-900 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{formatTime(clip.startTime)} - {formatTime(clip.endTime)}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-indigo-400 font-bold">{formatTime(clip.duration)}</span>
                  </div>

                  <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 inline-flex items-center gap-1 transition-colors">
                    Edit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
