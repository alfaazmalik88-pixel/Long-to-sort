import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, CreditCard, QrCode, ArrowRight, Sparkles } from 'lucide-react';
import { PricingTier } from '../data/pricingData';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  tier: PricingTier | null;
  currency: 'INR' | 'USD';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tier: PricingTier) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  tier,
  currency,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, upgradePlan } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen || !tier) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Instant direct activation
    setTimeout(() => {
      upgradePlan(tier.id, currency);
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onSuccess(tier);
        onClose();
        setCompleted(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Instant Credit Activation</h3>
              <p className="text-xs text-zinc-400">100% Safe & Secure Checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
            <p className="text-sm text-zinc-400">
              <span className="text-indigo-400 font-semibold">{tier.name}</span> has been activated. Your clip credits have been credited to your account!
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Plan Summary Card */}
            <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-zinc-900 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{tier.name}</span>
                  {tier.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  <span>{tier.clipsCredit}</span>
                </div>
                <p className="text-[11px] text-zinc-300 font-medium mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{tier.totalExport}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-white">{tier.price}</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{tier.period}</div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select Payment Method
              </label>

              {currency === 'INR' ? (
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'upi'
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>UPI App</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'qr'
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Card / Net</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'upi'
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Global Express Pay</span>
                  </button>
                </div>
              )}
            </div>

            {/* Input Details */}
            <form onSubmit={handlePay} className="space-y-4">
              {paymentMethod === 'upi' && currency === 'INR' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    UPI ID (Google Pay, PhonePe, Paytm)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank / yourname@upi"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">Instant approval with zero convenience fee</p>
                </div>
              )}

              {paymentMethod === 'qr' && currency === 'INR' && (
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
                    {/* Visual QR representation */}
                    <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-zinc-100 rounded">
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-zinc-400 rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-zinc-200 rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-zinc-300 rounded-sm"></div>
                      <div className="bg-zinc-300 rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-zinc-300 rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Scan with any UPI App (GPay, PhonePe, Paytm, BHIM) to pay <span className="text-white font-bold">{tier.price}</span>
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
              >
                {processing ? (
                  <>
                    <span className="inline-block animate-spin mr-1">⌛</span>
                    <span>Confirming Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {tier.price} & Activate Instantly</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {currency === 'INR'
                    ? '⚡ Powered by Cashfree Payments (UPI, PhonePe, GPay, Cards)'
                    : '🔒 Powered by Stripe (Global Cards, Apple Pay, 256-Bit SSL)'}
                </span>
              </div>
              <div className="text-center text-[10px] text-zinc-500">
                100% Secure • No Auto-Debit • One-Time Activation
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
