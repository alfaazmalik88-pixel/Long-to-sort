export interface PricingTier {
  id: 'free' | 'starter' | 'creator' | 'pro' | 'agency';
  name: string;
  price: string;
  numericPrice: number;
  period: string;
  badge?: string;
  popular?: boolean;
  clipsCredit: string; // Badge (Pill) - Minutes
  totalExport: string; // Sub-text: Total Video Processing
  supports4K?: boolean;
  features: string[];  // Features Checklist
  ctaText: string;
}

export const PRICING_INR: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '₹0',
    numericPrice: 0,
    period: 'forever',
    clipsCredit: '5 Minutes',
    totalExport: 'Up to 5 Minutes Total Video Processing',
    features: [
      '5 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      'Part 1, Part 2 Series Tags',
      'Instant Cloud Preview'
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
    totalExport: 'Up to 30 Minutes Total Video Processing',
    features: [
      '30 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      'Part 1, Part 2 Series Tags',
      'Credits Never Expire'
    ],
    ctaText: 'Get Starter Pack'
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    price: '₹99',
    numericPrice: 99,
    period: 'one-time',
    popular: true,
    badge: 'Most Popular',
    clipsCredit: '60 Minutes',
    totalExport: 'Up to 60 Minutes Total Video Processing',
    features: [
      '60 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      'Priority Cloud Processing',
      'Multi-Platform Formats'
    ],
    ctaText: 'Get Creator Pack'
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
    totalExport: '160 Mins 1080p Upload OR 50 Mins 4K Upload • Render in 1080p Full HD',
    features: [
      '160 Mins (1080p Upload) OR 50 Mins (4K Upload)',
      '1080p Full HD Download & Zero Watermark',
      '4K Source Upload (Exports rendered in Crisp 1080p Full HD)',
      'VIP High-Speed Render Queue',
      'Commercial Use License'
    ],
    ctaText: 'Get Pro Pack'
  },
  {
    id: 'agency',
    name: 'Agency Pack',
    price: '₹499',
    numericPrice: 499,
    period: 'one-time',
    badge: 'VIP 4K Upload',
    supports4K: true,
    clipsCredit: '500 Minutes',
    totalExport: 'Up to 500 Minutes Total Video Processing • Render in 1080p',
    features: [
      '500 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      '4K Source Upload (Exports rendered in Crisp 1080p Full HD)',
      'VIP Priority Render Pipeline'
    ],
    ctaText: 'Get Agency Pack'
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
    period: 'forever',
    clipsCredit: '5 Minutes',
    totalExport: 'Up to 5 Minutes Total Video Processing',
    features: [
      '5 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      'Part 1, Part 2 Series Tags',
      'Instant Cloud Preview'
    ],
    ctaText: 'Start Free'
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    price: '$4.99',
    numericPrice: 4.99,
    period: 'one-time',
    clipsCredit: '30 Minutes',
    totalExport: 'Up to 30 Minutes Total Video Processing',
    features: [
      '30 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      'Part 1, Part 2 Series Tags',
      'Credits Never Expire'
    ],
    ctaText: 'Choose Starter'
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    price: '$9.99',
    numericPrice: 9.99,
    period: 'one-time',
    popular: true,
    badge: 'Creator Choice',
    clipsCredit: '90 Minutes',
    totalExport: 'Up to 90 Minutes Total Video Processing',
    features: [
      '90 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      'Priority Cloud Processing',
      'Multi-Platform Formats'
    ],
    ctaText: 'Choose Creator'
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
    totalExport: '160 Mins 1080p Upload OR 50 Mins 4K Upload • Render in 1080p Full HD',
    features: [
      '160 Mins (1080p Upload) OR 50 Mins (4K Upload)',
      '1080p Full HD Download & Zero Watermark',
      '4K Source Upload (Exports rendered in Crisp 1080p Full HD)',
      'VIP High-Speed Render Queue'
    ],
    ctaText: 'Choose Pro ($19.99)'
  },
  {
    id: 'agency',
    name: 'Agency Pack',
    price: '$29.99',
    numericPrice: 29.99,
    period: 'one-time',
    badge: 'VIP 4K Upload',
    supports4K: true,
    clipsCredit: '501 Minutes',
    totalExport: 'Up to 501 Minutes Total Video Processing • Render in 1080p',
    features: [
      '501 Minutes Processing',
      '1080p Full HD Download & Zero Watermark',
      '4K Source Upload (Exports rendered in Crisp 1080p Full HD)',
      'VIP Priority Render Pipeline'
    ],
    ctaText: 'Choose Agency ($29.99)'
  }
];
