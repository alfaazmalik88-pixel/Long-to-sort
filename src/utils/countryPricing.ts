import { useState, useEffect } from 'react';

export type Currency = 'INR' | 'USD';

export const detectCountryAndCurrency = async (): Promise<{ country: string; currency: Currency }> => {
  try {
    const res = await fetch('https://country.is/', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.country === 'IN') {
        return { country: 'IN', currency: 'INR' };
      }
      return { country: data?.country || 'US', currency: 'USD' };
    }
  } catch (err) {
    console.warn('Country detection error, checking timezone fallback:', err);
  }

  // Fallback: check browser locale / timezone
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && (timeZone.includes('Calcutta') || timeZone.includes('Kolkata') || timeZone.includes('India'))) {
      return { country: 'IN', currency: 'INR' };
    }
  } catch (e) {}

  return { country: 'US', currency: 'USD' };
};

export const useCountryPricing = () => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('app_currency');
    if (saved === 'INR' || saved === 'USD') return saved;
    return 'INR'; // default initial until detected
  });

  const [country, setCountry] = useState<string>('IN');
  const [isDetected, setIsDetected] = useState<boolean>(false);

  useEffect(() => {
    // Listen for currency changes across components
    const handleCurrencyChange = (e: CustomEvent<Currency>) => {
      if (e.detail && (e.detail === 'INR' || e.detail === 'USD')) {
        setCurrencyState(e.detail);
      }
    };
    window.addEventListener('currency_change' as any, handleCurrencyChange);

    const saved = localStorage.getItem('app_currency');
    if (saved === 'INR' || saved === 'USD') {
      setCurrencyState(saved);
      setIsDetected(true);
      return () => {
        window.removeEventListener('currency_change' as any, handleCurrencyChange);
      };
    }

    detectCountryAndCurrency().then(({ country: detectedCountry, currency: detectedCurrency }) => {
      setCountry(detectedCountry);
      setCurrencyState(detectedCurrency);
      setIsDetected(true);
      localStorage.setItem('app_currency', detectedCurrency);
      window.dispatchEvent(new CustomEvent('currency_change', { detail: detectedCurrency }));
    });

    return () => {
      window.removeEventListener('currency_change' as any, handleCurrencyChange);
    };
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('app_currency', c);
    window.dispatchEvent(new CustomEvent('currency_change', { detail: c }));
  };

  return {
    currency,
    setCurrency,
    country,
    isIndia: currency === 'INR',
    paymentGateway: currency === 'INR' ? 'Cashfree' : 'Stripe',
    isDetected
  };
};
