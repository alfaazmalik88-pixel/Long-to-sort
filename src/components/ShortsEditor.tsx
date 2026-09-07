import React, { useRef, useEffect } from 'react';
import { Clip, EditorSettings } from '../types';

interface ShortsEditorProps {
  clip: Clip | null;
  settings: EditorSettings;
  videoUrl: string | null;
}

export const ShortsEditor: React.FC<ShortsEditorProps> = ({ clip, settings, videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && clip) {
      videoRef.current.currentTime = clip.startTime;
    }
  }, [clip]);

  if (!clip || !videoUrl) return <div className="flex-1 flex items-center justify-center text-zinc-500">Select a clip to edit</div>;

  return (
    <div className="flex-1 bg-zinc-950 p-4 lg:p-8 flex items-center justify-center relative overflow-hidden">
      <div className="relative aspect-[9/16] h-full max-h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-zinc-800">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          crossOrigin="anonymous"
          playsInline
        />
        
        {/* Fake title overlay for preview */}
        <div className="absolute bottom-[2%] left-0 right-0 text-center pointer-events-none">
          <span 
            className="font-bold text-white tracking-wide" 
            style={{ 
              fontSize: 'clamp(0.875rem, 2.5vh, 1.5rem)',
              textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
            }}
          >
            {clip.title}
          </span>
        </div>
      </div>
    </div>
  );
};
