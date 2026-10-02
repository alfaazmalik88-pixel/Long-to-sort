import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Flame, Shield, ArrowRight, Lock } from 'lucide-react';
import { PRICING_INR, PRICING_USD, PricingTier } from '../data/pricingData';
import { CheckoutModal } from './CheckoutModal';
import { useAuth } from '../context/AuthContext';
import { useCountryPricing } from '../utils/countryPricing';

interface PricingSectionProps {
  onOpenAuth?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenAuth }) => {
  const { currency, setCurrency, isIndia } = useCountryPricing();
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth();

  const tiers = currency === 'INR' ? PRICING_INR : PRICING_USD;

  const handleSelectPlan = (tier: PricingTier) => {
    if (!user && onOpenAuth) {
      onOpenAuth();
      return;
    }
    if (tier.id === 'free') {
      return;
    }
    // Strict lock on Global paid plans so users cannot click and activate credits without payment
    if (currency === 'USD') {
      alert("🔒 Global payment integration (PayPal & International Cards) is in setup. Global paid plans are locked to prevent unauthorized credit activation. Please use your Free 10 Mins/Day (50 Mins Total) Trial or pay via India (INR) UPI/Cards!");
      return;
    }
    setSelectedTier(tier);
    setIsCheckoutOpen(true);
  };

  const getTierIcon = (id: string) => {
    switch (id) {
      case 'starter':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'creator':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'pro':
        return <Crown className="w-5 h-5 text-indigo-400" />;
      case 'agency':
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <section id="pricing" className="w-full py-16 px-4 md:px-8 bg-black relative overflow-hidden border-t border-zinc-900">
      {/* Lightweight Instant Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Currency Switcher */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          {/* Currency Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-zinc-950 p-1 rounded-2xl border border-zinc-800 flex items-center shadow-lg">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>🇮🇳 India (INR ₹)</span>
              </button>

              {isIndia ? (
                <button
                  type="button"
                  onClick={() => {
                    alert("🔒 Global payment is locked for India users. Please use India (INR ₹) UPI/Cards or enjoy the Free 10 Mins/Day (50 Mins Total) Trial!");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold text-zinc-500 hover:text-zinc-400 cursor-not-allowed bg-zinc-900/40 transition-all"
                  title="Global payments locked for India users"
                >
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>🌐 Global (USD $)</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400/90 border border-zinc-700/60">
                    Locked
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>🌐 Global (USD $)</span>
                </button>
              )}
            </div>
          </div>

          {/* No Auto-Debit Guarantee in English */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold shadow-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% One-Time Payment • No Auto-Debit • Never Automatically Deducted</span>
          </div>
        </div>

        {/* Pricing Cards Grid (5 Tiers - Compact, Sleek & Smaller) */}
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
                    : 'bg-zinc-950/90 border-zinc-800/90 hover:border-indigo-500/40 hover:shadow-md'
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
                    <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      {getTierIcon(tier.id)}
                    </div>
                  </div>

                  {/* Price + Dollar/INR Add-on */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{tier.price}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">/{tier.period}</span>
                    </div>

                    {/* Dollar / INR Dual-Currency Addon Pill */}
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shadow-xs">
                        {currency === 'INR' ? `≈ ${tier.usdEquivalent}` : `≈ ${tier.inrEquivalent}`}
                      </span>
                    </div>

                    {/* Minutes Badge */}
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                      <span>{tier.clipsCredit}</span>
                    </div>
                  </div>

                  {/* Feature List (Compact & Clean) */}
                  <ul className="py-2.5 space-y-1.5 border-t border-zinc-900">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-300">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA: Compact button */}
                <div className="pt-2.5 border-t border-zinc-900">
                  {currency === 'USD' && tier.id !== 'free' ? (
                    <button
                      type="button"
                      onClick={() => {
                        alert("🔒 Global payment integration is currently in setup. Global paid plans are locked to prevent unauthorized credit activation. Please use your Free 10 Mins/Day (50 Mins Total) Trial or switch to India (INR)!");
                      }}
                      className="w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-zinc-900/80 border border-zinc-800 text-zinc-500 cursor-not-allowed hover:border-zinc-700"
                    >
                      <Lock className="w-3 h-3 text-amber-500/80" />
                      <span className="truncate">Locked (Setup in Progress)</span>
                    </button>
                  ) : (
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
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Currency Lock Notice */}
        <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-3 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🇮🇳</span>
            <span className="text-zinc-300 font-semibold text-[11px] sm:text-xs">
              India Gateway Active: Pay in ₹ INR via Razorpay UPI (GPay, PhonePe, Paytm), RuPay & Cards
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold text-[11px] sm:text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Global USD Payments: Locked (Setup in Progress) • Use Free 10m/Day (50m Total) Trial
            </span>
          </div>
        </div>

        {/* Trust Badges footer */}
        <div className="pt-8 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1 p-3">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold text-zinc-300">Zero Watermark</span>
            <span className="text-[11px] text-zinc-500">Pure creator branding</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-zinc-300">Instant AI Split</span>
            <span className="text-[11px] text-zinc-500">Detects viral moments</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold text-zinc-300">1080p Ultra HD</span>
            <span className="text-[11px] text-zinc-500">Max bitrate rendering</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3">
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold text-zinc-300">Lifetime Validity</span>
            <span className="text-[11px] text-zinc-500">Credits never expire</span>
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
        }}
      />
    </section>
  );
};
