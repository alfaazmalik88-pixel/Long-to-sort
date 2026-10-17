import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Flame, 
  Crown, 
  Clock, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Share2, 
  Copy, 
  CheckCheck, 
  BookOpen, 
  Home, 
  ShieldCheck,
  Video
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogData';
import { CallToActionBanner } from '../components/CallToActionBanner';

interface BlogArticlePageProps {
  slug?: string;
}

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug: propSlug }) => {
  const navigate = useNavigate();
  const params = useParams<{ slug: string }>();
  const activeSlug = propSlug || params.slug || '';

  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Find article by slug or id
  const article: BlogArticle | undefined = BLOG_ARTICLES.find(
    (a) => a.slug === activeSlug || a.id === activeSlug
  );

  // Scroll to top on load or article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSlug]);

  // SEO: Update page title, meta description, and JSON-LD structured data
  useEffect(() => {
    if (!article) return;

    const pageTitle = `${article.title} | ViralClip AI Guide`;
    document.title = pageTitle;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', article.summary);

    // OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', pageTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', article.summary);

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'article');

    // JSON-LD Structured Data (Article + HowTo + FAQPage)
    const scriptId = 'article-jsonld-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "headline": article.title,
          "description": article.summary,
          "datePublished": "2026-10-01T08:00:00+00:00",
          "dateModified": "2026-10-16T12:00:00+00:00",
          "author": {
            "@type": "Organization",
            "name": "ViralClip AI Growth Research Team",
            "url": window.location.origin
          },
          "publisher": {
            "@type": "Organization",
            "name": "ViralClip AI",
            "logo": {
              "@type": "ImageObject",
              "url": `${window.location.origin}/logo.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
          }
        },
        {
          "@type": "HowTo",
          "name": article.title,
          "description": article.summary,
          "step": article.fullGuide.steps.map((st) => ({
            "@type": "HowToStep",
            "position": st.stepNumber,
            "name": st.title,
            "text": st.description
          }))
        },
        ...(article.fullGuide.faq.length > 0 ? [{
          "@type": "FAQPage",
          "mainEntity": article.fullGuide.faq.map((fq) => ({
            "@type": "Question",
            "name": fq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": fq.answer
            }
          }))
        }] : [])
      ]
    };

    script.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [article]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Tool Alternatives':
        return <Crown className="w-3.5 h-3.5 text-purple-400" />;
      case 'Viral Growth Guides':
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
      case 'AI Video Editing Tips':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'Shorts SEO Hacks':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Crown className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  // If article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black">Guide Not Found</h1>
        <p className="text-sm text-zinc-400 max-w-md">
          The guide or article you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Viral Guides</span>
        </Link>
      </div>
    );
  }

  // Related articles (exclude current)
  const relatedArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500 selection:text-white pb-24 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">All Guides</span>
            </Link>

            <span className="text-zinc-700 hidden sm:inline">/</span>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Studio</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Try ViralClip Free</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
          <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-zinc-300 transition-colors">Blog & Guides</Link>
          <span>/</span>
          <span className="text-zinc-400">{article.category}</span>
        </nav>

        {/* Hero Section */}
        <article className="space-y-6">
          <header className="space-y-4">
            {/* Badges Row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-3 py-1 rounded-xl border ${article.badgeColor}`}>
                {getCategoryIcon(article.category)}
                <span>{article.category}</span>
              </span>

              <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium bg-zinc-900/80 px-3 py-1 rounded-xl border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{article.readTime}</span>
              </span>

              <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified by ViralClip AI Lab • {article.date}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              {article.title}
            </h1>

            {/* Summary / Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-medium">
              {article.summary}
            </p>
          </header>

          {/* Interactive Visual Preview Mockup */}
          <div className={`relative rounded-3xl bg-gradient-to-br ${article.gradient} p-6 sm:p-8 border border-zinc-800/80 overflow-hidden shadow-2xl space-y-4`}>
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
                  <Play className="w-5 h-5 fill-indigo-400" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">
                    AI Visual Preset
                  </div>
                  <div className="text-base sm:text-lg font-black text-white tracking-wide">
                    {article.previewSnippet}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-bold text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>9:16 Shorts • 1080p HD Ready</span>
              </div>
            </div>
          </div>

          {/* Intro Paragraph */}
          <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
            <p className="text-zinc-300 leading-relaxed font-normal">
              {article.fullGuide.intro}
            </p>
          </div>

          {/* Key Takeaway Callout Box */}
          <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-3xl p-5 sm:p-6 flex items-start gap-4 shadow-xl shadow-indigo-950/30">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-widest">
                Key Takeaway for Creators
              </h3>
              <p className="text-sm sm:text-base text-zinc-100 font-semibold leading-relaxed">
                {article.fullGuide.keyTakeaway}
              </p>
            </div>
          </div>

          {/* Competitor Comparison Section (if present) */}
          {article.competitorComparison && (
            <section className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    Feature Breakdown
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span>{article.competitorComparison.competitorName} vs ViralClip AI</span>
                  </h2>
                </div>
                <div className="text-xs font-bold text-zinc-400">
                  Save 75%+ with Zero Subscription Trap
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/25 space-y-2">
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                    {article.competitorComparison.competitorName} Drawback
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300">
                    {article.competitorComparison.keyPainPoint}
                  </p>
                  <div className="text-xs font-extrabold text-red-400 pt-1">
                    Typical Cost: {article.competitorComparison.competitorPrice}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    ViralClip AI Advantage
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300">
                    {article.competitorComparison.viralClipSolution}
                  </p>
                  <div className="text-xs font-extrabold text-emerald-400 pt-1">
                    Entry Cost: {article.competitorComparison.viralClipPrice}
                  </div>
                </div>
              </div>

              {/* Feature comparison table */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden text-xs sm:text-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400">
                        <th className="py-3 px-4 font-bold">Feature</th>
                        <th className="py-3 px-4 font-bold text-zinc-400">{article.competitorComparison.competitorName}</th>
                        <th className="py-3 px-4 font-bold text-indigo-300 bg-indigo-950/30">ViralClip AI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 text-zinc-300">
                      {article.competitorComparison.featureComparison.map((f, i) => (
                        <tr key={i} className="hover:bg-zinc-850/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">{f.feature}</td>
                          <td className="py-3 px-4 text-zinc-400">{f.competitor}</td>
                          <td className="py-3 px-4 font-bold text-emerald-300 bg-indigo-950/20">{f.viralClip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Step-by-Step Implementation Guide */}
          <section className="space-y-6 pt-4">
            <div className="space-y-1 border-b border-zinc-900 pb-3">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                Action Plan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Step-by-Step Execution Guide
              </h2>
            </div>

            <div className="space-y-4">
              {article.fullGuide.steps.map((st) => (
                <div 
                  key={st.stepNumber}
                  className="bg-zinc-950/80 border border-zinc-800/90 hover:border-indigo-500/40 rounded-3xl p-5 sm:p-7 space-y-3 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                      {st.stepNumber}
                    </span>
                    <h3 className="font-extrabold text-white text-base sm:text-lg">
                      {st.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 pl-11 leading-relaxed">
                    {st.description}
                  </p>

                  {st.tip && (
                    <div className="ml-11 mt-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-xl px-3.5 py-2 inline-flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>Pro Tip:</strong> {st.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Creator Best Practices Checklist */}
          <section className="bg-gradient-to-b from-zinc-950 to-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Proven Creator Best Practices</span>
            </h3>
            <ul className="space-y-2.5">
              {article.fullGuide.proTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick FAQ on this Article */}
          {article.fullGuide.faq.length > 0 && (
            <section className="space-y-4 pt-4">
              <div className="space-y-1 border-b border-zinc-900 pb-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Quick Answers
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Frequently Asked About This Guide
                </h3>
              </div>

              <div className="space-y-3">
                {article.fullGuide.faq.map((fq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div 
                      key={fIdx}
                      className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/40 transition-colors"
                      >
                        <span className="font-bold text-sm sm:text-base text-zinc-100 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>{fq.question}</span>
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 border-t border-zinc-900 pt-3 leading-relaxed">
                          {fq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Share & Copy Link Action Footer */}
          <div className="pt-6 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-400">
              Found this guide helpful? Share it with other video creators.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1d9bf0]/10 hover:bg-[#1d9bf0]/20 border border-[#1d9bf0]/30 text-[#1d9bf0] transition-all cursor-pointer active:scale-95"
              >
                <span>Share on X</span>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 transition-all cursor-pointer active:scale-95"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </article>

        {/* High-Converting CTA Banner */}
        <section className="pt-6">
          <CallToActionBanner />
        </section>

        {/* Read More / Related Guides Section */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Continue Reading Guides
                </h3>
                <p className="text-xs text-zinc-400">
                  Explore more strategies for viral retention and subtitle editing.
                </p>
              </div>
              <Link
                to="/blog"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>All Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="bg-zinc-950/80 border border-zinc-800/80 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all hover:-translate-y-0.5 group"
                >
                  <div className="space-y-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${rel.badgeColor}`}>
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {rel.summary}
                    </p>
                  </div>

                  <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1 pt-2 border-t border-zinc-900">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
