import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Zap, Flame, Shield, ArrowRight, Play, Film, CheckCircle2, Lock, LogIn, AlertCircle, X, Crown, AlertTriangle, Clock, HardDrive } from 'lucide-react';
import { VideoState } from '../types';
import { useAuth } from '../context/AuthContext';
import { isPlan4KSupported } from '../data/pricingData';

interface VideoUploaderProps {
  onAnalyze: (file: File | string, serverPath?: string) => void;
  status: VideoState['status'];
  onOpenAuth?: () => void;
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
  const { isAuthenticated, user, loginWithGoogle } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resolutionWarning, setResolutionWarning] = useState<string | null>(null);

  const handleRequireLogin = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      loginWithGoogle();
    }
  };
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

      let resolved = false;
      const cleanup = () => {
        try { URL.revokeObjectURL(objectUrl); } catch (_) {}
      };

      const finish = (w: number, h: number, dur: number) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        const isExceeding1080p = w > 1920 || h > 1920 || (w > 1080 && h > 1080);
        const is4K = w >= 3840 || h >= 2160 || (w >= 2160 && h >= 2160);
        resolve({ width: w, height: h, duration: dur, isExceeding1080p, is4K });
      };

      video.onloadedmetadata = () => {
        let dur = video.duration || 0;
        if (!isFinite(dur) || dur === 0) {
          video.currentTime = Number.MAX_SAFE_INTEGER;
          video.ontimeupdate = () => {
            video.ontimeupdate = null;
            dur = video.duration || video.currentTime || 0;
            video.currentTime = 0;
            finish(video.videoWidth || 0, video.videoHeight || 0, dur);
          };
          setTimeout(() => {
            finish(video.videoWidth || 0, video.videoHeight || 0, video.duration || 0);
          }, 1500);
          return;
        }
        finish(video.videoWidth || 0, video.videoHeight || 0, dur);
      };

      video.onerror = () => {
        finish(0, 0, 0);
      };

      setTimeout(() => {
        finish(video.videoWidth || 0, video.videoHeight || 0, video.duration || 0);
      }, 10000);
    });
  };

  const processFile = async (file: File) => {
    if (!isAuthenticated) {
      handleRequireLogin();
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
        `File size (${sizeGB} GB) exceeds the 5GB maximum upload limit! 5GB ke upar video upload nahi kar sakte. Please select a video under 5GB.`
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
        setResolutionWarning(`Video length (${durMin} mins) exceeds the 60 minutes maximum allowed limit. 60 minute ke aage video upload nahi kar sakte.`);
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
    if (!isAuthenticated) {
      handleRequireLogin();
      return;
    }
    try {
      setIsGeneratingDemo(true);
      const cacheBustUrl = `/official-demo.mp4?v=${Date.now()}`;
      onAnalyze(cacheBustUrl, 'public/official-demo.mp4');
    } catch (e) {
      console.error(e);
      alert("Unable to generate demo clip. Please upload a video directly.");
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      handleRequireLogin();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-1 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Watermark</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Pro & Agency: 4K Upload • 1080p Render</span>
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
                        {Math.round(uploadProgress || 0)}%
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
                /* Main Drag & Drop Zone */
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
                      handleRequireLogin();
                      return;
                    }
                    const file = e.dataTransfer.files?.[0];
                    if (file) processFile(file);
                  }}
                  className="bg-zinc-950/80 border-2 border-dashed border-zinc-800 hover:border-indigo-500/70 hover:bg-zinc-900/50 transition-all duration-200 rounded-3xl p-8 sm:p-12 text-center cursor-pointer flex flex-col items-center justify-center min-h-[250px] group shadow-2xl relative overflow-hidden"
                >
                  {/* Upload Icon with Soft Glowing Hover Aura */}
                  <div className="w-16 h-16 bg-zinc-900 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/40 border border-zinc-800 transition-all rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Upload className="w-7 h-7 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <p className="text-white font-bold text-base md:text-lg group-hover:text-indigo-200 transition-colors">
                      Click to upload or drag & drop video
                    </p>
                    <p className="text-zinc-400 text-xs">
                      MP4, MOV, WebM supported
                    </p>
                  </div>

                  {/* Limits pills - Clean, no mail/email name */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[11px] text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <span>Max 5 GB • 60 Min</span>
                    </span>
                    <span className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                      isPlan4KSupported(user?.plan) 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-medium' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}>
                      {isPlan4KSupported(user?.plan) ? '✨ 4K Upload Active (Pro/Agency)' : 'Pro & Agency: 4K Upload'}
                    </span>
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

            {/* Quick Demo Video Launcher */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-xs text-zinc-400">Want to test without uploading?</span>
              <button
                type="button"
                onClick={handleTryDemo}
                disabled={isGeneratingDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                {isGeneratingDemo ? (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                )}
                <span>Try Demo Video</span>
              </button>
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
                iPhones, Samsung, and modern smartphones record in 4K by default. 4K upload is included with <strong className="text-amber-300">Pro Pack</strong> and <strong className="text-amber-300">Agency Pack</strong>. Your current plan is <strong className="text-zinc-200">{user?.planName || 'Free Plan'}</strong> (1080p).
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
                    <span>Unlock 4K Upload (Pro / Agency Plan)</span>
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
                <span>💡 <strong>Tip:</strong> Option 1 converts your high-res video to crisp 1080p Full HD without any quality loss.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
