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
  totalMinutes: number;
  credits: number; // backward compatibility
  totalCredits: number;
  currency: 'INR' | 'USD';
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
        const parsed = JSON.parse(saved);
        if (typeof parsed.minutes !== 'number') {
          parsed.minutes = parsed.credits && parsed.credits > 2 ? parsed.credits : 5;
          parsed.totalMinutes = parsed.minutes;
        }
        parsed.credits = parsed.minutes;
        parsed.totalCredits = parsed.totalMinutes;
        parsed.plan = parsed.plan || 'free';
        parsed.planName = parsed.planName || 'Free Trial';
        parsed.currency = parsed.currency || 'INR';
        setUser(parsed);
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    }

    // 2. Firebase onAuthStateChanged subscription
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let savedMinutes = 5;
        let savedTotal = 5;
        let savedPlan: User['plan'] = 'free';
        let savedPlanName = 'Free Trial';
        let savedCurrency: 'INR' | 'USD' = 'INR';

        try {
          const userSaved = localStorage.getItem(`${STORAGE_KEY}_${fbUser.uid}`) || localStorage.getItem(STORAGE_KEY);
          if (userSaved) {
            const parsed = JSON.parse(userSaved);
            if (typeof parsed.minutes === 'number') savedMinutes = parsed.minutes;
            if (typeof parsed.totalMinutes === 'number') savedTotal = parsed.totalMinutes;
            if (parsed.plan) savedPlan = parsed.plan;
            if (parsed.planName) savedPlanName = parsed.planName;
            if (parsed.currency) savedCurrency = parsed.currency;
          }
        } catch (e) {}

        const syncedUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Creator',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || undefined,
          plan: savedPlan,
          planName: savedPlanName,
          minutes: savedMinutes,
          totalMinutes: savedTotal,
          credits: savedMinutes,
          totalCredits: savedTotal,
          currency: savedCurrency,
          createdAt: new Date().toISOString()
        };
        saveUserSession(syncedUser);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 400));
      const userName = email.split('@')[0];
      const loggedUser: User = {
        id: `usr_${Date.now()}`,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email,
        plan: 'free',
        planName: 'Free Trial',
        minutes: 5,
        totalMinutes: 5,
        credits: 5,
        totalCredits: 5,
        currency: 'INR',
        createdAt: new Date().toISOString()
      };
      saveUserSession(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password?: string) => {
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 400));
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: name.trim() || email.split('@')[0],
        email,
        plan: 'free',
        planName: 'Free Trial',
        minutes: 5,
        totalMinutes: 5,
        credits: 5,
        totalCredits: 5,
        currency: 'INR',
        createdAt: new Date().toISOString()
      };
      saveUserSession(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In using Firebase Auth signInWithPopup and GoogleAuthProvider
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      let savedMinutes = 5;
      let savedTotal = 5;
      let savedPlan: User['plan'] = 'free';
      let savedPlanName = 'Free Trial';
      let savedCurrency: 'INR' | 'USD' = 'INR';

      try {
        const userSaved = localStorage.getItem(`${STORAGE_KEY}_${fbUser.uid}`);
        if (userSaved) {
          const parsed = JSON.parse(userSaved);
          if (typeof parsed.minutes === 'number') savedMinutes = parsed.minutes;
          if (typeof parsed.totalMinutes === 'number') savedTotal = parsed.totalMinutes;
          if (parsed.plan) savedPlan = parsed.plan;
          if (parsed.planName) savedPlanName = parsed.planName;
          if (parsed.currency) savedCurrency = parsed.currency;
        }
      } catch (e) {}

      const googleUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google Creator',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || undefined,
        plan: savedPlan,
        planName: savedPlanName,
        minutes: savedMinutes,
        totalMinutes: savedTotal,
        credits: savedMinutes,
        totalCredits: savedTotal,
        currency: savedCurrency,
        createdAt: new Date().toISOString()
      };

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
    const updatedUser: User = {
      ...user,
      minutes: remaining,
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
