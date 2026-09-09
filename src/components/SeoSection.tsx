import { Link } from 'react-router-dom';
import React from 'react';
import { ArrowRight, ShieldCheck, FileText, Mail } from 'lucide-react';

const SocialGif = () => (
  <div className="w-full aspect-video bg-[#0a0a0a] rounded-3xl overflow-hidden border border-zinc-800 mb-8 relative flex items-center justify-center">
    {/* Animated Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-cyan-500/10 animate-pulse" style={{ animationDuration: '3s' }}></div>
    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3 }}></div>

    <div className="flex items-center justify-center gap-8 md:gap-16 z-10">
      {/* YouTube */}
      <div className="animate-bounce drop-shadow-2xl" style={{ animationDuration: '2.5s', animationDelay: '0s' }}>
        <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
          <path fill="#FFFFFF" d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"/>
        </svg>
      </div>

      {/* Instagram */}
      <div className="animate-bounce drop-shadow-2xl" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}>
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
      <div className="animate-bounce drop-shadow-2xl" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }}>
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
            Turn AI long video to shorts free into ready-to-publish posts with AI-generated titles, descriptions, and thumbnails. Connect your social accounts to schedule TikTok, Instagram, and YouTube Shorts, keeping your content calendar filled for weeks.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-6">
          <SocialGif />
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Turn Long Videos into 10+ Shorts in 30 Seconds</h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Skip hours of manual editing. Our free long video to short video AI finds the best moments, creates 10+ engaging Shorts, and gets your content ready for TikTok, Instagram, and YouTube.
          </p>
          <button className="flex items-center gap-2 text-emerald-400 border border-emerald-900/50 bg-emerald-900/10 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-900/30 transition-colors">
            Convert Long Video to Shorts <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Section 4 */}
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">How to Use Our Long to Short Video Converter in 3 Steps</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">1. Paste a video link or upload your file</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Paste a link from YouTube, TikTok, Twitch, Vimeo, Facebook, Dailymotion (and more), or upload a video from your device or Google Drive.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">2. Let AI find the viral moments</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Our AI analyzes your video, identifies the most engaging parts, and automatically crops them into perfect vertical shorts with captions.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">3. Export and share</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Review your clips, tweak the settings if needed, and export them directly to your device ready to go viral.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">Convert Long Videos to Viral Shorts with ViralClip AI</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            ViralClip AI is a free online tool designed to turn long videos into shorts, reels, and TikTok clips in seconds. Easily convert YouTube podcasts, interviews, and long videos into engaging vertical shorts without watermarks. Simply paste your long video link and let our AI generate viral clips automatically.
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
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Is this a completely free youtube video to shorts ai converter?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Yes, ViralClip AI is a 100% free tool. Whether you need a <em>podcast to shorts ai free</em> tool or a general <em>long video to reels ai online converter</em>, you can do it all here without any hidden fees.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Does this viral clips ai tool leave a watermark?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                No! We are the <em>best free ai reel generator from video</em> precisely because we don't force our logo onto your content. Enjoy a true <em>ai shorts generator without watermark</em> experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">How do I convert long video to shorts free?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                It's incredibly simple. Just upload your video into our <em>viralclip video generator</em>. You can instantly select your best moments and export them in 9:16 vertical format.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Grid */}
      <div className="w-full bg-[#050505] border-t border-zinc-900 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/privacy-policy" className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">
            <ShieldCheck className="w-6 h-6 text-zinc-500" />
            <div className="text-center">
              <div className="text-sm font-bold text-zinc-300">Privacy Policy</div>
              <div className="text-[10px] text-zinc-500">Data & GDPR</div>
            </div>
          </Link>
          
          <Link to="/terms-of-service" className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">
            <FileText className="w-6 h-6 text-zinc-500" />
            <div className="text-center">
              <div className="text-sm font-bold text-zinc-300">Terms of Service</div>
              <div className="text-[10px] text-zinc-500">Usage rules</div>
            </div>
          </Link>

          <Link to="/contact" className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">
            <Mail className="w-6 h-6 text-zinc-500" />
            <div className="text-center">
              <div className="text-sm font-bold text-zinc-300">Contact Support</div>
              <div className="text-[10px] text-zinc-500">kamarpathan0786@gmail.com</div>
            </div>
          </Link>

          <button className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-1.5 h-6">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FF0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><path fill="#FFFFFF" d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"/></svg>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="url(#instaGrad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="instaGrad2" x1="2" y1="2" x2="22" y2="22"><stop offset="0%" stopColor="#f58529" /><stop offset="50%" stopColor="#dd2a7b" /><stop offset="100%" stopColor="#8134af" /></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FFFFFF" style={{ filter: 'drop-shadow(1px 1px 0px #ff0050) drop-shadow(-1px -1px 0px #00f2fe)' }}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-zinc-300">Platforms</div>
              <div className="text-[10px] text-zinc-500">YT, Insta, TikTok</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
