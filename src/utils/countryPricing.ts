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
  return { country: 'GLOBAL', currency: 'USD' };
};

export const useCountryPricing = () => {
  const [detectedData, setDetectedData] = useState<{ country: string; currency: Currency }>(() => detectCountryAndCurrency());
  const [currency, setCurrencyState] = useState<Currency>(() => detectCountryAndCurrency().currency);
  const [country, setCountry] = useState<string>(() => detectCountryAndCurrency().country);

  useEffect(() => {
    // Check IP-based location from server
    fetch('/api/detect-country')
      .then(res => res.json())
      .then(data => {
        if (data && data.country) {
          const isIndia = data.country === 'IN';
          const newCountry = data.country;
          const newCurrency: Currency = isIndia ? 'INR' : 'USD';
          
          setCountry(newCountry);
          setCurrencyState(newCurrency);
          setDetectedData({ country: newCountry, currency: newCurrency });
          localStorage.setItem('app_currency', newCurrency);
        }
      })
      .catch(() => {});
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('app_currency', c);
  };

  const isIndia = country === 'IN' || currency === 'INR';

  return {
    currency,
    setCurrency,
    country,
    isIndia,
    isGlobalUser: !isIndia,
    isGlobalLockedForIndia: false,
    paymentGateway: currency === 'INR' ? 'Razorpay UPI & Cards' : 'Polar.sh Global Checkout (Cards & Apple Pay)',
    isDetected: true
  };
};
