import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Flame, 
  Crown, 
  Clock, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  ShieldCheck, 
  Play, 
  Video 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BLOG_ARTICLES, 
  BLOG_CATEGORIES, 
  BlogArticle, 
  BlogCategory, 
  CREATOR_FAQS 
} from '../data/blogData';

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All Guides');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter articles based on category and search
  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    const matchesCategory = 
      selectedCategory === 'All Guides' || article.category === selectedCategory;
    const matchesSearch = 
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
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

  const handleCtaClick = () => {
    if (activeArticle) {
      setActiveArticle(null);
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <button
              onClick={handleCtaClick}
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Get 5 Free Minutes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-10 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold tracking-wide shadow-sm animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Creator Growth Studio • Official Video Guides</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          How to Go Viral with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">AI Animated Captions</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Master the exact hooks, word-level subtitle techniques, and SEO strategies top YouTubers use to generate millions of views and scale from ₹0 to viral.
        </p>

        {/* Quick Search & Category Filters */}
        <div className="pt-6 space-y-4 max-w-3xl mx-auto">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. Hormozi captions, viral hooks)..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {BLOG_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40 scale-105'
                      : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat !== 'All Guides' && getCategoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Article Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {filteredArticles.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm font-semibold">No guides found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All Guides'); }}
              className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-zinc-950/90 border border-zinc-800/90 hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 group"
              >
                {/* Visual Thumbnail Card Mockup */}
                <div className={`relative h-44 bg-gradient-to-br ${article.gradient} p-4 border-b border-zinc-800/80 flex flex-col justify-between overflow-hidden`}>
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                  {/* Top Badge Row */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${article.badgeColor}`}>
                      {article.category}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-medium bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/5">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Mockup Preview Visual: 9:16 Video Canvas with Glowing Captions */}
                  <div className="relative z-10 my-auto bg-black/75 backdrop-blur-md border border-zinc-700/60 rounded-xl p-3 shadow-lg flex items-center gap-3 group-hover:scale-[1.02] transition-transform">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                      <Play className="w-4 h-4 fill-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-mono text-zinc-400 tracking-wider">PREVIEW EFFECT</div>
                      <div className="text-xs font-black text-white tracking-wide truncate">
                        {article.previewSnippet}
                      </div>
                    </div>
                  </div>

                  {/* Waveform accent line */}
                  <div className="relative z-10 flex items-center gap-1 opacity-70">
                    <span className="w-1.5 h-3 bg-indigo-400 rounded-full animate-pulse" />
                    <span className="w-1.5 h-5 bg-purple-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1.5 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                    <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse delay-100" />
                    <span className="text-[9px] text-zinc-400 font-bold ml-1">KINETIC ENGINE</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Read Guide Action Button */}
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-medium">{article.date}</span>
                    <button
                      onClick={() => setActiveArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all cursor-pointer"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Creator Questions & Answers (FAQ Accordion Style) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Shorts Creator Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Frequently Asked Creator Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about animated subtitles, video retention, and viral distribution.
          </p>
        </div>

        {/* Clean Accordion List */}
        <div className="space-y-3 pt-2">
          {CREATOR_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl overflow-hidden transition-all duration-200"
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

      {/* High-Impact Bottom Call to Action (CTA) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950/60 via-zinc-950 to-zinc-950 border border-indigo-500/40 p-6 sm:p-10 text-center space-y-6 shadow-2xl shadow-indigo-600/20">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Video className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Turn Your Videos into Viral Shorts?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Get started in seconds. No credit card required. Experience 1080p Full HD video clipping with animated Alex Hormozi captions and zero watermark.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleCtaClick}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 text-white font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Try ViralClip AI Now – Get 5 Free Minutes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero Watermark Guaranteed
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-indigo-400" />
              Free 5 Minutes Trial
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Plans Start at Just ₹49
            </span>
          </div>
        </div>
      </section>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden my-auto">
            {/* Modal Sticky Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-900 bg-zinc-950/95 backdrop-blur z-20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border ${activeArticle.badgeColor}`}>
                  {activeArticle.category}
                </span>
                <span className="text-[11px] text-zinc-400 truncate">
                  {activeArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Close Guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-zinc-300 custom-scrollbar">
              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                  {activeArticle.title}
                </h1>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {activeArticle.fullGuide.intro}
                </p>
              </div>

              {/* Key Takeaway Callout Box */}
              <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Key Takeaway</h4>
                  <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                    {activeArticle.fullGuide.keyTakeaway}
                  </p>
                </div>
              </div>

              {/* Step by step action guide */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <span>Step-by-Step Implementation Guide</span>
                </h3>

                <div className="space-y-3">
                  {activeArticle.fullGuide.steps.map((st) => (
                    <div 
                      key={st.stepNumber}
                      className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {st.stepNumber}
                        </span>
                        <h4 className="font-bold text-white text-sm sm:text-base">
                          {st.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-400 pl-8 leading-relaxed">
                        {st.description}
                      </p>
                      {st.tip && (
                        <div className="ml-8 mt-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5">
                          <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Pro Tip: {st.tip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-white">Creator Best Practices:</h4>
                <ul className="space-y-2">
                  {activeArticle.fullGuide.proTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* In-Guide Questions */}
              {activeArticle.fullGuide.faq.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-zinc-900">
                  <h4 className="text-sm font-bold text-white">Quick Q&A on This Topic:</h4>
                  {activeArticle.fullGuide.faq.map((fq, fIdx) => (
                    <div key={fIdx} className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-3.5 space-y-1">
                      <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{fq.question}</span>
                      </div>
                      <p className="text-xs text-zinc-400 pl-5 leading-relaxed">
                        {fq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* In-Modal Bottom CTA Button */}
              <div className="pt-6 border-t border-zinc-800 text-center space-y-3">
                <p className="text-xs text-zinc-400">
                  Ready to apply this guide to your long videos right now?
                </p>
                <button
                  onClick={handleCtaClick}
                  className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Try ViralClip AI Now – Get 5 Free Minutes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
