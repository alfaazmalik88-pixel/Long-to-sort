import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Sparkles, Scissors, Wand2, CheckCircle2, RotateCcw, Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';

interface Demo30sSectionProps {
  onLoadDemoIntoEditor: () => void;
  isLoading?: boolean;
}

export const Demo30sSection: React.FC<Demo30sSectionProps> = ({
  onLoadDemoIntoEditor,
  isLoading
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);

  // Auto-play silently on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log("Autoplay waiting for user gesture", e);
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log(err));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full my-8 bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-48 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Demo Showcase</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            How High-Retention Shorts Are Created
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed">
            See how the AI reframes horizontal scenes, generates Part 1, Part 2 Series Tags, and prepares broadcast-ready 9:16 Shorts in seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadDemoIntoEditor}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Loading Studio...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Open This Demo in Studio</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: 9:16 Video Player (Left) + 3-Step Production Workflow (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
        
        {/* Left: 9:16 Smartphone Mockup Video Player */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[260px] aspect-[9/16] bg-black rounded-[2.2rem] border-4 border-zinc-800 shadow-2xl ring-1 ring-white/10 overflow-hidden flex flex-col justify-between group">
            
            {/* Top Phone Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-900 rounded-full z-20" />

            {/* Silent/Mute Status Indicator Pill */}
            <div 
              onClick={toggleMute}
              className="absolute top-8 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/10 text-[10px] text-zinc-300 font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3 h-3 text-zinc-400" />
                  <span>Audio Muted (Tap to unmute)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>Audio Playing</span>
                </>
              )}
            </div>

            {/* Video Element */}
            <video
              ref={videoRef}
              src="/official-demo.mp4?v=clean"
              className="w-full h-full object-cover cursor-pointer"
              playsInline
              autoPlay
              muted={isMuted}
              loop
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration || 10);
              }}
            />

            {/* Play Overlay if paused */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-20 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
                <span className="mt-3 text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-full border border-white/10">
                  ▶️ Resume Demo
                </span>
              </div>
            )}

            {/* Bottom Floating Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex flex-col gap-2">
              {/* Progress Scrubber */}
              <div className="w-full bg-zinc-700/60 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-150"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white text-[11px]">
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={togglePlay}
                    className="p-1 hover:text-indigo-400 transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button 
                    type="button" 
                    onClick={toggleMute}
                    className="p-1 hover:text-indigo-400 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>

                  <button 
                    type="button" 
                    onClick={handleRestart}
                    className="p-1 hover:text-indigo-400 transition-colors cursor-pointer"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-mono text-[10px] text-zinc-300">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: How It's Engineered (Professional 3-Step Process) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
            Automated Production Pipeline
          </span>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl border transition-all bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      AI Hook & Virality Scoring
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Viral Score: 98/100
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Speech energy, pace changes, and semantic hooks are analyzed to isolate the highest-retention moments from long-form content.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl border transition-all bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      Intelligent 9:16 Subject Re-framing
                    </h3>
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      Full-Bleed 9:16
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Active speakers and focal objects remain perfectly centered so you get clean, vertical Shorts without manual keyframing.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl border transition-all bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      Part 1, Part 2 Series Tags & Clean MP4 Export
                    </h3>
                    <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      1080p · Zero Watermark
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Clear episode tags (Part 1, Part 2) keep viewers hooked across your multi-part series, exported directly with zero watermarks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Value Props */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Commercial Use License</span>
            </div>
            <span className="text-zinc-700">·</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Instant Browser Processing</span>
            </div>
            <span className="text-zinc-700">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>100% Watermark Free</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
