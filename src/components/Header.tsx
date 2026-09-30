import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, ChevronDown, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenPricing }) => {
  const { user, isAuthenticated, logout, loginWithGoogle } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleGoogleSignInClick = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google popup error:', err);
      // Fallback: if popup is blocked or closed, open standard modal
      if (err?.code !== 'auth/popup-closed-by-user') {
        onOpenAuth();
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <header className="w-full h-16 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 flex items-center justify-between px-3 md:px-6 shrink-0 z-40 relative">
      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-800 pointer-events-none" />

      {/* Brand Logo & Plan Badge */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0 shadow-lg group-hover:border-indigo-500/50 transition-colors">
            <img 
              src="/logo.png" 
              alt="ViralClip AI Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            ViralClip AI
          </span>
        </Link>

        {/* Clickable Plan Badge */}
        <button
          type="button"
          onClick={handlePricingClick}
          title="Click to view & change plans"
          className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>{user?.planName || 'Free Plan'}</span>
        </button>
      </div>

      {/* Center Navigation Links */}
      <div className="hidden sm:flex items-center gap-2">
        <Link
          to="/"
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            location.pathname === '/' ? 'text-white bg-zinc-900 border border-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-white'
          }`}
        >
          AI Generator
        </Link>

        {/* Pricing Button */}
        <button
          type="button"
          onClick={handlePricingClick}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 cursor-pointer shadow-sm active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Pricing (₹49)</span>
        </button>
      </div>

      {/* Right Action / Auth & Credits Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile "Plans" Button - immediately opens plans modal */}
        <button
          type="button"
          onClick={handlePricingClick}
          className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>Plans</span>
        </button>

        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
            >
              {/* Clickable Minutes Pill */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePricingClick(e);
                }}
                title="Click to add more minutes"
                className="hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold cursor-pointer transition-all"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>{typeof user.minutes === 'number' ? (Number.isInteger(user.minutes) ? user.minutes : user.minutes.toFixed(1)) : 5} Mins</span>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-zinc-200 leading-tight">{user.name}</p>
              </div>

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-zinc-900 space-y-2">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-400">Current Plan:</span>
                    <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {user.planName || 'Free Trial'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">Remaining Minutes:</span>
                    <span className="text-xs font-extrabold text-indigo-400">
                      {typeof user.minutes === 'number' ? (Number.isInteger(user.minutes) ? user.minutes : user.minutes.toFixed(1)) : 5} Mins
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      setDropdownOpen(false);
                      handlePricingClick(e);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-amber-400 hover:bg-zinc-900 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 fill-amber-400/20" />
                      Upgrade / Buy Minutes
                    </span>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 font-bold">
                      ₹49 / $5
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleGoogleSignInClick}
            disabled={isLoggingIn}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
            title="Sign in with Google"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isLoggingIn ? 'Signing In...' : 'Login / Sign In'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
