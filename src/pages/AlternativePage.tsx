import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Flame, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  DollarSign, 
  Star, 
  Shield, 
  Layers,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogData';
import { CallToActionBanner } from '../components/CallToActionBanner';

export type AlternativeToolKey = 'opus' | 'submagic' | 'klap' | 'vizard';

interface AlternativePageProps {
  tool: AlternativeToolKey;
}

interface AlternativeConfig {
  slug: string;
  competitorName: string;
  heroBadge: string;
  seoTitle: string;
  metaDescription: string;
  headlinePrefix: string;
  highlightedHeadline: string;
  headlineSuffix: string;
  subheadline: string;
  painPointTitle: string;
  painPointDescription: string;
  solutionTitle: string;
  solutionDescription: string;
  competitorPriceTag: string;
  viralClipPriceTag: string;
  ratingScore: string;
  reviewsCount: string;
  features: {
    name: string;
    competitor: string;
    competitorCheck: boolean;
    viralClip: string;
    viralClipCheck: boolean;
  }[];
  keyBenefits: {
    title: string;
    desc: string;
    icon: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

const ALTERNATIVE_CONFIGS: Record<AlternativeToolKey, AlternativeConfig> = {
  opus: {
    slug: 'opus-clip-alternative',
    competitorName: 'Opus Clip',
    heroBadge: '#1 Rated Opus Clip Alternative 2026',
    seoTitle: 'Best Opus Clip Alternative (2026) – No Auto-Debit, Pay-As-You-Go ($5 / ₹49)',
    metaDescription: 'Looking for the best Opus Clip alternative? Avoid $15–$29/mo recurring subscriptions and expiring credits. ViralClip AI offers pay-as-you-go from ₹49 ($5), lifetime credits, 1080p Full HD export & zero watermark.',
    headlinePrefix: 'The Best',
    highlightedHeadline: 'Opus Clip Alternative',
    headlineSuffix: 'Without Monthly Subscription Traps',
    subheadline: 'Never lose unused video minutes again. Switch from Opus Clip’s $15–$29/mo auto-renewing subscription to ViralClip AI’s 100% pay-as-you-go top-ups starting at just ₹49 ($4.99).',
    painPointTitle: 'The Opus Clip Problem: Expiring Credits & High Subscriptions',
    painPointDescription: 'Opus Clip forces users into $15 to $29 monthly recurring subscriptions. If you only edit 2 or 3 videos in a month, your unused processing credits expire on your next billing date. You end up paying for minutes you never had the chance to use.',
    solutionTitle: 'The ViralClip AI Solution: 100% Lifetime Pay-As-You-Go',
    solutionDescription: 'Top up only when you have content to edit. Minutes never expire, bank cards are never auto-debited without consent, and you get full 1080p export with zero watermarks from minute one.',
    competitorPriceTag: '$15 – $29 / month (Auto-Debit)',
    viralClipPriceTag: '₹49 / $4.99 (Lifetime Top-Up)',
    ratingScore: '4.9/5',
    reviewsCount: '12,400+ Creators',
    features: [
      { name: 'Billing Model', competitor: 'Recurring monthly auto-debit', competitorCheck: false, viralClip: '100% Pay-As-You-Go (0 auto-debit)', viralClipCheck: true },
      { name: 'Credit Validity', competitor: 'Expires every 30 days', competitorCheck: false, viralClip: 'Never expires (Lifetime rollover)', viralClipCheck: true },
      { name: 'Entry Price', competitor: '$15.00/mo minimum (~₹1,250)', competitorCheck: false, viralClip: '₹49 / $4.99 micro-packs', viralClipCheck: true },
      { name: 'Watermark Policy', competitor: 'Watermark on free tier', competitorCheck: false, viralClip: '100% clean video (0 watermark)', viralClipCheck: true },
      { name: 'Export Resolution', competitor: '1080p locked behind premium tiers', competitorCheck: false, viralClip: '1080p Full HD included on all plans', viralClipCheck: true },
      { name: 'Hormozi Kinetic Captions', competitor: 'Basic styling presets', competitorCheck: false, viralClip: 'Word-by-word dynamic glowing highlights', viralClipCheck: true },
      { name: 'Multi-Part Series Tags', competitor: 'Manual addition needed', competitorCheck: false, viralClip: 'Automatic Part 1, Part 2 tags', viralClipCheck: true },
      { name: 'Payment Options', competitor: 'International cards only', competitorCheck: false, viralClip: 'UPI, RuPay, Indian & Global Stripe cards', viralClipCheck: true }
    ],
    keyBenefits: [
      { title: 'Save 75%+ Annually', desc: 'Stop spending $180 to $350 every year on recurring Opus Clip subscriptions when you only edit a few videos a month.', icon: 'DollarSign' },
      { title: 'Credits Roll Over Forever', desc: 'Buy 60 or 180 minutes today and use them 6 months from now. Zero expiration dates.', icon: 'Clock' },
      { title: 'No Surprise Card Charges', desc: 'We never auto-debit your bank card. When you want more minutes, you click to pay on your own terms.', icon: 'Shield' }
    ],
    faqs: [
      { q: 'Why is ViralClip AI the top Opus Clip alternative in 2026?', a: 'ViralClip AI provides the same viral AI highlight detection and dynamic subtitles as Opus Clip, but eliminates monthly subscription traps. Plans start at ₹49 / $4.99 with no auto-debit, lifetime credit validity, and 100% watermark-free exports.' },
      { q: 'Do unused minutes expire like they do on Opus Clip?', a: 'No! All minutes purchased on ViralClip AI have lifetime validity and will stay in your account forever until you use them.' },
      { q: 'Can I test ViralClip AI for free before buying?', a: 'Yes! Every creator gets 5 free processing minutes upon signup with zero credit card required. You can upload, edit, and export a clean 1080p video.' },
      { q: 'How does ViralClip AI compare in video quality?', a: 'ViralClip AI exports in crisp 1080p Full HD with high-contrast drop-shadow subtitles and zero watermark, matching or exceeding Opus Clip’s Pro tier.' }
    ]
  },
  submagic: {
    slug: 'submagic-alternative',
    competitorName: 'Submagic',
    heroBadge: '#1 Submagic Alternative for Short-Form Creators',
    seoTitle: 'Best Submagic Alternative – Free Hormozi Captions & 1080p Export (Zero Watermark)',
    metaDescription: 'Why pay Submagic $20/month just for captions? ViralClip AI combines 1-click AI video clipping with authentic Alex Hormozi animated kinetic subtitles & 1080p clean export from ₹49 ($5).',
    headlinePrefix: 'The All-in-One',
    highlightedHeadline: 'Submagic Alternative',
    headlineSuffix: 'With Free Hormozi Captions & 1080p Export',
    subheadline: 'Why pay Submagic $20/month solely to add animated subtitles? ViralClip AI finds the viral moments in your long videos AND generates kinetic Hormozi captions with zero watermark.',
    painPointTitle: 'The Submagic Problem: $20/mo Just for Caption Overlays',
    painPointDescription: 'Submagic is essentially a captioning tool that requires you to manually edit and cut your video beforehand in Premiere or CapCut. Paying $20/month recurring just to burn text on pre-trimmed clips is overpriced for creators on a budget.',
    solutionTitle: 'The ViralClip AI Solution: Full AI Clipping + Dynamic Subtitles',
    solutionDescription: 'ViralClip AI takes your raw 30-minute podcast or video, identifies the top 10 viral hooks automatically, reframes them to 9:16 vertical, and adds glowing word-level animated subtitles in 1 click.',
    competitorPriceTag: '$20 / month (~₹1,700/mo)',
    viralClipPriceTag: '₹49 / $4.99 (Pay-As-You-Go)',
    ratingScore: '4.9/5',
    reviewsCount: '9,800+ Reels Editors',
    features: [
      { name: 'Core Functionality', competitor: 'Manual caption overlay tool', competitorCheck: false, viralClip: 'AI Video Repurposing + Animated Captions', viralClipCheck: true },
      { name: 'Monthly Pricing', competitor: '$20.00/mo subscription minimum', competitorCheck: false, viralClip: '₹49 / $4.99 one-time micro-packs', viralClipCheck: true },
      { name: 'Long Video Clipping', competitor: 'Manual pre-cutting required', competitorCheck: false, viralClip: 'Automated 1-click long-to-short clipping', viralClipCheck: true },
      { name: 'Free Trial Watermark', competitor: 'Prominent watermark on test exports', competitorCheck: false, viralClip: 'Zero watermark on all exports', viralClipCheck: true },
      { name: 'Word-Level Synchronization', competitor: 'Yes (locked behind subscription)', competitorCheck: true, viralClip: 'Yes (included on free trial & all plans)', viralClipCheck: true },
      { name: 'Part 1 / Part 2 Tags', competitor: 'None', competitorCheck: false, viralClip: 'Built-in episodic series tags', viralClipCheck: true },
      { name: 'Export Resolution', competitor: '720p on entry tier', competitorCheck: false, viralClip: '1080p Full HD included', viralClipCheck: true },
      { name: 'Billing Commitment', competitor: 'Recurring monthly contract', competitorCheck: false, viralClip: 'Pay only when you export (No auto-debit)', viralClipCheck: true }
    ],
    keyBenefits: [
      { title: '2 Tools in 1 Platform', desc: 'Skip paying for both a video clipper and a separate subtitle tool. ViralClip AI does both seamlessly in 30 seconds.', icon: 'Layers' },
      { title: 'Authentic Hormozi Visuals', desc: 'High-contrast uppercase typography with yellow (#FACC15) word highlighting and black contrast drop shadows.', icon: 'Flame' },
      { title: 'No Subscription Locks', desc: 'Never worry about an unexpected $20 charge hitting your credit card each month. Top up only when you publish.', icon: 'Shield' }
    ],
    faqs: [
      { q: 'Is ViralClip AI better than Submagic for TikTok & Reels?', a: 'Yes! Submagic only adds subtitles to clips you have already trimmed. ViralClip AI cuts long videos into viral moments, reframes them to 9:16 vertical, adds Hormozi kinetic captions, and exports in 1080p with zero watermark at a fraction of Submagic’s price.' },
      { q: 'Can I export videos without watermarks for free?', a: 'Yes! Your 5 free welcome minutes include 100% clean video exports with zero watermark logos.' },
      { q: 'Does ViralClip AI support word-level timestamp editing?', a: 'Yes, you can edit words, adjust highlighting colors, and tweak timings directly in our interactive studio editor.' }
    ]
  },
  klap: {
    slug: 'klap-alternative',
    competitorName: 'Klap.app',
    heroBadge: '#1 Cheapest Klap.app Alternative 2026',
    seoTitle: 'Cheapest Klap.app Alternative for YouTube Shorts & Reels (Zero Watermark)',
    metaDescription: 'Frustrated by Klap.app’s $29/mo starter fee and heavy free watermarks? ViralClip AI offers 10+ AI shorts, 9:16 reframing, and clean 1080p downloads starting from ₹49 ($5).',
    headlinePrefix: 'The Most Affordable',
    highlightedHeadline: 'Klap.app Alternative',
    headlineSuffix: 'For YouTube Shorts & Reels Creators',
    subheadline: 'Stop dealing with Klap’s giant watermark logos and strict video length gates. Get 10+ viral shorts with auto-reframing and dynamic subtitles from ₹49 ($4.99).',
    painPointTitle: 'The Klap Problem: Expensive $29/mo Barrier & Giant Watermarks',
    painPointDescription: 'Klap.app charges $29 every single month. On their free tier, they paste an intrusive watermark logo right over your video that ruins view retention and algorithm distribution. Furthermore, long upload lengths are strictly gated.',
    solutionTitle: 'The ViralClip AI Solution: Clean Watermark-Free Videos from ₹49',
    solutionDescription: 'ViralClip AI allows uploads up to 5GB, automatically extracts viral clips, reframes wide 16:9 scenes to centered 9:16 portrait mode, and renders 100% watermark-free Full HD shorts.',
    competitorPriceTag: '$29 / month (~₹2,450/mo)',
    viralClipPriceTag: '₹49 / $4.99 (Pay-As-You-Go)',
    ratingScore: '4.8/5',
    reviewsCount: '8,500+ Video Creators',
    features: [
      { name: 'Monthly Price', competitor: '$29.00/mo recurring subscription', competitorCheck: false, viralClip: '₹49 / $4.99 pay-as-you-go', viralClipCheck: true },
      { name: 'Free Tier Watermark', competitor: 'Intrusive Klap watermark logo', competitorCheck: false, viralClip: '100% clean video (0 watermark)', viralClipCheck: true },
      { name: 'Upload Limit', competitor: 'Strict duration gates', competitorCheck: false, viralClip: 'Up to 5GB video files supported', viralClipCheck: true },
      { name: 'Vertical Reframing', competitor: 'Basic dynamic crop', competitorCheck: true, viralClip: 'Smart centered speaker reframing', viralClipCheck: true },
      { name: 'Series Tags', competitor: 'Manual editing required', competitorCheck: false, viralClip: 'Built-in Part 1, Part 2 tags', viralClipCheck: true },
      { name: 'Credit Rollover', competitor: 'Credits expire monthly', competitorCheck: false, viralClip: 'Lifetime credit validity', viralClipCheck: true },
      { name: 'Payment Diversity', competitor: 'International cards only', competitorCheck: false, viralClip: 'UPI, RuPay, Stripe & Global cards', viralClipCheck: true }
    ],
    keyBenefits: [
      { title: 'Save Over 90% Every Month', desc: 'Pay ₹49 / $4.99 instead of $29/mo (~₹2,450). Keep more profit from your content creator business.', icon: 'DollarSign' },
      { title: 'Zero Watermarks, Always', desc: 'Never publish a video with an embarrassing software watermark on it. Every clip is 100% clean.', icon: 'ShieldCheck' },
      { title: 'Instant Episodic Series', desc: 'Automatically tag your videos as Part 1, Part 2, Part 3 to drive massive binge-watching across your channel.', icon: 'Zap' }
    ],
    faqs: [
      { q: 'Is ViralClip AI really cheaper than Klap.app?', a: 'Yes, Klap costs $29/month (~₹2,450). ViralClip AI lets you buy micro-packs starting at just ₹49 ($4.99), saving you over 90% if you produce content on demand.' },
      { q: 'Does ViralClip AI put a watermark on trial clips like Klap does?', a: 'Never. ViralClip AI maintains a strict zero-watermark policy across both free trials and paid micro-packs.' },
      { q: 'Can I upload videos up to 1 hour long?', a: 'Yes! ViralClip AI supports long video files up to 5GB, analyzing the entire recording to extract the highest-energy clips.' }
    ]
  },
  vizard: {
    slug: 'vizard-alternative',
    competitorName: 'Vizard AI',
    heroBadge: '#1 Fastest Vizard AI Alternative 2026',
    seoTitle: 'Faster, Simpler Vizard Alternative – 1-Click Viral Moments Detection',
    metaDescription: 'Frustrated by Vizard AI’s complex timeline editor and slow rendering queues? ViralClip AI auto-detects high-retention podcast highlights in 1 click with instant trimming from ₹49 ($5).',
    headlinePrefix: 'The Faster & Simpler',
    highlightedHeadline: 'Vizard AI Alternative',
    headlineSuffix: 'With 1-Click Viral Detection & Instant Render',
    subheadline: 'Eliminate timeline clutter, confusing credit math, and slow rendering queues. ViralClip AI extracts 10+ ready-to-post vertical shorts in under 30 seconds.',
    painPointTitle: 'The Vizard Problem: Cluttered Timelines & Slow Cloud Queues',
    painPointDescription: 'Vizard AI attempts to be a full desktop video editor in the cloud, resulting in an overly complicated interface with multi-track timelines. During peak creator hours, rendering a single clip can take 5 to 10 minutes in crowded server queues.',
    solutionTitle: 'The ViralClip AI Solution: Streamlined 1-Click Viral Repurposing',
    solutionDescription: 'Drop your link or upload your video. ViralClip AI automatically calculates viral retention scores, clips high-energy moments, formats subtitles, and exports in seconds with zero waiting around.',
    competitorPriceTag: '$16 – $32 / month',
    viralClipPriceTag: '₹49 / $4.99 (Pay-As-You-Go)',
    ratingScore: '4.9/5',
    reviewsCount: '7,200+ Creators',
    features: [
      { name: 'Interface Complexity', competitor: 'Cluttered multi-track timeline', competitorCheck: false, viralClip: 'Clean 1-click creator dashboard', viralClipCheck: true },
      { name: 'Render Speed', competitor: 'Slow cloud queues (5-10 min wait)', competitorCheck: false, viralClip: 'Fast hardware-accelerated rendering', viralClipCheck: true },
      { name: 'Pricing Model', competitor: '$16–$32/mo recurring subscription', competitorCheck: false, viralClip: '₹49 / $4.99 micro-topups', viralClipCheck: true },
      { name: 'Learning Curve', competitor: 'High (complex timeline tools)', competitorCheck: false, viralClip: 'Zero learning curve (Instant 1-click)', viralClipCheck: true },
      { name: 'Mobile Experience', competitor: 'Difficult to use on mobile devices', competitorCheck: false, viralClip: '100% mobile-friendly responsive web app', viralClipCheck: true },
      { name: 'Watermark Policy', competitor: 'Watermarked free trial', competitorCheck: false, viralClip: 'Zero watermark on all exports', viralClipCheck: true },
      { name: 'Auto-Debit Guarantee', competitor: 'Auto-renews every month', competitorCheck: false, viralClip: '100% No Auto-Debit guarantee', viralClipCheck: true }
    ],
    keyBenefits: [
      { title: 'Zero Render Queue Wait', desc: 'No more waiting in long cloud server queues. Render and download your Full HD clips in seconds.', icon: 'Zap' },
      { title: 'Built for Speed & Simplicity', desc: 'Designed specifically for creators who want fast results without wrestling with complex timelines.', icon: 'Sparkles' },
      { title: 'Full Mobile Independence', desc: 'Upload, edit, and export viral shorts straight from your mobile browser without installing bloated apps.', icon: 'Video' }
    ],
    faqs: [
      { q: 'Why do creators switch from Vizard AI to ViralClip AI?', a: 'Creators switch because ViralClip AI is faster, has zero timeline bloat, renders without long server queues, and offers affordable ₹49 / $4.99 pay-as-you-go pricing without monthly subscription traps.' },
      { q: 'Is ViralClip AI easy to use for beginners?', a: 'Yes! Unlike Vizard’s multi-track editor, ViralClip AI requires zero video editing knowledge. Just paste a video, and the AI handles clipping, reframing, and subtitles automatically.' },
      { q: 'Can I download the video directly to my phone?', a: 'Yes! ViralClip AI runs directly in your mobile browser with direct MP4 downloads.' }
    ]
  }
};

export const AlternativePage: React.FC<AlternativePageProps> = ({ tool }) => {
  const navigate = useNavigate();
  const config = ALTERNATIVE_CONFIGS[tool];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // SEO: Update page title, meta description, and JSON-LD structured data
  useEffect(() => {
    document.title = config.seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', config.metaDescription);

    // OpenGraph & Twitter tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', config.seoTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', config.metaDescription);

    // Structured Data (JSON-LD)
    const schemaId = `schema-${config.slug}`;
    let schemaScript = document.getElementById(schemaId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "ViralClip AI",
          "operatingSystem": "Web, iOS, Android",
          "applicationCategory": "MultimediaApplication",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "12400"
          },
          "offers": {
            "@type": "Offer",
            "price": "49",
            "priceCurrency": "INR"
          },
          "description": config.metaDescription
        },
        {
          "@type": "FAQPage",
          "mainEntity": config.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }
      ]
    };

    schemaScript.textContent = JSON.stringify(structuredData);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      // Clean up script on unmount
      const el = document.getElementById(schemaId);
      if (el) el.remove();
    };
  }, [tool, config]);

  const otherTools: { key: AlternativeToolKey; name: string; path: string }[] = [
    { key: 'opus', name: 'Opus Clip Alternative', path: '/opus-clip-alternative' },
    { key: 'submagic', name: 'Submagic Alternative', path: '/submagic-alternative' },
    { key: 'klap', name: 'Klap Alternative', path: '/klap-alternative' },
    { key: 'vizard', name: 'Vizard AI Alternative', path: '/vizard-alternative' }
  ].filter(t => t.key !== tool);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500 selection:text-white pb-24 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Generator</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              All Guides
            </Link>
            <button
              onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Get 5 Free Minutes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-zinc-300 transition-colors">Blog & Guides</Link>
          <span>/</span>
          <span className="text-zinc-300 font-bold">{config.competitorName} Alternative</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold tracking-wide shadow-sm animate-in fade-in">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{config.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {config.headlinePrefix}{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              {config.highlightedHeadline}
            </span>{' '}
            {config.headlineSuffix}
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            {config.subheadline}
          </p>

          {/* Social Proof & Trust Badges */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-white">{config.ratingScore}</span>
              <span className="text-zinc-500">({config.reviewsCount})</span>
            </div>
            <div className="h-3 w-px bg-zinc-800" />
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Watermark Guaranteed</span>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 text-white font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start Free (5 Minutes Included)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/pricing"
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View Plans (From ₹49 / $4.99)</span>
            </Link>
          </div>
        </section>

        {/* The Pain Point vs Solution Contrast Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pain Point Card */}
          <div className="bg-red-950/20 border border-red-500/25 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <X className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-red-400">
                The {config.competitorName} Drawback
              </div>
              <h3 className="text-xl font-bold text-white">
                {config.painPointTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {config.painPointDescription}
              </p>
            </div>
            <div className="pt-2 border-t border-red-500/20 flex items-center justify-between text-xs font-bold text-zinc-400">
              <span>Typical Cost:</span>
              <span className="text-red-400 text-sm font-black">{config.competitorPriceTag}</span>
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Check className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                The ViralClip AI Advantage
              </div>
              <h3 className="text-xl font-bold text-white">
                {config.solutionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {config.solutionDescription}
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-xs font-bold text-zinc-400">
              <span>ViralClip AI Cost:</span>
              <span className="text-emerald-400 text-sm font-black">{config.viralClipPriceTag}</span>
            </div>
          </div>
        </section>

        {/* Comprehensive Side-by-Side Comparison Table */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Direct Feature Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ViralClip AI vs {config.competitorName}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              See why thousands of creators and editors made the switch.
            </p>
          </div>

          <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                    <th className="py-4 px-4 sm:px-6 font-bold">Feature / Metric</th>
                    <th className="py-4 px-4 sm:px-6 font-bold text-zinc-400">{config.competitorName}</th>
                    <th className="py-4 px-4 sm:px-6 font-extrabold text-indigo-400 bg-indigo-950/30 border-l border-r border-indigo-500/20">
                      ViralClip AI (Winner)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {config.features.map((feat, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-white">
                        {feat.name}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-zinc-400">
                        <div className="flex items-center gap-2">
                          {feat.competitorCheck ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                          <span>{feat.competitor}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-300 bg-indigo-950/20 border-l border-r border-indigo-500/20">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{feat.viralClip}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3 Core Benefits Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why Creators Switch from {config.competitorName}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Built by creators, for creators. No corporate bloat, no subscription locks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.keyBenefits.map((b, idx) => (
              <div 
                key={idx}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-3 hover:border-indigo-500/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-base font-bold text-white">
                  {b.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Step Migration: How to Switch in 60 Seconds */}
        <section className="bg-zinc-950/70 border border-zinc-850 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Instant Migration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How to Switch to ViralClip AI in 60 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Zero complicated setup. Get your first viral clip downloaded before your coffee cools down.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <span className="text-indigo-400 font-black text-xs">STEP 1</span>
              <h4 className="text-sm font-bold text-white">Cancel Auto-Debit</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Log into {config.competitorName} and cancel recurring monthly renewals to prevent surprise charges.
              </p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <span className="text-indigo-400 font-black text-xs">STEP 2</span>
              <h4 className="text-sm font-bold text-white">Claim 5 Free Mins</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sign in to ViralClip AI with 1 click. Your account immediately receives 5 free processing minutes.
              </p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <span className="text-indigo-400 font-black text-xs">STEP 3</span>
              <h4 className="text-sm font-bold text-white">Upload Your Video</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste your YouTube link or drop raw video up to 5GB. AI detects the top viral moments in seconds.
              </p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <span className="text-indigo-400 font-black text-xs">STEP 4</span>
              <h4 className="text-sm font-bold text-white">Export 1080p Clean</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add glowing Hormozi subtitles, Part tags, and export in 1080p Full HD with 100% zero watermark.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (Accordion) */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Clear answers before you make the switch.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {config.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-950/80 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/40 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-zinc-100">
                      {faq.q}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-900 pt-3 bg-zinc-900/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Explore Other Tool Alternatives (SEO Internal Linking) */}
        <section className="space-y-4 pt-6 border-t border-zinc-900">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white">Compare More AI Video Tools</h3>
            <p className="text-xs text-zinc-400">Looking for other comparisons? Check out our dedicated alternatives guides:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {otherTools.map((t) => (
              <Link
                key={t.key}
                to={t.path}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900 flex items-center justify-between transition-all group"
              >
                <span className="text-xs font-bold text-zinc-300 group-hover:text-white">
                  {t.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom High-Converting Call to Action */}
        <CallToActionBanner
          title={`Switch from ${config.competitorName} to ViralClip AI Today`}
          subtitle={`Claim 5 free processing minutes instantly on signup. Zero auto-debit, zero watermark, and lifetime top-up packs from ₹49 ($4.99).`}
          primaryButtonText="Start Creating Free (5 Mins Included)"
          secondaryButtonText="View Flexible Pricing Plans"
        />

      </main>
    </div>
  );
};
