import React, { useState, useEffect } from 'react';
import { X, AlertCircle, ShieldCheck, Mail, Zap, ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('kamarpatan88@gmail.com');
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Clear all error states whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setError('');
    setSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  // Direct In-Page Sign In (Zero New Tabs, Zero Redirects)
  const handleInPageLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Kripya valid email address enter karein.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await login(email.trim());
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Google Popup Login (Optional fallback)
  const handleGoogleLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      handleClose();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in window band ho gaya. Aap upar direct email se bhi login kar sakte hain.');
      } else {
        const rawMessage = err?.code ? `${err.code}: ${err.message}` : (err?.message || String(err));
        setError(rawMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-950 border border-zinc-800/90 rounded-3xl w-full max-w-sm sm:max-w-md p-5 sm:p-7 shadow-2xl relative text-center"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-3 shadow-lg shadow-indigo-500/10">
          <img
            src="/logo.png"
            alt="ViralClip AI"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Sign In on this Page
        </h2>
        <p className="text-xs text-zinc-400 mt-1 mb-5 leading-relaxed">
          Bina kisi naye page par jaye, direct apne account se login karein aur free export minutes paayein.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-left text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* Direct In-Page Form (Hamare Page Par Hi Login) */}
        <form onSubmit={handleInPageLogin} className="space-y-3 text-left mb-4">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Enter Email Address</span>
              <span className="text-indigo-400 font-semibold normal-case">Direct Login</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Instant Sign In (Hamare Page Par)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-zinc-950 px-2.5 text-[11px] text-zinc-500 font-semibold uppercase">Or with Google</span>
          </div>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-zinc-200 font-semibold text-xs py-2.5 px-4 rounded-xl border border-zinc-800 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
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
          <span>Continue with Google</span>
        </button>

        {/* Security / Privacy badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Safe • Zero Redirects • Free 5 Minutes Active</span>
        </div>
      </div>
    </div>
  );
};
