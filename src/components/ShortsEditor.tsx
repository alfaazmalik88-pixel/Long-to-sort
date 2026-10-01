import React, { useRef, useEffect, useState } from 'react';
import { Clip, EditorSettings } from '../types';
import { Smartphone, Eye, EyeOff, ChevronRight, ChevronLeft, Crop, Maximize2, Play, Pause } from 'lucide-react';

interface ShortsEditorProps {
  clip: Clip | null;
  settings: EditorSettings;
  setSettings?: (s: EditorSettings) => void;
  videoUrl: string | null;
  clips?: Clip[];
  onSelectClip?: (id: string) => void;
}

export const ShortsEditor: React.FC<ShortsEditorProps> = ({ 
  clip, 
  settings, 
  setSettings,
  videoUrl,
  clips = [],
  onSelectClip 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const isCoverFit = settings.videoFit === 'cover';

  const handleLoadedMetadata = () => {
    if (videoRef.current && clip) {
      try {
        videoRef.current.currentTime = clip.startTime || 0;
        setCurrentTime(clip.startTime || 0);
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.then(() => setIsPlaying(true)).catch(() => {
            setIsPlaying(false);
          });
        }
      } catch (e) {
        console.warn('Metadata loaded seek error:', e);
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && clip) {
      if (videoRef.current.readyState >= 1) {
        try {
          videoRef.current.currentTime = clip.startTime || 0;
          setCurrentTime(clip.startTime || 0);
          const p = videoRef.current.play();
          if (p !== undefined) {
            p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        } catch (e) {
          console.warn('Play error:', e);
        }
      }
    }
  }, [clip?.id, clip?.startTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current && clip && clip.endTime) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);
      if (bgVideoRef.current && Math.abs(bgVideoRef.current.currentTime - curr) > 0.3) {
        bgVideoRef.current.currentTime = curr;
      }
      if (curr >= clip.endTime) {
        videoRef.current.currentTime = clip.startTime;
        setCurrentTime(clip.startTime);
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!clip || !videoUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-black p-8 gap-3 min-h-[300px]">
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

  const toggleFitMode = () => {
    if (!setSettings) return;
    setSettings({
      ...settings,
      videoFit: isCoverFit ? 'contain' : 'cover'
    });
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
    <div className="flex-1 bg-black p-2 sm:p-4 lg:p-6 flex flex-col items-center justify-center relative overflow-hidden w-full">
      
      {/* Top Studio Toolbar with Part Navigation & Fit Mode */}
      <div className="w-full max-w-sm mb-2.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
            {totalParts > 1 ? `Part ${currentPartNum}/${totalParts}` : '9:16 Preview'}
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
                className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                title="Open Next Part"
              >
                <span>Part {currentPartNum + 1 > totalParts ? 1 : currentPartNum + 1}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Video Fit (No Crop vs Crop 9:16) Toggle */}
          <button
            type="button"
            onClick={toggleFitMode}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
              !isCoverFit
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={!isCoverFit ? "Full Video Visible (No Crop)" : "9:16 Fill (Cropped)"}
          >
            {!isCoverFit ? (
              <>
                <Maximize2 className="w-3 h-3 text-emerald-400" />
                <span className="hidden xs:inline">No Crop</span>
                <span className="xs:hidden">Fit</span>
              </>
            ) : (
              <>
                <Crop className="w-3 h-3 text-amber-400" />
                <span>Fill 9:16</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
              showSafeZones
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Toggle TikTok / Reels Safe Zones"
          >
            {showSafeZones ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="hidden xs:inline">Safe</span>
          </button>
        </div>
      </div>

      {/* 9:16 Video Frame with Responsive Height for Mobile, Tablet & PC */}
      <div className="relative aspect-[9/16] w-auto h-full max-h-[50vh] sm:max-h-[62vh] md:max-h-[74vh] lg:max-h-[82vh] bg-zinc-950 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-800 flex flex-col justify-between select-none group">
        
        {/* Background Ambient Blur (Active during Fit mode so no black void is felt) */}
        {!isCoverFit && (
          <video
            ref={bgVideoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
            muted
            playsInline
          />
        )}

        {/* Video Element - Fit mode shows 100% video without cropping! */}
        <video
          ref={videoRef}
          src={videoUrl}
          className={`w-full h-full relative z-10 transition-all ${
            isCoverFit ? 'object-cover' : 'object-contain'
          }`}
          controls
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Quick Play/Pause overlay if paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 z-15 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors cursor-pointer"
            title="Click to Play Video"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 active:scale-95 transition-transform">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
            </div>
          </button>
        )}

        {/* TikTok / Reels Safe Zone Overlay Guides */}
        {showSafeZones && (
          <div className="absolute inset-0 pointer-events-none border-2 border-indigo-500/40 rounded-2xl sm:rounded-3xl z-20 flex flex-col justify-between p-3 sm:p-4">
            <div className="w-full border-b border-dashed border-indigo-500/40 pb-1 text-[9px] sm:text-[10px] font-mono text-indigo-400/80 text-center">
              Top Title Safe Zone (Avoid App Header)
            </div>
            
            <div className="flex justify-between items-center w-full">
              <span className="text-[9px] font-mono text-indigo-400/60 rotate-90">Left Safe</span>
              <div className="text-[9px] font-mono text-indigo-400/60 text-right pr-1">
                Right Safe Zone
              </div>
            </div>

            <div className="w-full border-t border-dashed border-indigo-500/40 pt-1 text-[9px] sm:text-[10px] font-mono text-indigo-400/80 text-center">
              Bottom Series Tag Safe Zone
            </div>
          </div>
        )}

        {/* Dynamic Alex Hormozi Animated Captions Overlay */}
        {settings.enableCaptions && activeSubtitle && (
          <div 
            style={getCaptionPositionStyle()}
            className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-20 px-3 sm:px-6 text-center animate-in fade-in duration-100"
          >
            {settings.captionStyle === 'minimal' ? (
              /* Minimal: Clean white subtitle with subtle black background */
              <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-white/10 text-white font-bold text-xs sm:text-base tracking-tight shadow-xl">
                {activeSubtitle.text}
              </div>
            ) : (
              /* Hormozi: Bold uppercase, white text, active spoken word highlights in bright yellow/green */
              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 max-w-[94%]">
                {activeSubtitle.words && activeSubtitle.words.length > 0 ? (
                  activeSubtitle.words.map((w, idx) => {
                    const isActive = (currentTime >= w.start && currentTime <= w.end) 
                      || (relTime >= w.start && relTime <= w.end);
                    
                    return (
                      <span
                        key={idx}
                        className={`text-sm sm:text-lg md:text-2xl font-black uppercase tracking-wide transition-all duration-100 ${
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
                  <span className="text-base sm:text-xl md:text-2xl font-black uppercase text-yellow-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {activeSubtitle.text}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Part 1 / Series Tag Badge (Bottom Center) */}
        {settings.titleSticker && displayTitle !== '' && (
          <div className="absolute bottom-2.5 sm:bottom-3 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-20 px-3">
            <span 
              className={`inline-block ${getBadgeStyles()} text-[9px] sm:text-[10px] font-semibold tracking-wide`}
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
