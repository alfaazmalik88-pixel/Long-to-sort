import React from 'react';
import { ArrowRight, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CallToActionBannerProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  showPricingLink?: boolean;
}

export const CallToActionBanner: React.FC<CallToActionBannerProps> = ({
  title = "Ready to Turn Long Videos into Viral Shorts?",
  subtitle = "Get 5 Free Processing Minutes as a welcome trial. Zero watermark, instant AI auto-split, and 1080p Full HD export.",
  primaryButtonText = "Start Creating Free (5 Mins Included)",
  showPricingLink = true
}) => {
  return (
    <div className="w-full my-8 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-zinc-950 to-zinc-950 border border-indigo-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background soft glow aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_70%)] pointer-events-none" />

      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>One-Time 5 Mins Free Trial • No Credit Card Required</span>
      </div>

      {/* Main Heading & Subtitle */}
      <div className="space-y-2 max-w-xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
        <Link
          to="/"
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-extrabold text-sm py-3.5 px-8 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>{primaryButtonText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {showPricingLink && (
          <Link
            to="/pricing"
            className="w-full sm:w-auto bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-zinc-600 active:scale-95 font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>View All Plans (From ₹49 / $4.99)</span>
          </Link>
        )}
      </div>

      {/* Trust Highlights */}
      <div className="pt-4 border-t border-zinc-900 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-zinc-400 text-xs relative z-10">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Zero Watermark</span>
        </span>
        <span className="text-zinc-700">·</span>
        <span className="flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>1080p Full HD</span>
        </span>
        <span className="text-zinc-700">·</span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Alex Hormozi Captions</span>
        </span>
      </div>
    </div>
  );
};
