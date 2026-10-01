import { useState, useEffect } from 'react';

export type Currency = 'INR' | 'USD';

export const detectCountryAndCurrency = (): { country: string; currency: Currency } => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const offset = new Date().getTimezoneOffset(); // In India, offset is always -330 (UTC+5:30)

    // Check Indian timezone
    const isIndiaTimezone = 
      offset === -330 ||
      timeZone === 'Asia/Kolkata' ||
      timeZone === 'Asia/Calcutta' ||
      timeZone.includes('Calcutta') ||
      timeZone.includes('Kolkata') ||
      timeZone.includes('India') ||
      timeZone.includes('IST');

    if (isIndiaTimezone) {
      return { country: 'IN', currency: 'INR' };
    }
  } catch (e) {}

  // Outside India -> Default to Global USD ($)
  return { country: 'US', currency: 'USD' };
};

export const useCountryPricing = () => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('app_currency');
    if (saved === 'INR' || saved === 'USD') return saved;
    return detectCountryAndCurrency().currency;
  });

  const [country, setCountry] = useState<string>(() => detectCountryAndCurrency().country);
  const [isDetected, setIsDetected] = useState<boolean>(true);

  useEffect(() => {
    // Listen for currency changes across components
    const handleCurrencyChange = (e: CustomEvent<Currency>) => {
      if (e.detail && (e.detail === 'INR' || e.detail === 'USD')) {
        setCurrencyState(e.detail);
      }
    };
    window.addEventListener('currency_change' as any, handleCurrencyChange);

    // IP-based Country & VPN Detection
    fetch('/api/detect-country')
      .then(res => res.json())
      .then(data => {
        if (data && (data.currency === 'INR' || data.currency === 'USD')) {
          const manualChoice = localStorage.getItem('app_currency_manual');
          // If no manual toggle forced or if user is testing with VPN, adopt IP currency
          if (!manualChoice) {
            setCurrencyState(data.currency);
            if (data.country) setCountry(data.country);
          }
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('currency_change' as any, handleCurrencyChange);
    };
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('app_currency', c);
    localStorage.setItem('app_currency_manual', 'true');
    window.dispatchEvent(new CustomEvent('currency_change', { detail: c }));
  };

  return {
    currency,
    setCurrency,
    country,
    isIndia: currency === 'INR',
    paymentGateway: currency === 'INR' ? 'Cashfree' : 'Cashfree Global & PayPal',
    isDetected
  };
};
