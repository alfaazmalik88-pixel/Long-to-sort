import React, { useState, useRef, useEffect } from 'react';
import { Zap, BookOpen, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { formatMinutesAndSeconds } from '../utils/formatTime';

interface HeaderProps {
  onOpenAuth?: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenPricing }) => {
  const { user, isAuthenticated, logout, loginWithGoogle } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.warn('Google sign-in completed or triggered:', err);
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

        {/* Clickable Plan Badge (Desktop & Tablet only) */}
        {isAuthenticated && user && (
          <button
            type="button"
            onClick={handlePricingClick}
            title="Click to view & change plans"
            className="hidden sm:flex text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>{user.planName || 'Pro Pack'}</span>
          </button>
        )}
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

      {/* Right Actions: Plans & Google Login / Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0">
        <button
          type="button"
          onClick={handlePricingClick}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="hidden xs:inline sm:inline">Plans (₹49)</span>
          <span className="xs:hidden sm:hidden">Plans</span>
        </button>

        {/* Authenticated: Google User Profile Dropdown */}
        {isAuthenticated && user ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs text-zinc-200 transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="User profile menu"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-600"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline font-semibold text-zinc-200 max-w-[90px] truncate text-xs">
                {user.name || user.email?.split('@')[0]}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800/90 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Info Header */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800/80 px-1">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-500/50 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-inner shrink-0">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span className="truncate">{user.name || 'Viral Creator'}</span>
                      <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
                        Google
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                  </div>
                </div>

                {/* Minutes / Plan Quota */}
                <div className="py-2.5 px-2.5 my-2.5 bg-zinc-900/70 border border-zinc-800/60 rounded-xl">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">Active Plan:</span>
                    <span className="text-indigo-300 font-bold">{user.planName || 'Pro Pack'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className="text-zinc-300 font-medium">Credits Quota:</span>
                    <span className="text-amber-300 font-extrabold">
                      {typeof user.minutes === 'number'
                        ? (user.minutes % 1 === 0 ? `${user.minutes} mins` : `${user.minutes} mins (${formatMinutesAndSeconds(user.minutes)})`)
                        : '0 mins'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      handlePricingClick({ preventDefault: () => {} } as any);
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors cursor-pointer font-semibold"
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Change or Upgrade Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Unauthenticated: Google Login Button */
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 active:scale-95 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60 shrink-0"
            title="Sign in with your Google account"
          >
            {isLoggingIn ? (
              <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="hidden xs:inline sm:inline">Google Login</span>
            <span className="xs:hidden sm:hidden">Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
