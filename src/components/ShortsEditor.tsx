import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Clip, EditorSettings } from '../types';
import { Smartphone, Eye, EyeOff, ChevronRight, ChevronLeft, Crop, Maximize2, Play, Pause } from 'lucide-react';

interface ShortsEditorProps {
  clip: Clip | null;
  settings: EditorSettings;
  setSettings?: (s: EditorSettings) => void;
  videoUrl: string | null;
  clips?: Clip[];
  onSelectClip?: (id: string) => void;
  serverPath?: string | null;
  onUpdateClipSubtitles?: (clipId: string, subtitles: any[]) => void;
}

export const ShortsEditor: React.FC<ShortsEditorProps> = ({ 
  clip, 
  settings, 
  setSettings,
  videoUrl,
  clips = [],
  onSelectClip,
  serverPath,
  onUpdateClipSubtitles
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetchingSubtitles, setIsFetchingSubtitles] = useState(false);

  // Automatically fetch subtitles from /api/gemini-transcribe if selected clip doesn't have subtitles yet
  useEffect(() => {
    if (!clip) return;
    if (clip.subtitles && clip.subtitles.length > 0) return;

    let isMounted = true;
    setIsFetchingSubtitles(true);

    const targetVideoPath = serverPath || 'public/demo-sample.mp4';
    fetch('/api/gemini-transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoPath: targetVideoPath,
        startTime: clip.startTime || 0,
        duration: clip.duration || (clip.endTime - clip.startTime) || 60,
        language: settings.subtitleLanguage || 'auto'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        setIsFetchingSubtitles(false);
        if (data && data.subtitles && Array.isArray(data.subtitles) && data.subtitles.length > 0) {
          if (onUpdateClipSubtitles) {
            onUpdateClipSubtitles(clip.id, data.subtitles);
          } else {
            // Locally attach if callback not provided
            clip.subtitles = data.subtitles;
          }
        }
      })
      .catch(err => {
        if (isMounted) setIsFetchingSubtitles(false);
        console.warn('Subtitles fetch error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [clip?.id, serverPath, settings.subtitleLanguage]);

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

  // Automatically show "part 1" on preview or custom title if user typed one
  const displayTitle = (settings.customTitle !== undefined && settings.customTitle.trim() !== '')
    ? settings.customTitle.trim()
    : 'part 1';

  // Time relative to clip start
  const relTime = Math.max(0, currentTime - (clip.startTime || 0));

  // Find active Gemini subtitle segment (absolute or relative)
  let activeSubtitle = clip.subtitles?.find((s: any) => {
    const start = Number(s.startTime !== undefined ? s.startTime : s.start);
    const end = Number(s.endTime !== undefined ? s.endTime : s.end);
    return (currentTime >= start && currentTime <= end) || (relTime >= start && relTime <= end);
  });

  // Audio speed ke saath natural match ke liye buffer if not found immediately
  if (!activeSubtitle && clip.subtitles && clip.subtitles.length > 0) {
    activeSubtitle = clip.subtitles.find((s: any) => {
      const start = Number(s.start !== undefined ? s.start : s.startTime);
      const end = Number(s.end !== undefined ? s.end : s.endTime);
      // Audio speed ke saath natural match ke liye buffer
      const naturalEnd = Math.max(end, start + 0.6);
      return (currentTime >= start && currentTime <= naturalEnd) || (relTime >= start && relTime <= naturalEnd);
    });
  }

  // If no subtitles exist in clip.subtitles, activeSubtitle remains undefined (no hardcoded fallback)
  const subtitleWords = useMemo(() => {
    if (!activeSubtitle) return [];
    if (activeSubtitle.words && activeSubtitle.words.length > 0) {
      return activeSubtitle.words;
    }
    const textStr = (activeSubtitle.text || '').trim();
    if (!textStr) return [];
    const parts = textStr.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return [];
    const segStart = Number(activeSubtitle.startTime !== undefined ? activeSubtitle.startTime : (activeSubtitle as any).start || 0);
    const segEnd = Number(activeSubtitle.endTime !== undefined ? activeSubtitle.endTime : (activeSubtitle as any).end || (segStart + 2.5));
    const totalDuration = Math.max(0.4, segEnd - segStart);
    const perWord = totalDuration / parts.length;
    return parts.map((w, idx) => ({
      word: w,
      start: Number((segStart + idx * perWord).toFixed(2)),
      end: Number((segStart + (idx + 1) * perWord).toFixed(2))
    }));
  }, [activeSubtitle]);

  // 2-3 words windowing for viral shorts (TikTok/Reels dynamic Hormozi style)
  const displayWordsWindow = useMemo(() => {
    if (!subtitleWords || subtitleWords.length === 0) return [];
    if (subtitleWords.length <= 4) return subtitleWords;

    // Window of 2-3 words around active word
    const windowSize = 3;
    const currentIdx = Math.max(0, activeWordIndex);
    const chunkStart = Math.floor(currentIdx / windowSize) * windowSize;
    return subtitleWords.slice(chunkStart, chunkStart + windowSize);
  }, [subtitleWords, activeWordIndex]);

  // Timing resolution for word highlighting directly synced with currentTime
  const currentCheckTime = currentTime;
  const relCheckTime = relTime;

  // Determine active word index with natural audio speed matching
  let activeWordIndex = subtitleWords.findIndex((w) => {
    const wStart = Number(w.start);
    const wEnd = Number(w.end);
    const naturalEnd = Math.max(wEnd, wStart + 0.35);
    return (
      (currentCheckTime >= wStart && currentCheckTime <= naturalEnd) ||
      (relCheckTime >= wStart && relCheckTime <= naturalEnd)
    );
  });

  // If between syllables or slight audio pauses, lock to the current reached word so text is ALWAYS highlighted
  if (activeWordIndex === -1 && subtitleWords.length > 0) {
    for (let i = subtitleWords.length - 1; i >= 0; i--) {
      const wStart = Number(subtitleWords[i].start);
      if (currentCheckTime >= wStart || relCheckTime >= wStart) {
        activeWordIndex = i;
        break;
      }
    }
    if (activeWordIndex === -1) {
      activeWordIndex = 0;
    }
  }

  // Caption Vertical Positioning:
  // Position subtitles near bottom with optimal clearance above Part 1 badge
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

  // Styles for the bottom Part 1 / Series Tag badge - 100% Transparent (No Black background)
  const getBadgeStyles = () => {
    return 'text-white bg-transparent font-black px-2 py-0.5 border-none shadow-none';
  };

  return (
    <div className="flex-1 bg-black p-2 sm:p-4 lg:p-6 flex flex-col items-center justify-center relative overflow-hidden w-full">
      
      {/* Top Studio Toolbar */}
      <div className="w-full max-w-sm mb-2.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
            9:16 Master Preview
          </span>
        </div>

        <div className="flex items-center gap-1.5">
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

        {/* Dynamic Alex Hormozi Animated Captions Overlay (Side flow, No upward jump, Zero black shadow) */}
        {settings.enableCaptions && activeSubtitle && (
          <div 
            style={getCaptionPositionStyle()}
            className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-20 px-2 sm:px-4 text-center overflow-hidden"
          >
            {settings.captionStyle === 'minimal' ? (
              /* Minimal: Clean white subtitle - 100% Transparent, Zero Black Shadow */
              <div 
                className="text-white font-black text-sm sm:text-lg md:text-2xl uppercase tracking-wider bg-transparent p-0 border-none shadow-none whitespace-nowrap select-none animate-in fade-in slide-in-from-right-3 duration-150"
                style={{
                  background: 'transparent',
                  backgroundColor: 'transparent',
                  WebkitTextStroke: 'none',
                  textShadow: 'none'
                }}
              >
                {activeSubtitle.text}
              </div>
            ) : (
              /* Hormozi / Kinetic: 100% Transparent, Runs smoothly from the side horizontally, No upward jumping, Zero black shadow */
              <div 
                key={activeSubtitle.id || activeSubtitle.startTime || activeSubtitle.text}
                className="flex flex-nowrap whitespace-nowrap items-center justify-center gap-2 sm:gap-3 max-w-[96%] bg-transparent p-0 border-none shadow-none overflow-x-hidden animate-in fade-in slide-in-from-right-4 duration-150"
              >
                {displayWordsWindow && displayWordsWindow.length > 0 ? (
                  displayWordsWindow.map((w, idx) => {
                    // Check if current word in window matches activeWord
                    const activeWordObj = subtitleWords[activeWordIndex];
                    const isActive = activeWordObj ? (w.word === activeWordObj.word && w.start === activeWordObj.start) : (idx === 0);
                    const highlightColor = '#FFE600';
                    
                    return (
                      <span
                        key={`${w.start}-${w.word}-${idx}`}
                        className={`text-base sm:text-xl md:text-2xl font-black uppercase tracking-wide transition-all duration-100 select-none bg-transparent inline-block ${
                          isActive
                            ? 'scale-105 z-10'
                            : 'text-white opacity-90'
                        }`}
                        style={{
                          color: isActive ? highlightColor : '#FFFFFF',
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          WebkitTextStroke: 'none',
                          textShadow: isActive 
                            ? '0 0 12px rgba(255, 230, 0, 0.75), 0 0 24px rgba(255, 230, 0, 0.35)' 
                            : 'none'
                        }}
                      >
                        {w.word}
                      </span>
                    );
                  })
                ) : (
                  <span 
                    className="text-base sm:text-xl md:text-2xl font-black uppercase text-[#FFE600] tracking-wide select-none bg-transparent whitespace-nowrap inline-block animate-in fade-in slide-in-from-right-3 duration-150"
                    style={{
                      color: '#FFE600',
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      WebkitTextStroke: 'none',
                      textShadow: '0 0 12px rgba(255, 230, 0, 0.75), 0 0 24px rgba(255, 230, 0, 0.35)'
                    }}
                  >
                    {activeSubtitle.text}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Part 1 / Series Tag Badge (Bottom Center, Zero black shadow) */}
        {settings.titleSticker && displayTitle !== '' && (
          <div className="absolute bottom-2.5 sm:bottom-3 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-20 px-3">
            <span 
              className="inline-block text-white font-black uppercase tracking-wider text-[10px] sm:text-[11px] bg-transparent p-0 border-none shadow-none select-none"
              style={{
                background: 'transparent',
                backgroundColor: 'transparent',
                WebkitTextStroke: 'none',
                textShadow: 'none'
              }}
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
