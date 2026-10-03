import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Zap, 
  Check, 
  Heart, 
  ArrowRight, 
  Mail, 
  Video, 
  Globe2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CallToActionBanner } from '../components/CallToActionBanner';

export const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500 selection:text-white pb-24 overflow-x-hidden">
      {/* Subtle Glow Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Generator</span>
          </Link>

          <button
            onClick={handleCtaClick}
            className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Get 5 Free Minutes</span>
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-12 pb-10 px-4 sm:px-6 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold tracking-wide shadow-sm animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>About ViralClip AI • Built For Modern Creators</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Empowering Creators with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">Next-Gen Video AI</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          We are on a mission to democratize short-form video creation. ViralClip AI turns hours of long podcasts and YouTube videos into high-retention vertical shorts in seconds.
        </p>
      </section>

      {/* Main 3 Pillars Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Pillar 1: Our Mission */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">Pillar 01</span>
              <h2 className="text-lg sm:text-xl font-bold text-white">Our Mission</h2>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Content creation shouldn't require 10 hours of manual timeline scrubbing, subtitle typing, and expensive video editing software. Our primary mission is to <strong>save 90% of editing time for creators, educators, podcasters, and media agencies</strong> by automatically detecting viral hooks, intelligent speaker framing, and generating word-synchronized animated subtitles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-3 text-center space-y-1">
              <div className="text-xl font-black text-indigo-400">90%</div>
              <div className="text-[11px] text-zinc-400 font-medium">Time Saved per Video</div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-3 text-center space-y-1">
              <div className="text-xl font-black text-emerald-400">60s</div>
              <div className="text-[11px] text-zinc-400 font-medium">Average Processing Speed</div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-3 text-center space-y-1">
              <div className="text-xl font-black text-amber-400">5x</div>
              <div className="text-[11px] text-zinc-400 font-medium">Higher Social Reach</div>
            </div>
          </div>
        </div>

        {/* Pillar 2: What We Offer */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Pillar 02</span>
              <h2 className="text-lg sm:text-xl font-bold text-white">What We Offer</h2>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Unlike other platforms that restrict free users with ugly forced watermarks or low-resolution 480p exports, ViralClip AI provides studio-grade output across all tiers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="flex items-start gap-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-white">Zero Watermark Guarantee</h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Your content belongs to you. We never burn our brand logo or overlay onto your videos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-white">1080p Full HD Video Rendering</h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Crisp high-definition visual fidelity optimized for YouTube Shorts, Instagram Reels, and TikTok feeds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-white">Alex Hormozi Animated Captions</h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Word-by-word kinetic subtitle highlights in English and global languages for 85%+ retention.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-white">Series Title Stickers</h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Automatically embed Part 1, Part 2, and custom episode tags to encourage binge-watching across your channel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Developer & Team Vision */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">Pillar 03</span>
              <h2 className="text-lg sm:text-xl font-bold text-white">Developer & Team Vision</h2>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Most western AI video editing tools charge predatory recurring subscriptions between <strong>$29 and $49 per month</strong>—an impossible barrier for budding Indian creators and students.
          </p>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Our vision is to provide <strong>affordable, high-performance creator technology starting at just ₹49 one-time</strong>. No recurring traps, no forced monthly renewals, and credits that never expire. We believe in fair micro-pricing so every creator from small towns to big studios can leverage state-of-the-art AI.
          </p>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <Heart className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90 leading-relaxed">
              <strong>Our Promise to You:</strong> 100% transparent pricing, secure payments powered by RBI-compliant Indian gateways (Razorpay UPI & Cards), and zero automatic deductions.
            </p>
          </div>
        </div>

        {/* Company & Compliance Overview Card (For Razorpay, Stripe, and Google E-E-A-T) */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
            <div className="flex items-center gap-2.5">
              <Globe2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Company & Merchant Profile</h3>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              Verified Merchant
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-500 font-semibold block">Brand & Platform Name:</span>
              <span className="text-zinc-200 font-bold text-sm">ViralClip AI</span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-semibold block">Official Website:</span>
              <a href="https://viralclipai.in/" className="text-indigo-400 font-bold hover:underline">
                https://viralclipai.in/
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-semibold block">Support & Grievance Contact:</span>
              <a href="mailto:viralclipaihelp@gmail.com" className="text-indigo-400 font-bold hover:underline flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                viralclipaihelp@gmail.com
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-semibold block">Industry Category:</span>
              <span className="text-zinc-200 font-medium">Software-as-a-Service (SaaS) • Video Automation</span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-semibold block">Operating Headquarters:</span>
              <span className="text-zinc-200 font-medium">Gujarat / India • Serving Worldwide</span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-semibold block">Response Time:</span>
              <span className="text-zinc-200 font-medium">Within 24 to 48 Hours via Email</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <CallToActionBanner 
          title="Start Generating Viral Clips Today"
          subtitle="Get 5 free processing minutes on signup. Zero commitments, no watermark, and instant 1080p Full HD export."
          primaryButtonText="Try ViralClip AI Free (5 Mins)"
        />

      </main>
    </div>
  );
};
