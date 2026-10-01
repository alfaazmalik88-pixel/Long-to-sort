import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Flame, Shield, ArrowRight } from 'lucide-react';
import { PRICING_INR, PRICING_USD, PricingTier } from '../data/pricingData';
import { CheckoutModal } from './CheckoutModal';
import { useAuth } from '../context/AuthContext';
import { useCountryPricing } from '../utils/countryPricing';

interface PricingSectionProps {
  onOpenAuth?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenAuth }) => {
  const { currency, setCurrency, isIndia, isVpnBlocked } = useCountryPricing();
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth();

  const tiers = currency === 'INR' ? PRICING_INR : PRICING_USD;

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.id === 'free') {
      if (!user && onOpenAuth) {
        onOpenAuth();
      }
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
        <div className="text-center space-y-4 max-w-2xl mx-auto">
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
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid (5 Tiers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
          {tiers.map((tier) => {
            const isPopular = tier.popular;
            const isCurrent = user?.plan === tier.id;

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-5 flex flex-col justify-between relative transition-all duration-200 border ${
                  isPopular
                    ? 'bg-gradient-to-b from-indigo-950/70 to-zinc-950 border-indigo-500 shadow-xl shadow-indigo-500/20 xl:-translate-y-2'
                    : 'bg-zinc-950 border-zinc-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
              >
                {/* Floating Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}

                <div>
                  {/* Title & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white tracking-wide">{tier.name}</span>
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
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
                  <div className="text-[11px] text-zinc-300 font-semibold pb-3 border-b border-zinc-900 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50 shrink-0"></span>
                      <span className="leading-snug">{tier.totalExport}</span>
                    </div>
                  </div>

                  {/* Feature List */}
                  <ul className="py-4 space-y-2.5">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA: Blue button on all cards */}
                <div className="pt-3 border-t border-zinc-900">
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
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
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

      {/* Checkout Dialog */}
      <CheckoutModal
        tier={selectedTier ? tiers.find(t => t.id === selectedTier.id) || selectedTier : null}
        currency={currency}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(_tier) => {
          // Success handled in modal
        }}
      />
    </section>
  );
};
