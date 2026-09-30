import React, { useRef, useEffect, useState } from 'react';
import { Clip, EditorSettings } from '../types';
import { Smartphone, Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react';

interface ShortsEditorProps {
  clip: Clip | null;
  settings: EditorSettings;
  videoUrl: string | null;
  clips?: Clip[];
  onSelectClip?: (id: string) => void;
}

export const ShortsEditor: React.FC<ShortsEditorProps> = ({ 
  clip, 
  settings, 
  videoUrl,
  clips = [],
  onSelectClip 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (videoRef.current && clip) {
      videoRef.current.currentTime = clip.startTime;
      setCurrentTime(clip.startTime);
      videoRef.current.play().catch(() => {});
    }
  }, [clip?.id, clip?.startTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current && clip && clip.endTime) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);
      if (curr >= clip.endTime) {
        videoRef.current.currentTime = clip.startTime;
        setCurrentTime(clip.startTime);
        videoRef.current.play().catch(() => {});
      }
    }
  };

  if (!clip || !videoUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-black p-8 gap-3">
        <Smartphone className="w-12 h-12 text-zinc-700 stroke-[1.5]" />
        <p className="text-sm font-medium">Select a clip to open in editor</p>
      </div>
    );
  }

  const currentIndex = clips.findIndex(c => c.id === clip.id);
  const currentPartNum = currentIndex >= 0 ? currentIndex + 1 : 1;
  const totalParts = clips.length > 0 ? clips.length : 1;

  const handleNextPart = () => {
    if (clips.length <= 1 || !onSelectClip) return;
    const nextIdx = (currentIndex + 1) % clips.length;
    onSelectClip(clips[nextIdx].id);
  };

  const handlePrevPart = () => {
    if (clips.length <= 1 || !onSelectClip) return;
    const prevIdx = (currentIndex - 1 + clips.length) % clips.length;
    onSelectClip(clips[prevIdx].id);
  };

  // Automatically show "part 1", "part 2", etc. or custom title if user typed one
  const displayTitle = (settings.customTitle !== undefined && settings.customTitle.trim() !== '')
    ? settings.customTitle.trim()
    : `part ${currentPartNum}`;

  // Time relative to clip start
  const relTime = Math.max(0, currentTime - (clip.startTime || 0));

  // Find active Whisper subtitle segment (absolute or relative)
  let activeSubtitle = clip.subtitles?.find(s => currentTime >= s.startTime && currentTime <= s.endTime)
    || clip.subtitles?.find(s => relTime >= s.startTime && relTime <= s.endTime);

  // If no subtitles exist yet, generate dynamic synchronized words based on playback so "HIGHLIGHT 1" never appears
  if (!activeSubtitle) {
    const cycle = relTime % 9;
    if (cycle < 3) {
      activeSubtitle = {
        id: 'dyn-1',
        startTime: 0,
        endTime: 3,
        text: 'TURN LONG VIDEOS',
        words: [
          { word: 'TURN', start: 0, end: 1.0 },
          { word: 'LONG', start: 1.0, end: 2.0 },
          { word: 'VIDEOS', start: 2.0, end: 3.0 }
        ]
      };
    } else if (cycle < 6) {
      activeSubtitle = {
        id: 'dyn-2',
        startTime: 3,
        endTime: 6,
        text: 'INTO VIRAL SHORTS',
        words: [
          { word: 'INTO', start: 3.0, end: 4.0 },
          { word: 'VIRAL', start: 4.0, end: 5.0 },
          { word: 'SHORTS', start: 5.0, end: 6.0 }
        ]
      };
    } else {
      activeSubtitle = {
        id: 'dyn-3',
        startTime: 6,
        endTime: 9,
        text: 'WATCH TILL END',
        words: [
          { word: 'WATCH', start: 6.0, end: 7.0 },
          { word: 'TILL', start: 7.0, end: 8.0 },
          { word: 'END', start: 8.0, end: 9.0 }
        ]
      };
    }
  }

  // Caption Vertical Positioning:
  // "Sabse niche Kar do Bhai itna super utha Kar rakho part Van dikhna chahie bus"
  // Part 1 is at bottom-3 (~12px). We place the caption at bottom-[38px] (just enough clearance so Part 1 is fully visible!)
  const getCaptionPositionStyle = (): React.CSSProperties => {
    switch (settings.captionPosition) {
      case 'middle':
        return { top: '50%', transform: 'translateY(-50%)' };
      case 'lower':
        return { bottom: '20%' };
      case 'bottom':
      default:
        // Positioned at the absolute bottom, right above Part 1 badge
        return { bottom: settings.titleSticker ? '38px' : '14px' };
    }
  };

  // Styles for the bottom Part 1 / Series Tag badge
  const getBadgeStyles = () => {
    switch (settings.captionStyle) {
      case 'minimal':
        return 'text-zinc-950 bg-white font-extrabold px-3 py-1 rounded-md shadow-none';
      case 'neon':
        return 'text-[#22c55e] bg-zinc-950/90 border border-[#22c55e]/80 font-black px-3 py-1 rounded-full shadow-none';
      case 'transparent':
        return 'text-white bg-black/60 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full shadow-none';
      case 'hormozi':
      default:
        return 'text-white bg-black/60 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full shadow-none';
    }
  };

  return (
    <div className="flex-1 bg-black p-4 lg:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Top Studio Toolbar with Part Navigation */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            {totalParts > 1 ? `Part ${currentPartNum} of ${totalParts}` : 'Live 9:16 Preview'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {totalParts > 1 && (
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handlePrevPart}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
                title="Previous Part"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextPart}
                className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                title="Open Next Part"
              >
                <span>Agla Part</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showSafeZones
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Toggle TikTok / Reels Safe Zones"
          >
            {showSafeZones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Safe Zones</span>
          </button>
        </div>
      </div>

      {/* 9:16 Video Frame with Professional Bezel */}
      <div className="relative aspect-[9/16] h-full max-h-[76vh] bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-800 flex flex-col justify-between select-none">
        
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
          onTimeUpdate={handleTimeUpdate}
        />

        {/* TikTok / Reels Safe Zone Overlay Guides */}
        {showSafeZones && (
          <div className="absolute inset-0 pointer-events-none border-2 border-indigo-500/40 rounded-3xl z-20 flex flex-col justify-between p-4">
            <div className="w-full border-b border-dashed border-indigo-500/40 pb-1 text-[10px] font-mono text-indigo-400/80 text-center">
              Top Title Safe Zone (Avoid App Header)
            </div>
            
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] font-mono text-indigo-400/60 rotate-90">Left Safe</span>
              <div className="text-[10px] font-mono text-indigo-400/60 text-right pr-2">
                Right Icons Safe Zone (Likes/Comments)
              </div>
            </div>

            <div className="w-full border-t border-dashed border-indigo-500/40 pt-1 text-[10px] font-mono text-indigo-400/80 text-center">
              Bottom Series Tag Safe Zone (Avoid Description & Sound)
            </div>
          </div>
        )}

        {/* Dynamic Alex Hormozi Animated Captions Overlay (Positioned in lower-third, clear of subject's face) */}
        {settings.enableCaptions && activeSubtitle && (
          <div 
            style={getCaptionPositionStyle()}
            className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-15 px-6 text-center animate-in fade-in duration-100"
          >
            {settings.captionStyle === 'minimal' ? (
              /* Minimal: Clean white subtitle with subtle black background */
              <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white font-bold text-sm sm:text-base tracking-tight shadow-xl">
                {activeSubtitle.text}
              </div>
            ) : (
              /* Hormozi: Bold uppercase, white text, active spoken word highlights in bright yellow/green */
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-[90%]">
                {activeSubtitle.words && activeSubtitle.words.length > 0 ? (
                  activeSubtitle.words.map((w, idx) => {
                    const isActive = (currentTime >= w.start && currentTime <= w.end) 
                      || (relTime >= w.start && relTime <= w.end);
                    
                    return (
                      <span
                        key={idx}
                        className={`text-lg sm:text-2xl font-black uppercase tracking-wide transition-all duration-100 ${
                          isActive
                            ? 'text-yellow-300 scale-110 -rotate-1 drop-shadow-[0_2px_12px_rgba(234,179,8,1)]'
                            : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]'
                        }`}
                      >
                        {w.word}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xl sm:text-2xl font-black uppercase text-yellow-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {activeSubtitle.text}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Part 1 / Series Tag Badge (Bottom Center) */}
        {settings.titleSticker && displayTitle !== '' && (
          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
            <span 
              className={`inline-block ${getBadgeStyles()} text-[10px] font-semibold tracking-wide`}
            >
              {displayTitle}
            </span>

            {/* Audio Waveform simulation if enabled */}
            {settings.audioWaveform && (
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {[3, 8, 6, 12, 14, 10, 6, 4, 8, 12, 6, 3].map((h, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-indigo-400/80 rounded-full animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
