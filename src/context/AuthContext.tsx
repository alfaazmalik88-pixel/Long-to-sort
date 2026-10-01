import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'starter' | 'creator' | 'pro' | 'agency';
  planName: string;
  minutes: number;
  dailyMinutes?: number;
  totalTrialMinutes?: number;
  usedTrialMinutes?: number;
  totalMinutes: number;
  credits: number; // backward compatibility
  totalCredits: number;
  currency: 'INR' | 'USD';
  lastDailyReset?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  upgradePlan: (planId: 'free' | 'starter' | 'creator' | 'pro' | 'agency', currency: 'INR' | 'USD') => void;
  useCredit: (count?: number) => boolean;
  useMinutes: (count?: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'viralclip_user_session';

// Global-only trial constants (only for foreign users where international payments are in setup)
export const GLOBAL_TOTAL_TRIAL_LIMIT = 50; 
export const GLOBAL_DAILY_TRIAL_ALLOWANCE = 10;
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const applyDailyTrialReset = (targetUser: User): User => {
  // INDIA USERS: Standard 5 minutes free trial. NO 10m/50m daily reset.
  if (targetUser.currency === 'INR') {
    if (targetUser.plan === 'free') {
      const curMins = typeof targetUser.minutes === 'number' ? targetUser.minutes : 5;
      return {
        ...targetUser,
        minutes: curMins,
        dailyMinutes: undefined,
        totalTrialMinutes: undefined,
        usedTrialMinutes: undefined,
        totalMinutes: 5,
        credits: curMins,
        totalCredits: 5,
        planName: 'Free Trial'
      };
    }
    return targetUser;
  }

  // GLOBAL (USD) USERS ONLY: 10m daily / 50m total trial because international payment is in setup
  if (targetUser.plan !== 'free') return targetUser;

  const now = Date.now();
  const lastResetTime = targetUser.lastDailyReset ? new Date(targetUser.lastDailyReset).getTime() : 0;
  const usedTrial = typeof targetUser.usedTrialMinutes === 'number' ? targetUser.usedTrialMinutes : 0;
  const remainingTotalTrial = Math.max(0, GLOBAL_TOTAL_TRIAL_LIMIT - usedTrial);

  // If 24 hours have passed or first time initializing
  if (!targetUser.lastDailyReset || (now - lastResetTime >= ONE_DAY_MS)) {
    const freshDaily = Math.min(GLOBAL_DAILY_TRIAL_ALLOWANCE, remainingTotalTrial);
    return {
      ...targetUser,
      minutes: freshDaily,
      dailyMinutes: freshDaily,
      totalTrialMinutes: GLOBAL_TOTAL_TRIAL_LIMIT,
      usedTrialMinutes: usedTrial,
      totalMinutes: GLOBAL_TOTAL_TRIAL_LIMIT,
      credits: freshDaily,
      totalCredits: GLOBAL_TOTAL_TRIAL_LIMIT,
      lastDailyReset: new Date(now).toISOString()
    };
  }

  return {
    ...targetUser,
    dailyMinutes: targetUser.dailyMinutes ?? targetUser.minutes ?? GLOBAL_DAILY_TRIAL_ALLOWANCE,
    totalTrialMinutes: GLOBAL_TOTAL_TRIAL_LIMIT,
    usedTrialMinutes: usedTrial,
    totalMinutes: targetUser.totalMinutes || GLOBAL_TOTAL_TRIAL_LIMIT
  };
};

const PLAN_MINUTES: Record<string, { minutes: number; name: string }> = {
  free: { minutes: 5, name: 'Free Trial' },
  starter: { minutes: 30, name: 'Starter Pack' },
  creator: { minutes: 60, name: 'Creator Pack' },
  pro: { minutes: 160, name: 'Pro Pack' },
  agency: { minutes: 500, name: 'Agency Pack (4K)' }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveUserSession = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(`${STORAGE_KEY}_${newUser.id}`, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Sync with Firebase Auth state listener and local storage
  useEffect(() => {
    // 1. Initial check from local storage for fast render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed: User = JSON.parse(saved);
        parsed.currency = parsed.currency || 'INR';
        parsed.plan = parsed.plan || 'free';
        parsed.planName = parsed.planName || (parsed.currency === 'INR' ? 'Free Trial' : 'Free Trial (50m Quota)');
        parsed = applyDailyTrialReset(parsed);
        setUser(parsed);
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    }

    // 2. Firebase onAuthStateChanged subscription
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let savedCurrency: 'INR' | 'USD' = 'INR';
        let savedMinutes = 5;
        let savedTotal = 5;
        let savedPlan: User['plan'] = 'free';
        let savedPlanName = 'Free Trial';
        let savedUsedTrial = 0;
        let savedLastReset = new Date().toISOString();

        try {
          const userSaved = localStorage.getItem(`${STORAGE_KEY}_${fbUser.uid}`) || localStorage.getItem(STORAGE_KEY);
          if (userSaved) {
            const parsed = JSON.parse(userSaved);
            if (parsed.currency) savedCurrency = parsed.currency;
            if (typeof parsed.minutes === 'number') savedMinutes = parsed.minutes;
            if (typeof parsed.totalMinutes === 'number') savedTotal = parsed.totalMinutes;
            if (parsed.plan) savedPlan = parsed.plan;
            if (parsed.planName) savedPlanName = parsed.planName;
            if (typeof parsed.usedTrialMinutes === 'number') savedUsedTrial = parsed.usedTrialMinutes;
            if (parsed.lastDailyReset) savedLastReset = parsed.lastDailyReset;
          }
        } catch (e) {}

        const isInd = savedCurrency === 'INR';
        const syncedUser: User = applyDailyTrialReset({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Creator',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || undefined,
          plan: savedPlan,
          planName: isInd ? (savedPlan === 'free' ? 'Free Trial' : savedPlanName) : savedPlanName,
          minutes: isInd && savedPlan === 'free' ? Math.min(savedMinutes, 5) : savedMinutes,
          dailyMinutes: isInd ? undefined : savedMinutes,
          totalTrialMinutes: isInd ? undefined : GLOBAL_TOTAL_TRIAL_LIMIT,
          usedTrialMinutes: isInd ? undefined : savedUsedTrial,
          totalMinutes: isInd && savedPlan === 'free' ? 5 : savedTotal,
          credits: isInd && savedPlan === 'free' ? Math.min(savedMinutes, 5) : savedMinutes,
          totalCredits: isInd && savedPlan === 'free' ? 5 : savedTotal,
          currency: savedCurrency,
          lastDailyReset: savedLastReset,
          createdAt: new Date().toISOString()
        });
        saveUserSession(syncedUser);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Periodic 60s check to ensure 24h reset for Global users
  useEffect(() => {
    const checkReset = () => {
      setUser(prev => {
        if (!prev || prev.currency === 'INR' || prev.plan !== 'free') return prev;
        const refreshed = applyDailyTrialReset(prev);
        if (refreshed.minutes !== prev.minutes || refreshed.lastDailyReset !== prev.lastDailyReset) {
          saveUserSession(refreshed);
          return refreshed;
        }
        return prev;
      });
    };

    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 400));
      const userName = email.split('@')[0];
      const savedCurr = localStorage.getItem('app_currency') === 'USD' ? 'USD' : 'INR';
      const isInd = savedCurr === 'INR';

      const loggedUser: User = applyDailyTrialReset({
        id: `usr_${Date.now()}`,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email,
        plan: 'free',
        planName: isInd ? 'Free Trial' : 'Free Trial (50m Quota)',
        minutes: isInd ? 5 : GLOBAL_DAILY_TRIAL_ALLOWANCE,
        dailyMinutes: isInd ? undefined : GLOBAL_DAILY_TRIAL_ALLOWANCE,
        totalTrialMinutes: isInd ? undefined : GLOBAL_TOTAL_TRIAL_LIMIT,
        usedTrialMinutes: 0,
        totalMinutes: isInd ? 5 : GLOBAL_TOTAL_TRIAL_LIMIT,
        credits: isInd ? 5 : GLOBAL_DAILY_TRIAL_ALLOWANCE,
        totalCredits: isInd ? 5 : GLOBAL_TOTAL_TRIAL_LIMIT,
        currency: savedCurr,
        lastDailyReset: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      saveUserSession(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password?: string) => {
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 400));
      const savedCurr = localStorage.getItem('app_currency') === 'USD' ? 'USD' : 'INR';
      const isInd = savedCurr === 'INR';

      const newUser: User = applyDailyTrialReset({
        id: `usr_${Date.now()}`,
        name: name.trim() || email.split('@')[0],
        email,
        plan: 'free',
        planName: isInd ? 'Free Trial' : 'Free Trial (50m Quota)',
        minutes: isInd ? 5 : GLOBAL_DAILY_TRIAL_ALLOWANCE,
        dailyMinutes: isInd ? undefined : GLOBAL_DAILY_TRIAL_ALLOWANCE,
        totalTrialMinutes: isInd ? undefined : GLOBAL_TOTAL_TRIAL_LIMIT,
        usedTrialMinutes: 0,
        totalMinutes: isInd ? 5 : GLOBAL_TOTAL_TRIAL_LIMIT,
        credits: isInd ? 5 : GLOBAL_DAILY_TRIAL_ALLOWANCE,
        totalCredits: isInd ? 5 : GLOBAL_TOTAL_TRIAL_LIMIT,
        currency: savedCurr,
        lastDailyReset: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      saveUserSession(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const savedCurr = localStorage.getItem('app_currency') === 'USD' ? 'USD' : 'INR';
      const isInd = savedCurr === 'INR';

      let savedMinutes = isInd ? 5 : GLOBAL_DAILY_TRIAL_ALLOWANCE;
      let savedTotal = isInd ? 5 : GLOBAL_TOTAL_TRIAL_LIMIT;
      let savedPlan: User['plan'] = 'free';
      let savedPlanName = isInd ? 'Free Trial' : 'Free Trial (50m Quota)';
      let savedCurrency: 'INR' | 'USD' = savedCurr;
      let savedUsedTrial = 0;
      let savedLastReset = new Date().toISOString();

      try {
        const userSaved = localStorage.getItem(`${STORAGE_KEY}_${fbUser.uid}`);
        if (userSaved) {
          const parsed = JSON.parse(userSaved);
          if (typeof parsed.minutes === 'number') savedMinutes = parsed.minutes;
          if (typeof parsed.totalMinutes === 'number') savedTotal = parsed.totalMinutes;
          if (parsed.plan) savedPlan = parsed.plan;
          if (parsed.planName) savedPlanName = parsed.planName;
          if (parsed.currency) savedCurrency = parsed.currency;
          if (typeof parsed.usedTrialMinutes === 'number') savedUsedTrial = parsed.usedTrialMinutes;
          if (parsed.lastDailyReset) savedLastReset = parsed.lastDailyReset;
        }
      } catch (e) {}

      const googleUser: User = applyDailyTrialReset({
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google Creator',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || undefined,
        plan: savedPlan,
        planName: savedPlan === 'free' ? (isInd ? 'Free Trial' : 'Free Trial (50m Quota)') : savedPlanName,
        minutes: isInd && savedPlan === 'free' ? Math.min(savedMinutes, 5) : savedMinutes,
        dailyMinutes: isInd ? undefined : savedMinutes,
        totalTrialMinutes: isInd ? undefined : GLOBAL_TOTAL_TRIAL_LIMIT,
        usedTrialMinutes: isInd ? undefined : savedUsedTrial,
        totalMinutes: isInd && savedPlan === 'free' ? 5 : savedTotal,
        credits: isInd && savedPlan === 'free' ? Math.min(savedMinutes, 5) : savedMinutes,
        totalCredits: isInd && savedPlan === 'free' ? 5 : savedTotal,
        currency: savedCurrency,
        lastDailyReset: savedLastReset,
        createdAt: new Date().toISOString()
      });

      saveUserSession(googleUser);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Firebase signOut error', e);
    }
    saveUserSession(null);
  };

  const upgradePlan = (planId: 'free' | 'starter' | 'creator' | 'pro' | 'agency', currency: 'INR' | 'USD') => {
    const meta = PLAN_MINUTES[planId] || { minutes: 5, name: 'Free Trial' };
    if (!user) {
      const guestUser: User = {
        id: `guest_${Date.now()}`,
        name: 'Guest Creator',
        email: 'guest@viralclipai.in',
        plan: planId,
        planName: meta.name,
        minutes: meta.minutes,
        totalMinutes: meta.minutes,
        credits: meta.minutes,
        totalCredits: meta.minutes,
        currency,
        createdAt: new Date().toISOString()
      };
      saveUserSession(guestUser);
      return;
    }

    const updatedUser: User = {
      ...user,
      plan: planId,
      planName: meta.name,
      minutes: (user.minutes || 0) + meta.minutes,
      totalMinutes: (user.totalMinutes || 0) + meta.minutes,
      credits: (user.minutes || 0) + meta.minutes,
      totalCredits: (user.totalMinutes || 0) + meta.minutes,
      currency
    };
    saveUserSession(updatedUser);
  };

  const useMinutes = (count = 1): boolean => {
    if (!user) return true; // guest preview allowed
    if ((user.minutes || 0) <= 0) return false;
    const toDeduct = Math.min(user.minutes || 0, count);
    const rawRemaining = Math.max(0, (user.minutes || 0) - toDeduct);
    const remaining = Number(rawRemaining.toFixed(1));
    const newUsedTrial = user.plan === 'free' && user.currency === 'USD'
      ? Number(((user.usedTrialMinutes || 0) + toDeduct).toFixed(1))
      : (user.usedTrialMinutes || 0);

    const updatedUser: User = {
      ...user,
      minutes: remaining,
      dailyMinutes: user.currency === 'USD' ? remaining : undefined,
      usedTrialMinutes: newUsedTrial,
      credits: remaining
    };
    saveUserSession(updatedUser);
    return true;
  };

  const useCredit = (count = 1): boolean => {
    return useMinutes(count);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        upgradePlan,
        useCredit,
        useMinutes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
