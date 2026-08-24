import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize2, Crop } from 'lucide-react';
import { Clip, EditorSettings } from '../types';
import { cn, formatTime } from '../utils';

interface ShortsEditorProps {
  clip: Clip | null;
  settings: EditorSettings;
  videoUrl: string | null;
}

export const ShortsEditor: React.FC<ShortsEditorProps> = ({ clip, settings, videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (clip && videoRef.current) {
      videoRef.current.currentTime = clip.startTime;
      setCurrentTime(clip.startTime);
    }
  }, [clip]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && clip) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Loop clip
      if (time >= clip.endTime) {
        videoRef.current.currentTime = clip.startTime;
      }
    }
  };

  if (!clip) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950">
        <div className="text-center text-zinc-500">
          <Crop className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a clip to start editing</p>
        </div>
      </div>
    );
  }

  // Calculate container aspect ratio
  const getAspectRatioClass = () => {
    switch (settings.aspectRatio) {
      case '9:16': return 'aspect-[9/16] w-full max-w-[360px] max-h-[calc(100vh-200px)]';
      case '1:1': return 'aspect-square w-full max-w-[500px]';
      case '16:9': return 'aspect-video w-full max-w-[800px]';
      default: return 'aspect-[9/16] max-w-[400px]';
    }
  };

  const progress = clip.duration > 0 ? ((currentTime - clip.startTime) / clip.duration) * 100 : 0;

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden min-h-[50vh]">
      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        
        {/* Real Video Player Container with Crop */}
        <div className={cn(
          "bg-black relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300",
          getAspectRatioClass()
        )}>
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              playsInline
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-black mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <span className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Video Preview</span>
              </div>
            </>
          )}

          {/* Overlays */}
          {settings.showTitleSticker && settings.customTitle && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 font-bold text-xl uppercase tracking-tight transform -rotate-2 shadow-lg">
              {settings.customTitle}
            </div>
          )}

          {/* Subtitles Overlay */}
          <div className="absolute bottom-24 left-0 right-0 flex justify-center px-8">
            <div className={cn(
              "text-center transition-all duration-200",
              settings.subtitleStyle === 'hormozi' && "text-3xl font-black uppercase text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-tight",
              settings.subtitleStyle === 'neon' && "text-2xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] uppercase",
              settings.subtitleStyle === 'minimal' && "text-lg font-medium text-white/90 bg-black/50 px-4 py-2 rounded-lg backdrop-blur",
              settings.subtitleStyle === 'karaoke' && "text-2xl font-bold text-white drop-shadow-md"
            )}>
              {settings.subtitleStyle === 'karaoke' ? (
                <span>
                  <span className="text-yellow-400">{clip.transcript.split(' ')[0]}</span> {clip.transcript.split(' ').slice(1, 4).join(' ')}...
                </span>
              ) : (
                clip.transcript.split(' ').slice(0, 5).join(' ') + "..."
              )}
            </div>
          </div>

          {settings.showWaveform && (
            <div className="absolute bottom-16 left-0 right-0 h-8 flex items-center justify-center gap-1 px-4 opacity-70">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-1 bg-white/60 rounded-full animate-pulse" style={{
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`
                }}></div>
              ))}
            </div>
          )}

          {settings.showProgressBar && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
              <div className="h-full bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}></div>
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="h-16 lg:h-20 bg-zinc-900 border-t border-zinc-800 px-4 lg:px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <span className="text-zinc-400 font-mono text-xs lg:text-sm">
            {formatTime(currentTime)} / {formatTime(clip.endTime)}
          </span>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = Math.max(clip.startTime, videoRef.current.currentTime - 5);
              }
            }}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
          <button 
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = Math.min(clip.endTime, videoRef.current.currentTime + 5);
              }
            }}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
