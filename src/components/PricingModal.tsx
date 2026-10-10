import React, { useState, useRef } from 'react';
import { X, Check, Sparkles, Zap, Crown, Flame, ArrowRight, Shield, Lock } from 'lucide-react';
import { PRICING_INR, PRICING_USD, PricingTier } from '../data/pricingData';
import { CheckoutModal } from './CheckoutModal';
import { useAuth } from '../context/AuthContext';
import { useCountryPricing } from '../utils/countryPricing';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth
}) => {
  const { currency, setCurrency, isIndia, paymentGateway } = useCountryPricing();
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth();
  const sideScrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);

  const handleFastScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      const total = el.scrollHeight - el.clientHeight;
      if (total > 0 && sideScrollIndicatorRef.current) {
        const pct = (el.scrollTop / total) * 100;
        sideScrollIndicatorRef.current.style.height = `${Math.min(100, Math.max(3, pct))}%`;
      }
    });
  };

  if (!isOpen) return null;

  const tiers = currency === 'INR' ? PRICING_INR : PRICING_USD;

  const handleSelectPlan = (tier: PricingTier) => {
    if (!user && onOpenAuth) {
      onClose();
      onOpenAuth();
      return;
    }
    if (tier.id === 'free') {
      onClose();
      return;
    }
    setSelectedTier(tier);
    setIsCheckoutOpen(true);
  };

  const getTierIcon = (id: string) => {
    switch (id) {
      case 'starter':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'creator':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'pro':
        return <Crown className="w-4 h-4 text-indigo-400" />;
      case 'agency':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[260] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-6xl h-[92vh] max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar - Permanently Fixed at Top */}
        <div className="p-3 sm:p-4 border-b border-zinc-900 shrink-0 bg-zinc-950 sticky top-0 z-30 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400/20" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight truncate">
                  Select Your Plan
                </h2>
                <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                  Zero Watermark • 4K Upload • 1080p Full HD Render
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop Currency Selector */}
              <div className="hidden sm:flex bg-zinc-900 p-0.5 rounded-xl border border-zinc-800 items-center">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    currency === 'INR'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🇮🇳 ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    currency === 'USD'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🌐 $ USD
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors shrink-0 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Currency Selector */}
          <div className="sm:hidden flex items-center justify-center w-full">
            <div className="bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 flex items-center w-full max-w-xs justify-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                  currency === 'INR'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🇮🇳 ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                  currency === 'USD'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🌐 $ USD
              </button>
            </div>
          </div>

          {/* No Auto-Debit Guarantee Banner in English */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-[11px] sm:text-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% One-Time Payment • No Auto-Debit • No Hidden Recurring Charges</span>
            </div>
            <span className="hidden sm:inline text-[10px] text-zinc-400 font-medium">
              Never automatically deducted
            </span>
          </div>
        </div>

        {/* Scrollable Container with Fast Side Line Indicator */}
        <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Ultra-Fast Responsive Side Scroll Line Indicator */}
          <div className="absolute top-0 right-0 bottom-0 w-[4px] bg-zinc-900/30 pointer-events-none z-30">
            <div 
              ref={sideScrollIndicatorRef}
              className="w-full bg-gradient-to-b from-indigo-500 via-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.9)] rounded-full will-change-[height]"
              style={{ height: '4%' }}
            />
          </div>

          <div 
            onScroll={handleFastScroll}
            className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar overscroll-contain pt-3 pb-24 sm:pb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 items-stretch">
            {tiers.map((tier) => {
              const isPopular = tier.popular;
              const isCurrent = user?.plan === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between relative transition-all duration-200 border ${
                    isPopular
                      ? 'bg-gradient-to-b from-indigo-950/70 via-zinc-950 to-zinc-950 border-indigo-500 shadow-lg shadow-indigo-500/20'
                      : 'bg-zinc-900/60 border-zinc-800/90 hover:border-indigo-500/40 hover:shadow-md'
                  }`}
                >
                  {/* Floating Badge */}
                  {tier.badge && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    {/* Title & Icon */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">{tier.name}</span>
                      <div className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                        {getTierIcon(tier.id)}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{tier.price}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">/{tier.period}</span>
                      </div>

                      {/* Minutes Badge */}
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                        <span>{tier.clipsCredit}</span>
                      </div>
                    </div>

                    {/* Features list (Compact & Clean) */}
                    <ul className="py-2.5 space-y-1.5 border-t border-zinc-800/80">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-300">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action button: Compact on all cards */}
                  <div className="pt-2.5 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(tier)}
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-sm ${
                        isCurrent && tier.id === 'free'
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-[0.98]'
                      }`}
                    >
                      <span className="truncate">{isCurrent && tier.id === 'free' ? 'Current Free' : tier.ctaText}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Trust row */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-3 flex flex-wrap items-center justify-around gap-2 text-center text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Zero Watermark Guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Full HD 1080p Export</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currency === 'INR' ? 'Razorpay UPI & Cards' : 'Polar.sh Global Checkout'}</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Checkout Payment Dialog */}
      <CheckoutModal
        tier={selectedTier ? tiers.find(t => t.id === selectedTier.id) || selectedTier : null}
        currency={currency}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(_tier) => {
          setIsCheckoutOpen(false);
          onClose();
        }}
      />
    </div>
  );
};
