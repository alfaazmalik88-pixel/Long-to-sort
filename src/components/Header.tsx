import React from 'react';
import { Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onOpenAuth?: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPricing }) => {
  const { user } = useAuth();
  const location = useLocation();

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenPricing) {
      onOpenPricing();
    } else {
      const el = document.getElementById('pricing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="w-full h-14 md:h-16 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 flex items-center justify-between px-2.5 sm:px-4 md:px-6 shrink-0 z-40 relative">
      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-800 pointer-events-none" />

      {/* Brand Logo & Plan Badge */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-transparent flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <img 
              src="/logo.svg" 
              alt="ViralClip AI Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-black text-sm sm:text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent truncate">
            ViralClip AI
          </span>
        </Link>

        {/* Clickable Plan Badge (Desktop & Tablet only to give mobile buttons breathing room) */}
        <button
          type="button"
          onClick={handlePricingClick}
          title="Click to view & change plans"
          className="hidden sm:flex text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>{user?.planName || 'Free Trial'}</span>
        </button>
      </div>

      {/* Center Navigation Links */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <Link
          to="/"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            location.pathname === '/' ? 'text-white bg-zinc-900 border border-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          AI Generator
        </Link>

        <Link
          to="/blog"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            location.pathname === '/blog' || location.pathname === '/guides' ? 'text-white bg-zinc-900 border border-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Viral Guides</span>
        </Link>

        {/* Pricing Button */}
        <button
          type="button"
          onClick={handlePricingClick}
          className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 cursor-pointer shadow-sm active:scale-95 shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Plans (₹49 / $5)</span>
        </button>
      </div>

      {/* Right Action: Plans & Upgrades */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        <button
          type="button"
          onClick={handlePricingClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Plans (₹49 / $5)</span>
        </button>
      </div>
    </header>
  );
};
