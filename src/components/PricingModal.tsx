import React, { useState, useRef } from 'react';
import { X, Check, Sparkles, Zap, Crown, Flame, ArrowRight, Shield } from 'lucide-react';
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
    if (tier.id === 'free') {
      if (!user && onOpenAuth) {
        onClose();
        onOpenAuth();
      } else {
        onClose();
      }
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
    <div className="fixed inset-0 z-[260] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-zinc-950/90 backdrop-blur z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Select Your Plan
              </h2>
              <p className="text-xs text-zinc-400">Zero Watermark • 4K Upload & 1080p Full HD Render • No Monthly Subscriptions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector inside modal */}
            <div className="bg-zinc-900 p-0.5 rounded-xl border border-zinc-800 flex items-center">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                $ USD
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Fast Side Line Indicator */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
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
            className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar overscroll-y-contain"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
            {tiers.map((tier) => {
              const isPopular = tier.popular;
              const isCurrent = user?.plan === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-4 flex flex-col justify-between relative transition-all duration-200 border ${
                    isPopular
                      ? 'bg-gradient-to-b from-indigo-950/70 to-zinc-950 border-indigo-500 shadow-xl shadow-indigo-500/20'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10'
                  }`}
                >
                  {/* Floating Badge */}
                  {tier.badge && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    {/* Title & Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white">{tier.name}</span>
                      <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        {getTierIcon(tier.id)}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white tracking-tight">{tier.price}</span>
                        <span className="text-[11px] text-zinc-400 font-medium">/{tier.period}</span>
                      </div>
                      {/* Badge (Pill) */}
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{tier.clipsCredit}</span>
                      </div>
                    </div>

                    {/* Sub-text: Total Video Processing */}
                    <div className="text-[11px] text-zinc-300 font-semibold pb-3 border-b border-zinc-800/80 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50 shrink-0"></span>
                        <span className="leading-snug">{tier.totalExport}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="py-4 space-y-2.5">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action button: Blue on all cards */}
                  <div className="pt-3 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(tier)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md ${
                        isCurrent && tier.id === 'free'
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-[0.98]'
                      }`}
                    >
                      <span>{isCurrent && tier.id === 'free' ? 'Current Free Plan' : tier.ctaText}</span>
                      <ArrowRight className="w-3 h-3" />
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
              <span>One-Time Payment • No Auto-Renewal</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Checkout Modal */}
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
