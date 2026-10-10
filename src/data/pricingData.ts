export interface PricingTier {
  id: 'free' | 'starter' | 'creator' | 'pro' | 'agency';
  name: string;
  price: string;
  numericPrice: number;
  period: string;
  badge?: string;
  popular?: boolean;
  clipsCredit: string;
  totalExport: string;
  supports4K?: boolean;
  features: string[];
  ctaText: string;
  paymentLink?: string;
}

export const PRICING_INR: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '₹0',
    numericPrice: 0,
    period: 'one-time',
    badge: 'One-Time',
    clipsCredit: '5 Free Mins',
    totalExport: '5 Mins One-Time Welcome Trial • Zero Watermark',
    features: [
      '5 Minutes One-Time Trial',
      '1080p Full HD Video',
      'Zero Watermark Guaranteed',
      'Alex Hormozi Captions',
      'Part 1, Part 2 Series Tags'
    ],
    ctaText: 'Current Plan'
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    price: '₹49',
    numericPrice: 49,
    period: 'one-time',
    clipsCredit: '30 Minutes',
    totalExport: '30 Mins Video Processing',
    features: [
      '30 Minutes Processing',
      '1080p Full HD • Zero Watermark',
      'Part 1, Part 2 Series Tags',
      'Credits Never Expire'
    ],
    ctaText: 'Pay ₹49 INR'
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    price: '₹99',
    numericPrice: 99,
    period: 'one-time',
    popular: true,
    badge: 'Popular',
    clipsCredit: '60 Minutes',
    totalExport: '60 Mins Video Processing',
    features: [
      '60 Minutes Processing',
      '1080p Full HD • Zero Watermark',
      'Fast Cloud Processing',
      'Multi-Platform Formats'
    ],
    ctaText: 'Pay ₹99 INR'
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    price: '₹199',
    numericPrice: 199,
    period: 'one-time',
    badge: '4K Upload',
    supports4K: true,
    clipsCredit: '160m (1080p) / 50m (4K)',
    totalExport: '160 Mins 1080p OR 50 Mins 4K',
    features: [
      '160 Mins 1080p / 50 Mins 4K',
      '1080p Full HD • Zero Watermark',
      'VIP High-Speed Render',
      'Commercial License'
    ],
    ctaText: 'Pay ₹199 INR'
  },
  {
    id: 'agency',
    name: 'Agency Pack',
    price: '₹499',
    numericPrice: 499,
    period: 'one-time',
    badge: 'VIP Agency',
    supports4K: true,
    clipsCredit: '500 Minutes',
    totalExport: '500 Mins Video Processing',
    features: [
      '500 Minutes Processing',
      '1080p Full HD • Zero Watermark',
      '4K Upload • Crisp 1080p Render',
      'VIP Priority Pipeline'
    ],
    ctaText: 'Pay ₹499 INR'
  }
];

export const isPlan4KSupported = (planId?: string): boolean => {
  if (!planId) return false;
  return planId === 'pro' || planId === 'agency';
};

export const PRICING_USD: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '$0',
    numericPrice: 0,
    period: 'one-time',
    badge: 'One-Time',
    clipsCredit: '5 Free Mins',
    totalExport: '5 Mins One-Time Welcome Trial • Zero Watermark',
    features: [
      '5 Minutes One-Time Trial',
      '1080p Full HD Video',
      'Zero Watermark Guaranteed',
      'Alex Hormozi Captions',
      'Part 1, Part 2 Series Tags'
    ],
    ctaText: 'Current Plan'
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    price: '$4.99',
    numericPrice: 4.99,
    period: 'one-time',
    clipsCredit: '30 Minutes',
    totalExport: '30 Mins Video Processing',
    features: [
      '30 Minutes Processing',
      '1080p Full HD • Zero Watermark',
      'Part 1, Part 2 Series Tags',
      'Credits Never Expire'
    ],
    ctaText: 'Pay $4.99 USD'
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    price: '$9.99',
    numericPrice: 9.99,
    period: 'one-time',
    popular: true,
    badge: 'Popular',
    clipsCredit: '90 Minutes',
    totalExport: '90 Mins Video Processing',
    features: [
      '90 Minutes Processing',
      '1080p Full HD • Zero Watermark',
      'Fast Cloud Processing',
      'Multi-Platform Formats'
    ],
    ctaText: 'Pay $9.99 USD'
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    price: '$19.99',
    numericPrice: 19.99,
    period: 'one-time',
    badge: '4K Upload',
    supports4K: true,
    clipsCredit: '160m (1080p) / 50m (4K)',
    totalExport: '160 Mins 1080p OR 50 Mins 4K',
    features: [
      '160 Mins 1080p / 50 Mins 4K',
      '1080p Full HD • Zero Watermark',
      'VIP High-Speed Render',
      'Commercial License'
    ],
    ctaText: 'Pay $19.99 USD'
  },
  {
    id: 'agency',
    name: 'Agency Pack',
    price: '$39.99',
    numericPrice: 39.99,
    period: 'one-time',
    badge: 'VIP Agency',
    supports4K: true,
    clipsCredit: '500 Minutes',
    totalExport: '500 Mins Video Processing',
    features: [
      '500 Minutes Processing',
      '1080p Full HD • Zero Watermark',
      '4K Upload • Crisp 1080p Render',
      'VIP Priority Pipeline'
    ],
    ctaText: 'Pay $39.99 USD'
  }
];

export const getPlanDetails = (planId: string, currency: 'INR' | 'USD' = 'INR'): PricingTier | undefined => {
  const list = currency === 'INR' ? PRICING_INR : PRICING_USD;
  return list.find(p => p.id === planId);
};
