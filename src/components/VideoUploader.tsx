import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileVideo, Video, X, AlertCircle } from 'lucide-react';
import { VideoState } from '../types';

interface VideoUploaderProps {
  onAnalyze: (file: File | string) => void;
  status: VideoState['status'];
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onAnalyze, status }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  
  // Local state for fake upload progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingFile, setPendingFile] = useState<File | string | null>(null);

  const [showUrlNotice, setShowUrlNotice] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isUploading) {
      interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Simulate fast upload (1-5% per tick)
          return Math.min(100, prev + Math.floor(Math.random() * 10) + 5);
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  useEffect(() => {
    if (uploadProgress === 100 && pendingFile) {
      // Small delay before moving to the next screen for smooth UX
      const t = setTimeout(() => {
        onAnalyze(pendingFile);
        setIsUploading(false);
        setUploadProgress(0);
        setPendingFile(null);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [uploadProgress, pendingFile, onAnalyze]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setIsUploading(true);
      setUploadProgress(0);
    }
  };

  const handleUrlSubmit = () => {
    if (url) {
      setShowUrlNotice(true);
    }
  };

  // Calculate SVG stroke offset based on progress
  const strokeDashoffset = 251.2 - (251.2 * uploadProgress) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto my-8">
      <div className="w-full space-y-8">
        
        <div className="text-center space-y-4 flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-2">
            <img 
              src="/logo.png" 
              alt="ViralClip AI - Free Long Video to Shorts AI Converter" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const icon = document.createElement('div');
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>`;
                e.currentTarget.parentElement?.appendChild(icon);
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Long to Short AI
          </h1>
          <p className="text-zinc-400 text-sm">
            Turn long videos into viral shorts instantly.
          </p>
        </div>

        {isUploading || status === 'analyzing' ? (
          <div className="mt-8 bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center gap-6 shadow-xl animate-in fade-in zoom-in duration-300">
             
             <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full text-indigo-900 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle className="text-zinc-800 stroke-current" strokeWidth="6" cx="50" cy="50" r="40" fill="transparent"></circle>
                  <circle 
                    className="text-indigo-600 progress-ring stroke-current transition-all duration-300 ease-out" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={strokeDashoffset}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-400">
                  {uploadProgress}%
                </div>
             </div>
             
             <div className="px-4 py-1.5 rounded-full bg-indigo-900/30 border border-indigo-900 text-indigo-400 text-xs font-medium">
               Speed: {(Math.random() * 5 + 15).toFixed(1)} Mbps
             </div>
             
             <div className="space-y-1">
               <p className="text-zinc-300 font-medium">Uploading Video securely...</p>
               <p className="text-zinc-600 text-xs">Please keep this tab open while we process your video.</p>
             </div>
          </div>
        ) : (
          <div className="space-y-8 w-full mt-4">
            
            {showUrlNotice ? (
              <div className="relative bg-[#13111c] border border-indigo-500/30 p-5 rounded-2xl flex flex-col gap-3 animate-in fade-in zoom-in duration-300">
                <button 
                  onClick={() => setShowUrlNotice(false)} 
                  className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors bg-black/20 p-1.5 rounded-full"
                  aria-label="Close notice"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-4 pr-6">
                   <AlertCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                   <div>
                      <h3 className="text-base font-bold text-indigo-300">URL Upload Temporarily Unavailable</h3>
                      <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                        Due to server limits on this open-source tool, downloading directly from a URL is temporarily disabled. Please upload your video file directly from your device using the option below.
                      </p>
                      <p className="text-sm text-zinc-400 mt-3 font-medium">
                        If you still need to download or cut a video using a URL, please use our alternative tool:
                      </p>
                      <a 
                        href="https://ghost-ig512.alfaazmalik88.workers.dev/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-900/20"
                      >
                        Alternative Video Cutter 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 bg-[#0a0a0a] border border-zinc-900 p-2 rounded-2xl">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Video className="w-5 h-5 text-zinc-600" />
                  <input 
                    type="text" 
                    placeholder="Paste YouTube or Video URL" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none text-zinc-300 placeholder-zinc-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUrlSubmit();
                    }}
                  />
                </div>
                <button 
                  onClick={handleUrlSubmit}
                  className="bg-[#302759] text-indigo-300 hover:bg-[#3d3170] px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Load
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 px-8 opacity-40">
              <div className="h-px bg-zinc-700 flex-1"></div>
              <span className="text-xs font-medium text-zinc-500 uppercase">OR</span>
              <div className="h-px bg-zinc-700 flex-1"></div>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-900/10');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/10');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/10');
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setPendingFile(file);
                  setIsUploading(true);
                  setUploadProgress(0);
                }
              }}
              className="bg-[#0a0a0a] border border-zinc-900 hover:border-zinc-700 transition-all rounded-3xl p-10 text-center cursor-pointer flex flex-col items-center justify-center min-h-[240px] group"
            >
              <div className="w-16 h-16 bg-zinc-900 group-hover:bg-zinc-800 transition-colors rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-zinc-400 group-hover:text-zinc-300" />
              </div>
              <p className="text-zinc-300 font-medium mb-2">Click to upload or drag and drop</p>
              <p className="text-zinc-600 text-xs">MP4 or MOV<br/>(Supports long videos up to 120 mins)</p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};
