import React, { useState, useEffect } from 'react';
import { UploadCloud, Video, Link as LinkIcon, Loader2, Shield, FileText, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '../utils';
import { AdBanner } from './AdBanner';

interface VideoUploaderProps {
  onAnalyze: (url: string | null, file: File | null) => void;
  status: 'idle' | 'uploading' | 'analyzing' | 'ready' | 'error';
  errorMessage?: string;
  onCancel?: () => void;
  uploadProgress?: number;
  uploadSpeed?: number;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onOpenPolicy?: (type: 'privacy' | 'terms') => void;
}

import { Pause, Play } from 'lucide-react';
export const VideoUploader: React.FC<VideoUploaderProps> = ({ onAnalyze, status, onOpenPolicy, uploadProgress = 0, uploadSpeed = 0, errorMessage, isPaused, onTogglePause, onCancel }) => {
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const processUpload = (uploadUrl: string | null, file: File | null) => {
    onAnalyze(uploadUrl, file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      processUpload(null, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUpload(null, file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      processUpload(url, null);
    }
  };

  const isProcessing = status === 'uploading' || status === 'analyzing' || status === 'error';
  const isError = status === 'error';

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8 bg-zinc-950 overflow-y-auto custom-scrollbar relative">
      <div className="w-full max-w-3xl space-y-6 md:space-y-8 mt-4 md:mt-12 mb-16 md:mb-32">
        <AdBanner />
        <div className="text-center space-y-3 md:space-y-4 flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="ViralClip AI" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain mb-2"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
            Free <span className="text-indigo-400">Long to Short</span> Video Converter
          </h1>
          <p className="text-zinc-400 text-base md:text-lg px-2">
            Upload a video or paste a link to get started.
          </p>
        </div>

        <form onSubmit={handleUrlSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Video className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="url"
            placeholder="Paste YouTube or Video URL here..."
            className="block w-full pl-11 pr-32 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isProcessing}
          />
          <div className="absolute inset-y-2 right-2">
            {isProcessing ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onCancel?.(); }}
                className="h-full px-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-medium transition-colors flex items-center gap-2 pointer-events-auto"
              >
                Cancel
              </button>
            ) : (
              <button
                type="submit"
                disabled={!url}
                className="h-full px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Load
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-4 text-zinc-500">
          <div className="flex-1 h-px bg-zinc-800"></div>
          <span className="text-sm font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-zinc-800"></div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative group rounded-3xl border-2 border-dashed p-12 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[300px]",
            isDragging 
              ? "border-indigo-500 bg-indigo-500/5" 
              : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900",
            isProcessing && "opacity-50 pointer-events-none"
          )}
        >
          {!isProcessing && !isError && (
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={isProcessing}
            />
          )}
          
          {isProcessing ? (
            
            <div className="flex flex-col items-center space-y-6">
              {status === 'error' ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-500/20 text-red-400 flex items-center justify-center rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium text-red-400 mb-2">Upload Failed</h3>
                  <p className="text-zinc-400 text-sm max-w-sm text-center mb-6">{errorMessage || "Please check your internet connection and try again."}</p>
                  <button onClick={(e) => { e.stopPropagation(); onCancel?.(); }} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors relative z-10 pointer-events-auto cursor-pointer">
                    Try Again
                  </button>
                </div>
              ) : status === 'uploading' ? (
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-24 h-24 mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" 
                            strokeDasharray={40 * 2 * Math.PI} 
                            strokeDashoffset={40 * 2 * Math.PI - (uploadProgress / 100) * (40 * 2 * Math.PI)}
                            className="text-indigo-500 transition-all duration-300" />
                  </svg>
                  <span className="absolute text-lg font-bold text-zinc-100">{uploadProgress.toFixed(1)}%</span>
                </div>
                {uploadSpeed > 0 && (
                  <div className="mt-2 text-indigo-400 font-medium text-sm bg-indigo-500/10 px-3 py-1 rounded-full">
                    Speed: {uploadSpeed.toFixed(1)} Mbps
                  </div>
                )}
                {status === 'uploading' && onTogglePause && (
                   <button 
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePause(); }} 
    className="mt-4 flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors relative z-10 pointer-events-auto cursor-pointer"
>
                     {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                     {isPaused ? "Resume" : "Pause"}
                   </button>
                
                )}
                </div>
              ) : (
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-zinc-800 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                </div>
              )}
              <div className="space-y-2 text-center flex flex-col items-center">
                <h3 className="text-xl font-medium text-zinc-200">
                  {status === 'uploading' ? 'Uploading Video...' : 'AI Analyzing Content...'}
                </h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-4">
                  {status === 'uploading' 
                    ? 'Please keep this tab open while we upload your video securely.'
                    : 'Our Gemini AI is analyzing the transcript and visuals for high-retention moments.'}
                </p>
                
              </div>
            </div>

          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-10 h-10 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                Click to upload or drag and drop
              </h3>
              <p className="text-zinc-500 text-sm text-center px-4">
                MP4 or MOV<br/>
                <span className="text-zinc-600 text-xs">(Supports long videos up to 120 mins)</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Landing Page Content */}
      <div className="w-full max-w-6xl mx-auto space-y-32 md:space-y-48 py-8 px-4">
        
        {/* Section 1: Growth */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 leading-tight">
              Turn Long YouTube Videos into Shorts
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Turn one long YouTube video into multiple Shorts, giving your best content more chances to reach new viewers and subscribers. Repurpose hours of footage without manually cutting every clip.
            </p>
            <button className="flex items-center gap-2 border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full px-6 py-2.5 font-medium transition-all text-base w-fit">
              Grow My Channel <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <div className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800" 
                alt="Growth Chart Astronaut"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent mix-blend-overlay"></div>
            </div>
          </div>
        </div>

        {/* Section 2: Social Media Scheduler */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 leading-tight">
              Social Media Scheduler for Smarter Video Publishing
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Turn AI long video to shorts free into ready-to-publish posts with AI-generated titles, descriptions, and thumbnails. Connect your social accounts to schedule TikTok, Instagram, and YouTube Shorts, keeping your content calendar filled for weeks.
            </p>
            <button className="flex items-center gap-2 border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full px-6 py-2.5 font-medium transition-all text-base w-fit">
              Try Social Media Scheduler <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <div className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800" 
                alt="Podcast Scheduler"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Section 3: 10+ Shorts */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 leading-tight">
              Turn Long Videos into 10+ Shorts in 30 Seconds
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Skip hours of manual editing. Our free long video to short video AI finds the best moments, creates 10+ engaging Shorts, and gets your content ready for TikTok, Instagram, and YouTube.
            </p>
            <button className="flex items-center gap-2 border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full px-6 py-2.5 font-medium transition-all text-base w-fit">
              Convert Long Video to Shorts <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <div className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1516280440502-6c39053805bd?auto=format&fit=crop&q=80&w=800" 
                alt="Viral Clips Setup"
                className="w-full h-full object-cover opacity-90"
              />
              
              {/* Overlay: Social Icons & Graph */}
              <div className="absolute inset-0 pointer-events-none">
                
                {/* Floating Social Icons */}
                <div className="absolute top-8 right-8 flex flex-col gap-4 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-black/70 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                    <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 7.1c-.2.8-.2 3.1-.2 4.9s0 4.1.2 4.9c.2 1 .9 1.8 1.9 2 1.3.1 7.4.1 7.6.1s6.3 0 7.6-.1c1-.2 1.7-1 1.9-2 .2-.8.2-3.1.2-4.9s0-4.1-.2-4.9c-.2-1-.9-1.8-1.9-2-1.3-.1-7.4-.1-7.6-.1s-6.3 0-7.6.1c-1 .2-1.7 1-1.9 2z"/>
                      <path d="M9.8 15V9l6.3 3-6.3 3z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-black/70 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 shadow-[0_0_20px_rgba(236,72,153,0.3)] -translate-x-6">
                    <svg className="w-7 h-7 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-black/70 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.34 2.88 2.88 0 0 1 2.53-4.22h.04c.14 0 .28 0 .42.02V9.43a6.1 6.1 0 0 0-4.08-.18 6.2 6.2 0 0 0-4.14 4.54 6.3 6.3 0 0 0 .82 4.96 6.1 6.1 0 0 0 5.48 2.8 6.2 6.2 0 0 0 6.07-4.8c.1-.47.15-.96.15-1.46V7.12a8.2 8.2 0 0 0 5.12 1.76V5.44a5.05 5.05 0 0 1-2.26-.64 4.9 4.9 0 0 1-1.7-1.74l-.03-.05z"/>
                    </svg>
                  </div>
                </div>

                {/* Floating Graph Badge */}
                <div className="absolute bottom-12 left-8 bg-zinc-950/80 backdrop-blur-lg border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-emerald-400 font-bold tracking-wider uppercase text-xs">Viral Growth</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">+240%</span>
                  </div>
                  <svg className="w-32 h-16 text-emerald-500" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 35 L 25 25 L 45 30 L 70 10 L 95 5" />
                    <polyline points="85 5 95 5 95 15" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: 3 Steps */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 pb-16">
          <div className="flex-1 space-y-12">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 leading-tight">
              How to Use Our Long to Short Video Converter in 3 Steps
            </h2>
            
            <div className="space-y-8">
              <div className="border-l-[3px] border-emerald-400 pl-6 py-1">
                <h3 className="text-2xl font-bold text-zinc-100 mb-3">1. Paste a video link or upload your file</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Paste a link from YouTube, TikTok, Twitch, Vimeo, Facebook, Dailymotion (and more), or upload a video from your device or Google Drive.
                </p>
              </div>
              
              <div className="border-l-[3px] border-zinc-800 pl-6 py-1 opacity-50">
                <h3 className="text-2xl font-bold text-zinc-400">2. AI creates 10+ viral clips in 30 seconds</h3>
              </div>
              
              <div className="border-l-[3px] border-zinc-800 pl-6 py-1 opacity-50">
                <h3 className="text-2xl font-bold text-zinc-400">3. Share the clips everywhere</h3>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800" 
                alt="3 Steps Process"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Policy Thumbnails / Footer Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 pt-12 border-t border-zinc-800/50">
          <button 
            onClick={() => onOpenPolicy?.('privacy')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/50 hover:border-indigo-500/30 transition-all text-center gap-3 group"
          >
            <div className="p-3 bg-zinc-950 rounded-lg group-hover:text-indigo-400 text-zinc-400 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100">Privacy Policy</h4>
              <p className="text-[10px] text-zinc-500">Data & GDPR</p>
            </div>
          </button>
          
          <button 
            onClick={() => onOpenPolicy?.('terms')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/50 hover:border-indigo-500/30 transition-all text-center gap-3 group"
          >
            <div className="p-3 bg-zinc-950 rounded-lg group-hover:text-indigo-400 text-zinc-400 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100">Terms of Service</h4>
              <p className="text-[10px] text-zinc-500">Usage rules</p>
            </div>
          </button>
          
          <a 
            href="mailto:kamarpathan0786@gmail.com"
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/50 hover:border-indigo-500/30 transition-all text-center gap-3 group"
          >
            <div className="p-3 bg-zinc-950 rounded-lg group-hover:text-indigo-400 text-zinc-400 transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100">Contact Support</h4>
              <p className="text-[10px] text-zinc-500">kamarpathan0786@gmail.com</p>
            </div>
          </a>
          
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 text-center gap-3">
            <div className="p-3 bg-zinc-950 rounded-lg text-emerald-500/80">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-zinc-300">100% Secure</h4>
              <p className="text-[10px] text-zinc-500">Safe local processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
