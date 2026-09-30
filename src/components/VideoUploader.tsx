import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Zap, Flame, Shield, ArrowRight, Play, Film, CheckCircle2, Lock, LogIn, AlertCircle, X, Crown, AlertTriangle, Clock } from 'lucide-react';
import { VideoState } from '../types';
import { useAuth } from '../context/AuthContext';
import { isPlan4KSupported } from '../data/pricingData';
import { Demo30sSection } from './Demo30sSection';

interface VideoUploaderProps {
  onAnalyze: (file: File | string, serverPath?: string) => void;
  status: VideoState['status'];
  onOpenAuth: () => void;
  onOpenPricing?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  onCancelUpload?: () => void;
}

// 5GB maximum file size limit
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB = 5,368,709,120 bytes

export const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onAnalyze, 
  status, 
  onOpenAuth,
  onOpenPricing,
  isUploading = false,
  uploadProgress = 0,
  onCancelUpload
}) => {
  const { isAuthenticated, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resolutionWarning, setResolutionWarning] = useState<string | null>(null);
  const [success4KBadge, setSuccess4KBadge] = useState<string | null>(null);
  const [isCheckingVideo, setIsCheckingVideo] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [blocked4KData, setBlocked4KData] = useState<{ width: number; height: number; fileName: string } | null>(null);
  const [pending4KFile, setPending4KFile] = useState<File | null>(null);

  const checkVideoResolution = (file: File): Promise<{ width: number; height: number; duration: number; isExceeding1080p: boolean; is4K: boolean }> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      const cleanup = () => {
        try { URL.revokeObjectURL(objectUrl); } catch (_) {}
      };

      video.onloadedmetadata = () => {
        const width = video.videoWidth || 0;
        const height = video.videoHeight || 0;
        const duration = video.duration || 0;
        cleanup();
        // 1080p maximum limits:
        // Landscape: 1920x1080
        // Vertical (9:16 Shorts/Reels): 1080x1920
        // Square: 1080x1080
        // Any video where max(width, height) > 1920 or (width > 1080 and height > 1080) exceeds 1080p (e.g. 1440p 2K, 4K)
        const isExceeding1080p = width > 1920 || height > 1920 || (width > 1080 && height > 1080);
        const is4K = width >= 3840 || height >= 2160 || (width >= 2160 && height >= 2160);
        resolve({ width, height, duration, isExceeding1080p, is4K });
      };

      video.onerror = () => {
        cleanup();
        resolve({ width: 0, height: 0, duration: 0, isExceeding1080p: false, is4K: false });
      };

      setTimeout(() => {
        cleanup();
        resolve({ width: 0, height: 0, duration: 0, isExceeding1080p: false, is4K: false });
      }, 4000);
    });
  };

  const processFile = async (file: File) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|avi|mkv|m4v|3gp|flv|wmv)$/i)) {
      setResolutionWarning("Please upload a valid video file (e.g. .mp4, .mov, .webm).");
      return;
    }

    // 1. Strict 5GB Maximum File Size Verification
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
      setResolutionWarning(
        `File size (${sizeGB} GB) exceeds the 5GB maximum upload limit. Please select a video file under 5GB.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setResolutionWarning(null);
    setSuccess4KBadge(null);
    setIsCheckingVideo(true);

    try {
      // 2. Video Duration & Resolution Check
      const { width, height, duration, isExceeding1080p, is4K } = await checkVideoResolution(file);

      // Max 60 minutes video length validation
      if (duration && duration > 3600) {
        setIsCheckingVideo(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        const durMin = Math.round(duration / 60);
        setResolutionWarning(`Video length (${durMin} mins) exceeds the 60 minutes maximum allowed limit. Please select a video up to 60 minutes long.`);
        return;
      }

      const userHas4KPlan = isPlan4KSupported(user?.plan);

      if (isExceeding1080p && !userHas4KPlan) {
        // User uploaded a video exceeding 1080p without a 4K package (e.g. mobile 4K from iPhone/Samsung)
        setIsCheckingVideo(false);
        setPending4KFile(file);
        setBlocked4KData({ width, height, fileName: file.name });
        return;
      }

      if (isExceeding1080p && userHas4KPlan) {
        // User has 4K plan -> allow and show verified badge
        setSuccess4KBadge(`Ultra High-Definition Video Verified (${width}×${height}) • Unlocked with your ${user?.planName || '4K Plan'}`);
      }

      setIsCheckingVideo(false);
      // Proceed to analyze and editor
      onAnalyze(file);
    } catch (err) {
      console.warn("Video dimension check skipped:", err);
      setIsCheckingVideo(false);
      onAnalyze(file);
    }
  };

  const handleAutoDownscaleTo1080p = () => {
    if (pending4KFile) {
      const fileToProcess = pending4KFile;
      const dims = blocked4KData ? `${blocked4KData.width}×${blocked4KData.height}` : '4K';
      setBlocked4KData(null);
      setPending4KFile(null);
      setResolutionWarning(null);
      setSuccess4KBadge(`⚡ Mobile 4K Video (${dims}) Auto-Optimized to 1080p Full HD!`);
      onAnalyze(fileToProcess);
    }
  };

  const handleTryDemo = () => {
    try {
      setIsGeneratingDemo(true);
      const cacheBustUrl = `/demo-sample.mp4?v=${Date.now()}`;
      onAnalyze(cacheBustUrl, 'uploads/demo-sample.mp4');
    } catch (e) {
      console.error(e);
      alert("Unable to generate demo clip. Please upload a video directly.");
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isAuthenticated) {
        onOpenAuth();
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      processFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-5xl mx-auto my-4">
      <div className="w-full space-y-10">
        
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto w-full text-center space-y-5 flex flex-col items-center relative">
          {/* Engine Status Beacon */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AI Neural Splitter v3.0 Active</span>
            <span className="text-zinc-600">·</span>
            <span className="text-indigo-400 font-semibold">4K Upload • 1080p Full HD Render</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Turn Long Videos into{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Viral Shorts
              </span>{' '}
              in Seconds
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Upload any podcast, interview, or lecture. Our AI finds the high-retention moments, applies Part 1, Part 2 Series Tags, and crops to 9:16 vertical without watermarks.
            </p>
          </div>

          {/* Quick Specs Ticker */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Watermark</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Max Length: <strong>60 Minutes</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>4K Upload • 1080p Render (Pro & Agency)</span>
            </div>
          </div>
        </div>

        {/* Upload Terminal Card */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="space-y-4">
              
              {/* Success 4K Badge */}
              {success4KBadge && (
                <div className="relative bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs text-emerald-200 font-medium leading-relaxed pr-6">
                    {success4KBadge}
                  </div>
                  <button 
                    onClick={() => setSuccess4KBadge(null)} 
                    className="absolute top-3 right-3 text-emerald-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Warning / Error Message */}
              {resolutionWarning && (
                <div className="relative bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-200 leading-relaxed pr-6 space-y-2">
                    <p>{resolutionWarning}</p>
                    {blocked4KData && onOpenPricing && (
                      <button
                        type="button"
                        onClick={() => {
                          setResolutionWarning(null);
                          onOpenPricing();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Upgrade to 4K Plan (Pro / Agency)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      setResolutionWarning(null);
                      setBlocked4KData(null);
                    }} 
                    className="absolute top-3 right-3 text-rose-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Checking Video Resolution Spinner */}
              {isCheckingVideo && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] shadow-2xl">
                  <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <h4 className="text-white font-bold text-sm">Verifying Video Resolution & File Specs...</h4>
                  <p className="text-xs text-zinc-400 mt-1">Checking video duration (up to 60 mins) & resolution</p>
                </div>
              )}

              {isUploading ? (
                /* Circular Progress Uploading Card matching user video */
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[280px] shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
                  {onCancelUpload && (
                    <button 
                      type="button"
                      onClick={onCancelUpload}
                      className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  {/* Circular Progress Ring */}
                  <div className="relative w-28 h-28 flex items-center justify-center mb-5">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="5"
                        className="text-zinc-800/80"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="5"
                        className="text-indigo-500 transition-all duration-150 ease-out"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={(2 * Math.PI * 42) - (((uploadProgress || 0) / 100) * (2 * Math.PI * 42))}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-white text-base font-mono tracking-tight">
                        {(uploadProgress || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Speed: Fast Uploads pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3 shadow-sm">
                    <span>Speed: Fast Cloud Upload</span>
                  </div>

                  {/* Heading & Subtext */}
                  <h3 className="text-white font-bold text-base mb-1">
                    Uploading Video securely...
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Please keep this tab open while we process your video.
                  </p>
                </div>
              ) : !isCheckingVideo && (
                /* Main Drag & Drop Zone with Glowing Ring */
                <div 
                  onClick={handleUploadClick}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-950/20');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-950/20');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-950/20');
                    if (!isAuthenticated) {
                      onOpenAuth();
                      return;
                    }
                    const file = e.dataTransfer.files?.[0];
                    if (file) processFile(file);
                  }}
                  className="bg-zinc-950/80 border-2 border-dashed border-zinc-800 hover:border-indigo-500/70 hover:bg-zinc-900/50 transition-all duration-200 rounded-3xl p-8 sm:p-12 text-center cursor-pointer flex flex-col items-center justify-center min-h-[250px] group shadow-2xl relative overflow-hidden"
                >
                  {/* Upload Icon with Soft Glowing Hover Aura */}
                  <div className="w-16 h-16 bg-zinc-900 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/40 border border-zinc-800 transition-all rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    {isAuthenticated ? (
                      <Upload className="w-7 h-7 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                    ) : (
                      <Lock className="w-7 h-7 text-amber-400 group-hover:text-amber-300 transition-colors" />
                    )}
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {!isAuthenticated ? (
                      <>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-1 shadow-sm">
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Login Required to Upload</span>
                        </div>
                        <p className="text-white font-bold text-base md:text-lg group-hover:text-indigo-200 transition-colors">
                          Click here to Login & Upload
                        </p>
                        <p className="text-zinc-400 text-xs md:text-sm">
                          Free account includes export credits • Up to 60 mins video length
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-white font-bold text-base md:text-lg group-hover:text-indigo-200 transition-colors">
                          Click to upload or drag & drop video
                        </p>
                        <p className="text-zinc-400 text-xs md:text-sm">
                          MP4, MOV or WebM • Up to 60 Mins Length • 4K Upload & 1080p Render
                        </p>
                      </>
                    )}
                  </div>

                  {/* Plan Specs Badge */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                      Max Length: <strong className="text-white">60 Minutes</strong>
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                      isPlan4KSupported(user?.plan) 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}>
                      {isPlan4KSupported(user?.plan) ? '✨ 4K Upload Active (Render: 1080p Full HD)' : 'Regular Plans: Max 1080p Upload (4K requires Pro/Agency)'}
                    </span>
                  </div>

                  {/* Instant Try Demo Button */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTryDemo();
                    }}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
                  >
                    {isGeneratingDemo ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Studio...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✨ Try Instant Sample Video</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
              />
            </div>
        </div>

        {/* 4K & High-Res Mobile Video Modal */}
        {blocked4KData && (
          <div className="fixed inset-0 z-[270] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-amber-500/40 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-center">
              <button
                onClick={() => {
                  setBlocked4KData(null);
                  setPending4KFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
                <Crown className="w-7 h-7" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                Mobile 4K / High-Res Detected
              </span>

              <h3 className="text-xl font-bold text-white mt-3 mb-2">
                4K Video Detected ({blocked4KData.width}×{blocked4KData.height})
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                iPhone (Apple), Samsung aur modern smartphones default me 4K me record karte hain. Aapke current plan (<strong className="text-zinc-200">{user?.planName || 'Free Plan'}</strong>) par 1080p output supported hai.
              </p>

              <div className="space-y-2.5 mb-4">
                {/* Option 1: Auto downscale to 1080p for free */}
                <button
                  type="button"
                  onClick={handleAutoDownscaleTo1080p}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>⚡ Auto-Convert to 1080p & Continue (Free)</span>
                </button>

                {/* Option 2: Keep 4K UHD quality via plan upgrade */}
                {onOpenPricing && (
                  <button
                    type="button"
                    onClick={() => {
                      setBlocked4KData(null);
                      setPending4KFile(null);
                      onOpenPricing();
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Keep Native 4K UHD (Upgrade Plan)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setBlocked4KData(null);
                    setPending4KFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium text-xs py-2 px-4 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel Upload
                </button>
              </div>

              <div className="text-[11px] text-zinc-500 leading-normal bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-xl">
                <span>💡 <strong>Tip:</strong> Option 1 bina kisi quality loss ke aapke phone video ko crisp 1080p Full HD me convert kar dega.</span>
              </div>
            </div>
          </div>
        )}

        {/* 30s Live Demo Video Player & How It's Made Walkthrough */}
        <Demo30sSection 
          onLoadDemoIntoEditor={handleTryDemo}
          isLoading={isGeneratingDemo}
        />
      </div>
    </div>
  );
};
