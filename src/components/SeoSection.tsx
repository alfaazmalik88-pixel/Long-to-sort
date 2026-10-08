import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ShieldCheck, FileText, Mail, RotateCcw, Zap, Sparkles, Check, ChevronDown, Flame, Video, Layers, BookOpen, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Radio, CheckCircle2 } from 'lucide-react';

const DemoVideoPlayer: React.FC<{ onLoadDemo?: () => void }> = ({ onLoadDemo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc] = useState('/official-demo.mp4?v=' + Date.now());
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [videoSrc]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * (duration || 10);
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  return (
    <div className="w-full my-8 flex flex-col items-center">
      {/* Official Demo Header Bar Above Video */}
      <div className="w-full max-w-3xl mb-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/90 border border-zinc-800/80 p-3 sm:p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400 translate-x-0.5" />
          </div>
          <div>
            <h3 className="text-white text-sm sm:text-base font-black tracking-tight flex items-center gap-2">
              <span>Official 10s Demo</span>
              <span className="text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-lg border border-yellow-400/30 text-xs font-semibold">
                Auto-Split &amp; Captions
              </span>
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Watch how ViralClip AI detects viral moments &amp; formats for 9:16 vertical shorts
            </p>
          </div>
        </div>

        {onLoadDemo && (
          <button
            type="button"
            onClick={onLoadDemo}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-400/40 hover:scale-[1.02] transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 fill-zinc-950 text-zinc-950" />
            <span>⚡ Try Free Demo (1-Click)</span>
          </button>
        )}
      </div>

      {/* Horizontal Video Container (16:9 Widescreen) */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-indigo-500/50 shadow-2xl ring-2 ring-indigo-500/20 overflow-hidden flex flex-col justify-between group"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain bg-black cursor-pointer"
          playsInline
          autoPlay
          muted={isMuted}
          loop
          onClick={() => togglePlay()}
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration || 12);
          }}
        />

        {/* Play/Pause Center Indicator when paused */}
        {!isPlaying && (
          <div 
            onClick={() => togglePlay()}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-20 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all">
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-white bg-black/85 px-4 py-1 rounded-full border border-white/15 shadow-md">
              Click to Play
            </span>
          </div>
        )}

        {/* Bottom Floating Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-30 flex flex-col gap-2">
          {/* Progress Bar (Click to seek) */}
          <div 
            onClick={handleProgressBarClick}
            className="w-full bg-zinc-700/60 hover:bg-zinc-700/80 h-2 rounded-full overflow-hidden cursor-pointer transition-colors relative"
          >
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-150"
              style={{ width: `${(currentTime / (duration || 12)) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => togglePlay()}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-indigo-400 transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-emerald-400 transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <span className="font-mono text-[11px] text-zinc-300">
                {Math.floor(currentTime)}s / {Math.floor(duration)}s
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* High-Contrast Feature Badges Row Below Video */}
      <div className="w-full max-w-3xl mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>⚡</span>
          <span>AI Moment Detection</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>🎬</span>
          <span>Hormozi Animated Subtitles</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>🛡️</span>
          <span>100% Clean (Zero Watermark)</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>📐</span>
          <span>9:16 Vertical Auto-Reframe</span>
        </span>
      </div>

      <p className="text-zinc-400 text-xs font-medium text-center mt-2.5 max-w-xl">
        Watch the 10-second demo above, or click <span className="text-yellow-400 font-bold">&quot;⚡ Try Free Demo (1-Click)&quot;</span> to analyze clips in the AI Studio!
      </p>
    </div>
  );
};

const SocialGif = () => (
  <div className="w-full aspect-[21/9] sm:aspect-[24/9] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-zinc-800/80 relative flex items-center justify-center shadow-lg">
    {/* Clean Gradient Aura */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10" />
    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.25 }} />

    <div className="flex items-center justify-center gap-6 sm:gap-12 z-10">
      {/* YouTube */}
      <div className="hover:scale-110 transition-transform drop-shadow-xl">
        <svg className="w-10 h-10 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
          <path fill="#FFFFFF" d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"/>
        </svg>
      </div>

      {/* Instagram */}
      <div className="hover:scale-110 transition-transform drop-shadow-xl">
        <svg className="w-10 h-10 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="none" stroke="url(#instaGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="instaGrad" x1="2" y1="2" x2="22" y2="22">
              <stop offset="0%" stopColor="#f58529" />
              <stop offset="50%" stopColor="#dd2a7b" />
              <stop offset="100%" stopColor="#8134af" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </div>

      {/* TikTok */}
      <div className="hover:scale-110 transition-transform drop-shadow-xl">
        <svg className="w-10 h-10 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="#FFFFFF" style={{ filter: 'drop-shadow(2px 2px 0px #ff0050) drop-shadow(-2px -2px 0px #00f2fe)' }}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      </div>
    </div>
  </div>
);

interface SeoSectionProps {
  onLoadDemo?: () => void;
}

export const SeoSection: React.FC<SeoSectionProps> = ({ onLoadDemo }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is ViralClip AI free to use?',
      a: 'Yes! Every new creator gets 5 free processing minutes as a one-time trial to test out 1080p rendering and animated captions without paying anything. Lifetime top-up packs start at just ₹49 ($4.99).'
    },
    {
      q: 'Does it leave any watermark?',
      a: 'Never! All generated shorts, reels, and TikToks are 100% clean with zero watermarks across all plans.'
    },
    {
      q: 'Are animated Alex Hormozi captions included?',
      a: 'Yes, dynamic animated captions with active word karaoke highlights (yellow, green, cyan) are automatically generated with 98%+ accuracy.'
    },
    {
      q: 'What video formats and sizes are supported?',
      a: 'You can upload up to 5GB video files in MP4, MOV, WEBM, AVI, or MKV. Export in vertical 9:16, square 1:1, or 16:9 cinema in 1080p Full HD.'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-12 text-zinc-300">
        
        {/* Compact Hero Block with Video Preview */}
        <div className="space-y-4 text-center sm:text-left">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Turn Long Videos into 10+ Viral Shorts in 30 Seconds</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            Repurpose Podcasts & Videos with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">Zero Watermark</span>
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Auto-detect viral moments, add Hormozi animated captions, insert Part 1 & Part 2 series tags, and export crisp 1080p Full HD clips ready for YouTube Shorts, Reels & TikTok.
          </p>

          {/* High-Conversion Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-center">
              <span className="text-amber-400 font-extrabold text-xs block">⚡ 10x Faster</span>
              <span className="text-[10px] text-zinc-400">Zero manual cutting</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-center">
              <span className="text-indigo-400 font-extrabold text-xs block">🛡️ 0 Watermark</span>
              <span className="text-[10px] text-zinc-400">Pure creator branding</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-center">
              <span className="text-cyan-400 font-extrabold text-xs block">✨ Hormozi Subs</span>
              <span className="text-[10px] text-zinc-400">Word-by-word highlights</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-center">
              <span className="text-purple-400 font-extrabold text-xs block">💎 1080p HD</span>
              <span className="text-[10px] text-zinc-400">Crisp high bitrate</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <button 
              type="button"
              onClick={() => {
                const el = document.getElementById('pricing');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-11 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-zinc-100 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>See Plans (₹49 / $4.99) • 5 Mins Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Official Demo Video Player */}
          <DemoVideoPlayer onLoadDemo={onLoadDemo} />
        </div>

        {/* 3-Step Visual Process (Compact 3-Card Grid) */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">How It Works in 3 Quick Steps</h3>
            <p className="text-xs text-zinc-400 mt-0.5">From raw video to viral shorts ready to publish</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-2 hover:border-indigo-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xs">
                1
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Upload Your Video</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Select your video up to 5GB or try our preloaded demo clip in 1 click.
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-2 hover:border-purple-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xs">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">AI Detects Viral Clips</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Auto-frames 9:16 vertical, adds animated subtitles, and generates Part 1 & 2 badges.
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-2 hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">
                3
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Download in 1080p HD</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Fast render with zero watermark, ready to go viral on YouTube, Reels & TikTok.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Platform Social Media Strip */}
        <div className="space-y-3">
          <SocialGif />
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-white">Publish Everywhere in 1-Click</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Export in 9:16 vertical for Shorts, Reels & TikTok, 1:1 square for feeds, or 16:9 widescreen. Maintain 100% video clarity without cropping.
            </p>
          </div>
        </div>

        {/* Compact FAQ Accordion */}
        <div className="space-y-3 pb-2">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Frequently Asked Questions</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Quick answers to common questions</p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-900/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
      
      {/* Footer Grid - Compact, Sleek & Elegant (All 6 Cards Sized Down & Clean) */}
      <div className="w-full bg-[#0a0a0c] border-t border-zinc-800/80 py-6 px-3 sm:px-4 shadow-xl">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
          {/* Card 1: Viral Guides & Blog */}
          <Link 
            to="/blog" 
            className="bg-zinc-900/80 hover:bg-zinc-800/90 border border-purple-500/40 hover:border-purple-400/80 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm group active:scale-95 text-center"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-purple-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Viral Guides</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">Shorts & SEO Tips</div>
            </div>
          </Link>

          {/* Card 2: Pricing & Plans with INR and Dollar */}
          <Link 
            to="/pricing" 
            className="bg-zinc-900/80 hover:bg-zinc-800/90 border border-amber-500/40 hover:border-amber-400/80 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm group active:scale-95 text-center"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shrink-0">
              <Zap className="w-3.5 h-3.5 fill-amber-400/30 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Pricing & Plans</div>
              <div className="text-[10px] font-semibold text-amber-300/90 mt-0.5 leading-tight">
                ₹0 / ₹49 / ₹99
              </div>
              <div className="text-[9px] font-medium text-zinc-400 mt-0.5 leading-tight">
                $0 / $4.99 / $9.99 USD
              </div>
            </div>
          </Link>

          {/* Card 3: Privacy Policy */}
          <Link 
            to="/privacy-policy" 
            className="bg-zinc-900/80 hover:bg-zinc-800/90 border border-emerald-500/40 hover:border-emerald-400/80 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm group active:scale-95 text-center"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Privacy Policy</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">Data & GDPR Safety</div>
            </div>
          </Link>
          
          {/* Card 4: Terms of Service */}
          <Link 
            to="/terms-of-service" 
            className="bg-zinc-900/80 hover:bg-zinc-800/90 border border-cyan-500/40 hover:border-cyan-400/80 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm group active:scale-95 text-center"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Terms of Service</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">Usage & Service Rules</div>
            </div>
          </Link>

          {/* Card 5: Refund & Cancel */}
          <Link 
            to="/refund-policy" 
            className="bg-zinc-900/80 hover:bg-zinc-800/90 border border-rose-500/40 hover:border-rose-400/80 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm group active:scale-95 text-center"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform shrink-0">
              <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">Refund & Cancel</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">Digital Policy</div>
            </div>
          </Link>

          {/* Card 6: Contact Support */}
          <Link 
            to="/contact" 
            className="bg-zinc-900/80 hover:bg-zinc-800/90 border border-indigo-500/40 hover:border-indigo-400/80 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm group active:scale-95 text-center"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform shrink-0">
              <Mail className="w-3.5 h-3.5 text-indigo-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Contact Support</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight truncate max-w-[130px] sm:max-w-none">viralclipaihelp@gmail.com</div>
            </div>
          </Link>
        </div>

        {/* Legal & Compliance Quick Links */}
        <div className="max-w-5xl mx-auto mt-5 pt-4 border-t border-zinc-900/90 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>© 2026 ViralClip AI. All rights reserved. Built for high-growth creators.</p>
          <div className="flex items-center gap-4 flex-wrap font-medium">
            <Link to="/about" className="text-zinc-400 hover:text-white transition-colors">About Us</Link>
            <Link to="/blog" className="text-zinc-400 hover:text-white transition-colors">Viral Guides</Link>
            <Link to="/pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing (₹49 / $5)</Link>
            <Link to="/privacy-policy" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-zinc-400 hover:text-white transition-colors">Terms</Link>
            <Link to="/refund-policy" className="text-zinc-400 hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
