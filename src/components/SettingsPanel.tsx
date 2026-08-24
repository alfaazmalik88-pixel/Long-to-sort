import React from 'react';
import { Type, Layout, Sliders, Smartphone, Square, Monitor, Captions, Clock, ListVideo } from 'lucide-react';
import { EditorSettings, Clip } from '../types';
import { cn } from '../utils';

interface SettingsPanelProps {
  settings: EditorSettings;
  setSettings: (settings: EditorSettings) => void;
  onExport: () => void;
  clipDuration: number;
  setClipDuration: (val: number) => void;
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  onExportAll: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  setSettings, 
  onExport,
  clipDuration,
  setClipDuration,
  clips,
  selectedClipId,
  onSelectClip,
  onExportAll
}) => {
  const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="w-full lg:w-80 bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col lg:h-full overflow-y-auto custom-scrollbar shrink-0">
      <div className="p-4 lg:p-6 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Editor Settings
        </h2>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Clip Length Selector */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Target Clip Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 60, label: '1 Min' },
              { value: 90, label: '1.5 Min' },
              { value: 120, label: '2 Min' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setClipDuration(option.value)}
                className={cn(
                  "py-2 px-1 rounded-xl border transition-all duration-200 text-xs font-medium text-center",
                  clipDuration === option.value
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Part Selector */}
        {clips.length > 0 && (
          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <ListVideo className="w-4 h-4" />
              Select Part to Edit
            </label>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
              {clips.map((clip) => (
                <button
                  key={clip.id}
                  onClick={() => onSelectClip(clip.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm transition-colors border-b border-zinc-800/50 last:border-0",
                    selectedClipId === clip.id
                      ? "bg-indigo-500/20 text-indigo-300 font-medium"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  )}
                >
                  {clip.title} <span className="text-xs text-zinc-500 ml-2">({Math.round(clip.duration)}s)</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aspect Ratio */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '9:16', icon: Smartphone, label: 'Shorts' },
              { id: '1:1', icon: Square, label: 'Square' },
              { id: '16:9', icon: Monitor, label: 'Landscape' }
            ].map((format) => (
              <button
                key={format.id}
                onClick={() => updateSetting('aspectRatio', format.id as any)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2",
                  settings.aspectRatio === format.id
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                )}
              >
                <format.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{format.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subtitles Style */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Captions className="w-4 h-4" />
            Caption Style
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'hormozi', label: 'Hormozi', preview: 'LOUD & BOLD' },
              { id: 'neon', label: 'Neon', preview: 'GLOWING' },
              { id: 'minimal', label: 'Minimal', preview: 'Clean Box' },
              { id: 'karaoke', label: 'Karaoke', preview: 'Word-by-word' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => updateSetting('subtitleStyle', style.id as any)}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-200 text-left",
                  settings.subtitleStyle === style.id
                    ? "bg-indigo-500/10 border-indigo-500"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  settings.subtitleStyle === style.id ? "text-indigo-400" : "text-zinc-300"
                )}>{style.label}</div>
                <div className="text-xs text-zinc-500">{style.preview}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Overlays */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4" />
            Overlays
          </label>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">Progress Bar</span>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                settings.showProgressBar ? "bg-indigo-500" : "bg-zinc-800"
              )}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.showProgressBar}
                  onChange={(e) => updateSetting('showProgressBar', e.target.checked)}
                />
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                  settings.showProgressBar ? "left-5" : "left-1"
                )} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">Audio Waveform</span>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                settings.showWaveform ? "bg-indigo-500" : "bg-zinc-800"
              )}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.showWaveform}
                  onChange={(e) => updateSetting('showWaveform', e.target.checked)}
                />
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                  settings.showWaveform ? "left-5" : "left-1"
                )} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">Title Sticker</span>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                settings.showTitleSticker ? "bg-indigo-500" : "bg-zinc-800"
              )}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.showTitleSticker}
                  onChange={(e) => updateSetting('showTitleSticker', e.target.checked)}
                />
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                  settings.showTitleSticker ? "left-5" : "left-1"
                )} />
              </div>
            </label>

            {settings.showTitleSticker && (
              <input
                type="text"
                placeholder="Sticker text..."
                value={settings.customTitle}
                onChange={(e) => updateSetting('customTitle', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 mt-2"
              />
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-zinc-800 shrink-0 space-y-3">
        <button
          onClick={onExport}
          className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
        >
          Render Current Part
        </button>
        <button
          onClick={onExportAll}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Render All Parts ({clips.length})
        </button>
      </div>
    </div>
  );
};
