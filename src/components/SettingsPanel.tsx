import React from 'react';
import { EditorSettings, Clip } from '../types';
import { Sliders, Clock, List, LayoutTemplate, Type, FileText, Smartphone, Monitor, Square, Cpu, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

interface SettingsPanelProps {
  settings: EditorSettings;
  setSettings: (s: EditorSettings) => void;
  onExport: () => void;
  onExportAll: () => void;
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  isServerUploading?: boolean;
  serverUploadProgress?: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  setSettings,
  onExport,
  onExportAll,
  clips,
  selectedClipId,
  onSelectClip,
  isServerUploading = false,
  serverUploadProgress = 100,
}) => {
  const activeClip = clips.find(c => c.id === selectedClipId) || clips[0];
  const currentTitleValue = settings.customTitle !== undefined ? settings.customTitle : '';
  const currentIndex = clips.findIndex(c => c.id === selectedClipId);

  const handleNextPart = () => {
    if (clips.length <= 1) return;
    const nextIdx = (currentIndex + 1) % clips.length;
    onSelectClip(clips[nextIdx].id);
  };

  const handlePrevPart = () => {
    if (clips.length <= 1) return;
    const prevIdx = (currentIndex - 1 + clips.length) % clips.length;
    onSelectClip(clips[prevIdx].id);
  };

  return (
    <div className="w-full lg:w-96 bg-zinc-950/95 border-t lg:border-t-0 lg:border-l border-zinc-800/80 flex flex-col lg:h-full overflow-y-auto custom-scrollbar shrink-0 backdrop-blur-xl">
      
      {/* Panel Header */}
      <div className="p-4 md:p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Studio Controls</h2>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          GPU Accel
        </span>
      </div>
      
      <div className="p-4 md:p-5 space-y-6 flex-1">
        
        {/* Clip Length Selector */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Target Clip Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 30, label: '30s', sub: 'Short' },
              { value: 60, label: '60s', sub: 'Reels' },
              { value: 90, label: '90s', sub: 'TikTok' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSettings({...settings, clipDuration: option.value})}
                className={cn(
                  "py-2.5 px-2 rounded-2xl border transition-all text-center cursor-pointer",
                  settings.clipDuration === option.value
                    ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                )}
              >
                <div className="text-xs font-bold">{option.label}</div>
                <div className="text-[10px] text-zinc-500">{option.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Video Parts Navigation */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <List className="w-3.5 h-3.5 text-cyan-400" />
              Video Parts ({clips.length})
            </label>

            {clips.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevPart}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-semibold border border-zinc-800 cursor-pointer"
                  title="Previous Part"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={handleNextPart}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                  title="Open Next Part"
                >
                  <span>Agla Part</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Clickable Part Pills */}
          <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {clips.map((c, idx) => {
                const isSelected = c.id === selectedClipId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectClip(c.id)}
                    className={cn(
                      "py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer relative",
                      isSelected
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30 font-bold ring-1 ring-indigo-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-medium"
                    )}
                  >
                    <div className="text-xs font-bold">Part {idx + 1}</div>
                    <div className="text-[10px] opacity-75">{Number(c.duration).toFixed(1)}s</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Part / Series Tag Text Input (Optional) */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              Series Tag / Text (Sabse Niche Chhota Sa)
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={currentTitleValue}
              onChange={(e) => setSettings({ ...settings, customTitle: e.target.value })}
              placeholder={activeClip ? activeClip.title.toLowerCase() : "part 1"}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
            />
          </div>
          <p className="text-[10px] text-zinc-500">
            Khali chhodne par automatically sabse niche chhota sa "{activeClip ? activeClip.title.toLowerCase() : 'part 1'}" dikhega.
          </p>
        </div>

        {/* Format Switcher */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
            Video Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'shorts', label: '9:16', sub: 'Vertical', icon: Smartphone },
              { id: 'square', label: '1:1', sub: 'Square', icon: Square },
              { id: 'landscape', label: '16:9', sub: 'Cinema', icon: Monitor }
            ].map((f) => {
              const Icon = f.icon;
              const isSelected = settings.format === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSettings({...settings, format: f.id as any})}
                  className={cn(
                    "py-3 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer",
                    isSelected
                      ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  )}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-xs font-bold">{f.label}</span>
                  <span className="text-[10px] text-zinc-500">{f.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtitle Style Presets */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Subtitle Style Presets
            </label>
            <span className="text-[10px] text-indigo-400 font-medium">Click to select</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { 
                id: 'hormozi', 
                name: 'Hormozi Style', 
                desc: 'Bold uppercase, white text, active spoken word highlights in bright yellow/green',
                preview: 'bg-zinc-950 border border-yellow-400/80 text-yellow-300 font-black uppercase px-2 py-0.5 rounded text-[10px]' 
              },
              { 
                id: 'minimal', 
                name: 'Minimal Style', 
                desc: 'Clean white subtitle with subtle black background',
                preview: 'bg-black/80 border border-white/20 text-white font-bold px-2 py-0.5 rounded text-[10px]' 
              }
            ].map(style => {
              const isSelected = settings.captionStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, captionStyle: style.id as any }))}
                  className={cn(
                    "p-3 rounded-2xl border text-left flex flex-col gap-2 relative transition-all cursor-pointer",
                    isSelected
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500"
                      : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-bold", isSelected ? "text-white" : "text-zinc-300")}>
                      {style.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
                    )}
                  </div>
                  
                  {/* Live Mini Preview Swatch */}
                  <div className="flex items-center">
                    <span className={style.preview}>WORD HIGHLIGHT</span>
                  </div>

                  <span className="text-[10px] text-zinc-500 leading-snug">{style.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Caption Vertical Position Selector (Niche / Middle) */}
        {settings.enableCaptions && (
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Caption Position (Niche / Height)
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold">
                {settings.captionPosition === 'middle' ? 'Center (50%)' : settings.captionPosition === 'lower' ? 'Mid-Low (68%)' : 'Niche / Low (80%)'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bottom', label: 'Niche / Low', sub: '80% (Face Clear)' },
                { id: 'lower', label: 'Mid-Low', sub: '68%' },
                { id: 'middle', label: 'Center', sub: '50%' }
              ].map(pos => {
                const isSelected = (settings.captionPosition || 'bottom') === pos.id;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, captionPosition: pos.id as any }))}
                    className={cn(
                      "py-2 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5",
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-sm ring-1 ring-indigo-500"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    )}
                  >
                    <span className="text-xs font-bold">{pos.label}</span>
                    <span className="text-[9px] text-zinc-500">{pos.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Studio Controls: Overlays & Captions Toggle */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Studio Controls & Overlays
          </label>
          <div className="space-y-1.5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-2">
            
            {/* Generate Animated Captions Toggle (Default: ON) */}
            <div className="flex items-center justify-between p-2.5">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Generate Animated Captions
                </span>
                <span className="text-[10px] text-zinc-500">
                  {settings.enableCaptions ? 'Captions ON (Word-Level Sync)' : 'Captions OFF'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSettings({...settings, enableCaptions: !settings.enableCaptions})}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                  settings.enableCaptions ? "bg-indigo-600" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  settings.enableCaptions ? "left-6" : "left-1"
                )} />
              </button>
            </div>

            {/* Part 1 Series Tag Toggle */}
            <div className="flex items-center justify-between p-2.5 border-t border-zinc-800/40">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5 text-amber-400" />
                  Part 1 Series Tag Badge
                </span>
                <span className="text-[10px] text-zinc-500">
                  {settings.titleSticker ? 'Part Tag ON (Shows Part 1, Part 2)' : 'Part Tag OFF'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSettings({...settings, titleSticker: !settings.titleSticker})}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                  settings.titleSticker ? "bg-indigo-600" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  settings.titleSticker ? "left-6" : "left-1"
                )} />
              </button>
            </div>

            {/* Audio Waveform Bars Toggle */}
            <div className="flex items-center justify-between p-2.5 border-t border-zinc-800/40">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-300">Audio Waveform Bars</span>
                <span className="text-[10px] text-zinc-500">
                  {settings.audioWaveform ? 'Waveform ON' : 'Waveform OFF'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSettings({...settings, audioWaveform: !settings.audioWaveform})}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                  settings.audioWaveform ? "bg-indigo-600" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  settings.audioWaveform ? "left-6" : "left-1"
                )} />
              </button>
            </div>

          </div>
        </div>

        {/* Render Action Buttons */}
        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={onExport}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition-all cursor-pointer active:scale-98 shadow-sm flex items-center justify-center gap-2"
          >
            <span>Render Current Part Only</span>
          </button>

          <button
            type="button"
            onClick={onExportAll}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-black text-xs md:text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Render All {clips.length} Parts (Full HD)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
