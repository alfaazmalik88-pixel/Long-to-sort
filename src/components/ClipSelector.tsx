import React from 'react';
import { Play, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Clip } from '../types';
import { cn, formatTime } from '../utils';
import { AdBanner } from './AdBanner';

interface ClipSelectorProps {
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  onRenderAll?: () => void;
}

export const ClipSelector: React.FC<ClipSelectorProps> = ({ clips, selectedClipId, onSelectClip, onRenderAll }) => {
  return (
    <div className="flex-1 flex overflow-hidden bg-zinc-950">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-100">AI Segmented Clips</h2>
            <p className="text-zinc-400 text-sm md:text-base mt-1">Video divided into {clips.length} consecutive parts.</p>
          </div>
          {onRenderAll && clips.length > 0 && (
            <button
              onClick={onRenderAll}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Export All Clips
            </button>
          )}
        </div>

        <div className="grid gap-4 md:gap-6 overflow-y-auto pb-8 pr-2 md:pr-4 custom-scrollbar">
          {clips.map((clip) => {
            const isSelected = selectedClipId === clip.id;
            return (
              <div
                key={clip.id}
                onClick={() => onSelectClip(clip.id)}
                className={cn(
                  "flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group hover:-translate-y-1",
                  isSelected
                    ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                {/* Mock Thumbnail */}
                <div className="w-full md:w-64 h-48 md:h-36 bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-800 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mix-blend-overlay"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(clip.duration)}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                        {clip.title}
                      </h3>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                      "{clip.transcript}"
                    </p>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-emerald-400">
                          {clip.viralityScore}/100
                        </div>
                        <div className="text-xs text-zinc-500">Virality Score</div>
                      </div>
                    </div>

                    <div className="h-8 w-px bg-zinc-800"></div>

                    <div>
                      <div className="text-sm font-semibold text-zinc-300">
                        {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                      </div>
                      <div className="text-xs text-zinc-500">Timestamp</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 shrink-0">
          <AdBanner />
        </div>
      </div>
    </div>
  );
};
