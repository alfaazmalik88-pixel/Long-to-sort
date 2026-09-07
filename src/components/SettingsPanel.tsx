import React from 'react';
import { EditorSettings, Clip } from '../types';
import { Sliders, Clock, List, LayoutTemplate, Type, FileText, Smartphone, Monitor, Square, Cpu, Zap } from 'lucide-react';
import { cn } from '../utils';

interface SettingsPanelProps {
  settings: EditorSettings;
  setSettings: (s: EditorSettings) => void;
  onExport: () => void;
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  onExportAll: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  setSettings,
  onExport,
  clips,
  selectedClipId,
  onSelectClip,
  onExportAll,
}) => {
  return (
    <div className="w-full lg:w-96 bg-[#0a0a0a] border-t lg:border-t-0 lg:border-l border-zinc-900 flex flex-col lg:h-full overflow-y-auto custom-scrollbar shrink-0">
      <div className="p-4 border-b border-zinc-900 flex items-center gap-3">
        <Sliders className="w-5 h-5 text-zinc-300" />
        <h2 className="text-lg font-medium text-zinc-200">Editor Settings</h2>
      </div>
      
      <div className="p-4 space-y-8 flex-1">
        {/* Clip Length */}
        <div className="space-y-4">
          <label className="text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4" />
            TARGET CLIP LENGTH
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 60, label: '1 Min' },
              { value: 90, label: '1.5 Min' },
              { value: 120, label: '2 Min' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSettings({...settings, clipDuration: option.value})}
                className={cn(
                  "py-2.5 rounded-xl border transition-all text-sm font-medium",
                  settings.clipDuration === option.value
                    ? "bg-indigo-900/30 border-indigo-700 text-indigo-300"
                    : "bg-transparent border-zinc-800 text-zinc-400"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Select Part */}
        <div className="space-y-4">
          <label className="text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <List className="w-4 h-4" />
            SELECT PART TO EDIT
          </label>
          <div className="bg-indigo-900/10 border border-indigo-900/30 rounded-xl p-3 flex items-center justify-between cursor-pointer">
            <span className="text-indigo-300 text-sm font-medium">Part {clips.findIndex(c => c.id === selectedClipId) + 1 || 1} <span className="opacity-50 text-xs">({clips.find(c => c.id === selectedClipId)?.duration || 60}s)</span></span>
            <div className="w-4 h-4 rounded-full bg-indigo-500/20"></div>
          </div>
        </div>

        {/* Format */}
        <div className="space-y-4">
          <label className="text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" />
            FORMAT
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setSettings({...settings, format: 'shorts'})} className={cn("py-3 rounded-xl border flex flex-col items-center gap-2", settings.format === 'shorts' ? "bg-indigo-900/30 border-indigo-700 text-indigo-300" : "bg-transparent border-zinc-800 text-zinc-400")}>
               <Smartphone className="w-5 h-5" />
               <span className="text-xs font-medium">Shorts</span>
            </button>
            <button onClick={() => setSettings({...settings, format: 'square'})} className={cn("py-3 rounded-xl border flex flex-col items-center gap-2", settings.format === 'square' ? "bg-indigo-900/30 border-indigo-700 text-indigo-300" : "bg-transparent border-zinc-800 text-zinc-400")}>
               <Square className="w-5 h-5" />
               <span className="text-xs font-medium">Square</span>
            </button>
            <button onClick={() => setSettings({...settings, format: 'landscape'})} className={cn("py-3 rounded-xl border flex flex-col items-center gap-2", settings.format === 'landscape' ? "bg-indigo-900/30 border-indigo-700 text-indigo-300" : "bg-transparent border-zinc-800 text-zinc-400")}>
               <Monitor className="w-5 h-5" />
               <span className="text-xs font-medium">Landscape</span>
            </button>
          </div>
        </div>

        {/* Caption Style */}
        <div className="space-y-4">
          <label className="text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Type className="w-4 h-4" />
            CAPTION STYLE
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'hormozi', name: 'Hormozi', desc: 'LOUD & BOLD' },
              { id: 'neon', name: 'Neon', desc: 'GLOWING' },
              { id: 'minimal', name: 'Minimal', desc: 'Clean Box' },
              { id: 'karaoke', name: 'Karaoke', desc: 'Word-by-word' }
            ].map(style => (
              <button key={style.id} onClick={() => setSettings({...settings, captionStyle: style.id as any})} className={cn("p-3 rounded-xl border text-left flex flex-col gap-1 relative", settings.captionStyle === style.id ? "bg-indigo-900/20 border-indigo-700" : "bg-[#111] border-zinc-800")}>
                 <span className={cn("text-sm font-medium", settings.captionStyle === style.id ? "text-indigo-400" : "text-zinc-300")}>{style.name}</span>
                 <span className="text-[10px] text-zinc-500">{style.desc}</span>
                 {settings.captionStyle === style.id && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Overlays */}
        <div className="space-y-4">
          <label className="text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4" />
            OVERLAYS
          </label>
          <div className="space-y-2">
             <div className="flex items-center justify-between p-3">
                <span className="text-sm text-zinc-300">Audio Waveform</span>
                <button onClick={() => setSettings({...settings, audioWaveform: !settings.audioWaveform})} className={cn("w-10 h-6 rounded-full transition-colors relative", settings.audioWaveform ? "bg-indigo-600" : "bg-zinc-800")}>
                   <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", settings.audioWaveform ? "left-5" : "left-1")}></div>
                </button>
             </div>
             <div className="flex items-center justify-between p-3">
                <span className="text-sm text-zinc-300">Title Sticker</span>
                <button onClick={() => setSettings({...settings, titleSticker: !settings.titleSticker})} className={cn("w-10 h-6 rounded-full transition-colors relative", settings.titleSticker ? "bg-indigo-600" : "bg-zinc-800")}>
                   <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", settings.titleSticker ? "left-5" : "left-1")}></div>
                </button>
             </div>
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-zinc-900 space-y-3 bg-[#0a0a0a]">
        <button onClick={onExport} className="w-full py-3.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-800 rounded-xl font-medium transition-colors">Render Current Part</button>
        <button onClick={onExportAll} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">Render All Parts ({clips.length})</button>
      </div>
    </div>
  );
};
