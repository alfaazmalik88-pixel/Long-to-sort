import { Link } from 'react-router-dom';
import React from 'react';
import { ArrowRight, ShieldCheck, FileText, Mail, RotateCcw, Zap } from 'lucide-react';

const SocialGif = () => (
  <div className="w-full aspect-video bg-[#0a0a0a] rounded-3xl overflow-hidden border border-zinc-800 mb-8 relative flex items-center justify-center">
    {/* Clean Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5"></div>
    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3 }}></div>

    <div className="flex items-center justify-center gap-8 md:gap-16 z-10">
      {/* YouTube */}
      <div className="drop-shadow-2xl">
        <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
          <path fill="#FFFFFF" d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"/>
        </svg>
      </div>

      {/* Instagram */}
      <div className="drop-shadow-2xl">
        <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 24 24" fill="none" stroke="url(#instaGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="instaGrad" x1="2" y1="2" x2="22" y2="22">
              <stop offset="0%" stopColor="#f58529" />
              <stop offset="50%" stopColor="#dd2a7b" />
              <stop offset="100%" stopColor="#8134af" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </div>

      {/* TikTok */}
      <div className="drop-shadow-2xl">
        <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 24 24" fill="#FFFFFF" style={{ filter: 'drop-shadow(2px 2px 0px #ff0050) drop-shadow(-2px -2px 0px #00f2fe)' }}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      </div>
    </div>
  </div>
);

export const SeoSection = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-24 text-zinc-300">
        
        {/* Section 1 */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Turn Long YouTube Videos into Shorts</h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Turn one long YouTube video into multiple Shorts, giving your best content more chances to reach new viewers and subscribers. Repurpose hours of footage without manually cutting every clip.
          </p>
          <button className="flex items-center gap-2 text-emerald-400 border border-emerald-900/50 bg-emerald-900/10 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-900/30 transition-colors">
            Grow My Channel <ArrowRight className="w-4 h-4" />
          </button>
          <div className="w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 mt-8 relative">
            <img src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1000" alt="Earth from space" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Social Media Scheduler for Smarter Video Publishing</h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Turn long videos into ready-to-publish shorts with AI-generated titles, descriptions, and thumbnails. Connect your social accounts to schedule TikTok, Instagram, and YouTube Shorts, keeping your content calendar filled for weeks.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-6">
          <SocialGif />
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Turn Long Videos into 10+ Shorts in 30 Seconds</h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Skip hours of manual editing and expensive monthly subscriptions. ViralClip AI is free to try with affordable micro-plans starting at just ₹49. Our AI video editor finds the best moments from podcasts and videos, adds Part 1, Part 2 Series Tags & Title Badges, and exports vertical clips for TikTok, Instagram Reels, and YouTube Shorts without watermarks.
          </p>
          <button className="flex items-center gap-2 text-emerald-400 border border-emerald-900/50 bg-emerald-900/10 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-900/30 transition-colors">
            Try the Best Opus Clip Alternative <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Section 4 */}
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">How to Use Our Long to Short Video Converter in 3 Steps</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">1. Upload your video file</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Upload your video directly from your phone, PC, or tablet, or try the instant demo video in one click.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">2. Let AI find the viral moments</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Our AI analyzes your video, identifies the most engaging parts, and automatically crops them into perfect vertical shorts with Part 1, Part 2 Series Tags.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">3. Export and share</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Review your clips, tweak the series tags if needed, and export them directly to your device ready to go viral.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">Convert Long Videos to Viral Shorts with ViralClip AI</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            ViralClip AI is an online AI tool designed to repurpose long form videos into viral shorts, reels, and TikToks in seconds. Free to try with affordable micro-plans starting at just ₹49. Easily convert podcasts, interviews, and long videos into engaging vertical shorts without watermarks. Simply upload your video and let our AI generate viral clips with Part 1, Part 2 series tags automatically.
          </p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">How to Use Our ViralClip Video Generator</h3>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
            <li><strong>Upload or Paste:</strong> Start your <em>long video to shorts ai</em> journey by uploading your video file directly into our <em>viral clip ai studio</em>.</li>
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pb-12">
          <h2 className="text-3xl font-bold text-white leading-tight mb-8">Frequently Asked Questions (FAQ)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Is ViralClip AI free or paid?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                ViralClip AI is free to try with affordable micro-plans starting at just ₹49. Whether you need a <em>Part 1, Part 2 series tags</em> tool or a full-stack <em>podcast to tiktok</em> 9:16 vertical converter, you get high-quality vertical exports without forced monthly subscriptions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Does this viral clips ai tool leave a watermark?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                No! We don't force our logo onto your content. Enjoy a true <em>ai shorts generator without watermark</em> experience on all generated clips.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">How do I convert long videos to shorts?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                It's incredibly simple. Try it for free by uploading your video into our <em>viralclip video generator</em>. You can instantly select your best moments and export them in 9:16 vertical format with series numbering tags.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Does ViralClip AI automatically generate animated captions and subtitles?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Yes! ViralClip AI includes a built-in <em>auto caption generator</em> with 98%+ speech recognition accuracy. It generates trendy, animated viral subtitles including <em>Alex Hormozi style captions</em>, kinetic karaoke word highlights, bold colored keywords, and auto-emojis. You never have to manually type or sync subtitles again.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Why are AI captions essential for viral TikToks, Reels, and YouTube Shorts?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Studies show over 75% of people watch videos with sound muted on social media. Dynamic <em>animated captions for shorts</em> hook the viewer within the first 3 seconds, increasing viewer retention and average watch time by up to 80%. Higher retention signals the TikTok, Instagram, and YouTube algorithms to promote your clip on the Explore and For You pages.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Can I customize caption fonts, highlight colors, and styles?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Yes, completely! You have full control over your <em>subtitles styling</em>. Choose from popular creator presets like Hormozi Bold, Neon Pop, Clean Minimal, or Subtitle Classic. Customize font family, text size, active word highlight color (yellow, cyan, lime green), text outline stroke, and screen position to match your brand.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Grid - Maximum Contrast & High Visibility in Daylight & Sunlight */}
      <div className="w-full bg-[#0a0a0c] border-t-2 border-zinc-700/80 py-12 px-4 shadow-2xl">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
          <Link 
            to="/pricing" 
            className="bg-zinc-900 hover:bg-zinc-800/90 border-2 border-amber-500/70 hover:border-amber-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all shadow-lg group ring-1 ring-amber-500/20"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500/25 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shadow-inner">
              <Zap className="w-6 h-6 fill-amber-400/40 text-amber-300" />
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">Pricing & Plans</div>
              <div className="text-xs font-bold text-amber-300 mt-1">₹0 / ₹49 / ₹99 / ₹199</div>
            </div>
          </Link>

          <Link 
            to="/privacy-policy" 
            className="bg-zinc-900 hover:bg-zinc-800/90 border-2 border-emerald-500/60 hover:border-emerald-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all shadow-lg group ring-1 ring-emerald-500/20"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/25 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">Privacy Policy</div>
              <div className="text-xs font-semibold text-zinc-200 mt-1">Data & GDPR Safety</div>
            </div>
          </Link>
          
          <Link 
            to="/terms-of-service" 
            className="bg-zinc-900 hover:bg-zinc-800/90 border-2 border-cyan-500/60 hover:border-cyan-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all shadow-lg group ring-1 ring-cyan-500/20"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-500/25 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform shadow-inner">
              <FileText className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">Terms of Service</div>
              <div className="text-xs font-semibold text-zinc-200 mt-1">Usage & Service Rules</div>
            </div>
          </Link>

          <Link 
            to="/refund-policy" 
            className="bg-zinc-900 hover:bg-zinc-800/90 border-2 border-rose-500/60 hover:border-rose-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all shadow-lg group ring-1 ring-rose-500/20"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-500/25 border-2 border-rose-400/50 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform shadow-inner">
              <RotateCcw className="w-6 h-6 text-rose-300" />
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-rose-300 transition-colors">Refund & Cancel</div>
              <div className="text-xs font-semibold text-zinc-200 mt-1">Digital Processing Policy</div>
            </div>
          </Link>

          <Link 
            to="/contact" 
            className="col-span-2 md:col-span-1 bg-zinc-900 hover:bg-zinc-800/90 border-2 border-indigo-500/60 hover:border-indigo-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all shadow-lg group ring-1 ring-indigo-500/20"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-500/25 border-2 border-indigo-400/50 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform shadow-inner">
              <Mail className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">Contact Support</div>
              <div className="text-xs font-semibold text-zinc-200 mt-1 truncate max-w-[145px]">viralclipaihelp@gmail.com</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
