import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, ChevronDown, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCountryPricing } from '../utils/countryPricing';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenPricing }) => {
  const { user, isAuthenticated, logout, loginWithGoogle } = useAuth();
  const { currency } = useCountryPricing();
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
    <header className="w-full h-14 md:h-16 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 flex items-center justify-between px-2.5 sm:px-4 md:px-6 shrink-0 z-40 relative">
      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-800 pointer-events-none" />

      {/* Brand Logo & Plan Badge */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0 shadow-lg group-hover:border-indigo-500/50 transition-colors">
            <img 
              src="/logo.png" 
              alt="ViralClip AI Logo" 
              className="w-full h-full object-cover"
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
          <span>{user?.currency === 'USD' && user?.plan === 'free' ? 'Free 10m/Day' : (user?.planName || 'Free Plan')}</span>
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

        {/* Pricing Button */}
        <button
          type="button"
          onClick={handlePricingClick}
          className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 cursor-pointer shadow-sm active:scale-95 shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Plans (₹49)</span>
        </button>
      </div>

      {/* Right Action / Auth & Credits Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Mobile "Plans" Button - compact & separated */}
        <button
          type="button"
          onClick={handlePricingClick}
          className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Zap className="w-3 h-3 fill-amber-400" />
          <span>{currency === 'INR' ? 'Plans (₹49)' : 'Plans ($5)'}</span>
        </button>

        {isAuthenticated && user ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 p-1 pl-2 sm:p-1.5 sm:pl-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer shrink-0"
            >
              {/* Clickable Minutes Pill */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePricingClick(e);
                }}
                title={user?.currency === 'USD' && user?.plan === 'free' ? "Daily 10m Free Trial • Auto-resets every 24h" : "Click to view / buy minutes"}
                className="hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold cursor-pointer transition-all"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>
                  {typeof user.minutes === 'number' ? (Number.isInteger(user.minutes) ? user.minutes : user.minutes.toFixed(1)) : 5} {user?.currency === 'USD' && user?.plan === 'free' ? 'm Today' : 'Mins'}
                </span>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-zinc-200 leading-tight">{user.name}</p>
              </div>

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-zinc-700"
                />
              ) : (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-zinc-900 space-y-2">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-400">Current Plan:</span>
                    <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {user.currency === 'USD' && user.plan === 'free' ? 'Free 10m/Day' : (user.planName || 'Free Plan')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      {user.currency === 'USD' && user.plan === 'free' ? "Today's Free Minutes:" : "Remaining Minutes:"}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-400">
                      {typeof user.minutes === 'number' ? (Number.isInteger(user.minutes) ? user.minutes : user.minutes.toFixed(1)) : 5} Mins
                    </span>
                  </div>

                  {user.currency === 'USD' && user.plan === 'free' && (
                    <div className="text-[10px] text-zinc-400 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Total Trial Quota:</span>
                        <span className="text-zinc-200">50 Minutes Total</span>
                      </div>
                      <div className="flex justify-between text-zinc-500">
                        <span>Daily Allowance:</span>
                        <span className="text-emerald-400">10 Mins / 24 Hours</span>
                      </div>
                      <div className="text-amber-400/90 pt-0.5 text-[9px]">
                        ⚡ Resets automatically every 24 hours
                      </div>
                    </div>
                  )}
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
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 shrink-0"
            title="Sign In"
          >
            <UserIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="sm:hidden">Sign In</span>
            <span className="hidden sm:inline">Login / Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
