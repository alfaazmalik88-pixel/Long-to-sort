export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Viral Growth Guides' | 'AI Video Editing Tips' | 'Shorts SEO Hacks';
  readTime: string;
  summary: string;
  date: string;
  badgeColor: string;
  gradient: string;
  iconName: string;
  previewSnippet: string;
  fullGuide: {
    intro: string;
    keyTakeaway: string;
    steps: {
      stepNumber: number;
      title: string;
      description: string;
      tip?: string;
    }[];
    proTips: string[];
    faq: {
      question: string;
      answer: string;
    }[];
  };
}

export const BLOG_CATEGORIES = [
  'All Guides',
  'Viral Growth Guides',
  'AI Video Editing Tips',
  'Shorts SEO Hacks'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'alex-hormozi-captions',
    slug: 'how-to-add-alex-hormozi-captions-in-60-seconds',
    title: 'How to Add Alex Hormozi Captions in 60 Seconds',
    category: 'AI Video Editing Tips',
    readTime: '3 min read',
    summary: 'Master the high-retention animated subtitle style used by Alex Hormozi, MrBeast, and top creators to boost watch time past 85%.',
    date: 'Oct 2026',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    gradient: 'from-amber-500/20 via-orange-500/10 to-zinc-950',
    iconName: 'Flame',
    previewSnippet: 'YEH EK SECRET HAI • WORD HIGHLIGHT',
    fullGuide: {
      intro: 'Alex Hormozi revolutionized short-form content with word-by-word highlighted captions, bold uppercase typography, and neon color accents. Retention data shows that videos with animated kinetic subtitles retain up to 38% more viewers beyond the first 5 seconds.',
      keyTakeaway: 'Viewers scroll on mute over 70% of the time. Bold, animated word-level captions force the brain to read and stay locked to the video.',
      steps: [
        {
          stepNumber: 1,
          title: 'Upload or Paste Your Long Video',
          description: 'Upload your raw video or paste a YouTube podcast URL directly into ViralClip AI. The AI scans the audio waveform for speech clarity.',
          tip: 'Videos with energetic spoken dialogue yield the highest accuracy.'
        },
        {
          stepNumber: 2,
          title: 'Select "Hormozi Kinetic" Caption Preset',
          description: 'Under Editor Settings > Subtitle Style, choose "Hormozi". ViralClip automatically applies the iconic yellow/cyan word highlight on top of uppercase bold lettering.',
          tip: 'Keep captions in the lower-middle third (safe zone) to avoid TikTok & Reels overlay icons.'
        },
        {
          stepNumber: 3,
          title: 'Auto-Generate Word-Level Timestamps',
          description: 'Click "Auto Subtitles" or "Whisper AI". The engine extracts precise millisecond word timings so each word glows exactly as spoken.',
          tip: 'Supports English and multilingual speech recognition out of the box.'
        },
        {
          stepNumber: 4,
          title: 'Export in 1080p HD with Zero Watermark',
          description: 'Render your clip. ViralClip burns the high-contrast subtitles with crisp black drop-shadows directly into the video stream with zero GPU lag.',
          tip: 'Export with Part 1 / Part 2 tags to build bingeable multi-part series.'
        }
      ],
      proTips: [
        'Keep 2 to 4 words per subtitle chunk to avoid cluttering mobile screens.',
        'Use neon yellow (#FACC15) or electric cyan (#22D3EE) for maximum eye-tracking.',
        'Never place subtitles at the very bottom edge where captions overlap with usernames and sound titles.'
      ],
      faq: [
        {
          question: 'Why do Hormozi style captions perform so well?',
          answer: 'They create kinetic micro-movements on screen every 0.3 seconds, resetting the viewer’s visual attention span and preventing swipe-away.'
        },
        {
          question: 'Can I generate subtitles for regional audio?',
          answer: 'Yes! ViralClip AI automatically transcribes spoken audio into clean, high-retention English/Roman captions so audiences worldwide can follow effortlessly.'
        }
      ]
    }
  },
  {
    id: 'viral-hooks-formula',
    slug: 'viral-hooks-formula-retain-85-percent-watch-time',
    title: 'Viral Hooks Formula: Retain 85%+ Watch Time on Shorts & Reels',
    category: 'Viral Growth Guides',
    readTime: '4 min read',
    summary: 'The proven 3-second hook framework top agencies use to stop thumbs and keep audiences hooked until the final call to action.',
    date: 'Oct 2026',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-zinc-950',
    iconName: 'Zap',
    previewSnippet: '0-3 SEC HOOK • STOP THE SCROLL',
    fullGuide: {
      intro: 'The YouTube and Instagram algorithm decides whether to push your video to millions within the first 30 seconds of upload based on one metric: View vs. Swiped Ratio. If less than 70% of viewers stay past second 3, your video dies.',
      keyTakeaway: 'Never start with "Hey guys, welcome back". Start in the middle of intense action, a bold contrarian claim, or a visual question.',
      steps: [
        {
          stepNumber: 1,
          title: 'The "Negative Hook" Technique',
          description: 'Humans are psychologically wired to avoid pain twice as much as seeking pleasure. Use hooks like "Stop doing this mistake" or "Nobody is telling you the truth about..."',
          tip: 'Pair negative hooks with a warning sound or subtle zoom-in.'
        },
        {
          stepNumber: 2,
          title: 'Visual Pattern Interrupt in Second 1',
          description: 'Change the camera angle, drop a bold headline sticker, or insert an animated subtitle word right at 0.00 seconds.',
          tip: 'ViralClip AI automatically detects speech peaks so the hook begins instantly without silence.'
        },
        {
          stepNumber: 3,
          title: 'Open an Irresistible "Curiosity Loop"',
          description: 'Promise a secret or payoff that is revealed only at the very end of the short (e.g. "Wait till the last tip to see what happened...").',
          tip: 'Ensure the payoff is genuinely good so viewers comment and save the clip.'
        },
        {
          stepNumber: 4,
          title: 'Seamless Loop Ending',
          description: 'Make the last sentence connect smoothly into the first sentence. When the video loops, viewers watch the first 2 seconds twice without realizing it!',
          tip: 'This pushes retention past 100%, which triggers algorithm viral recommendations.'
        }
      ],
      proTips: [
        'Aim for a Viewed vs. Swiped ratio of 75% or higher in YouTube Studio Analytics.',
        'Cut every breathe and micro-pause in the first 5 seconds using AI silence trimmers.',
        'Display a high-contrast top headline sticker like "PART 1: THE SECRET TRICK".'
      ],
      faq: [
        {
          question: 'What is a good average percentage viewed (APV)?',
          answer: 'For a 30-second Short, aim for 90-110% APV. For a 60-second Short, aim for 75-85% APV.'
        },
        {
          question: 'Should I put sound effects on hooks?',
          answer: 'Yes! A subtle whoosh or pop effect during the first word increases cognitive alertness.'
        }
      ]
    }
  },
  {
    id: 'shorts-seo-hacks',
    slug: 'shorts-seo-secrets-rank-number-1-youtube-explore',
    title: 'Shorts SEO Secrets: Rank #1 on YouTube Search & Explore',
    category: 'Shorts SEO Hacks',
    readTime: '3 min read',
    summary: 'How to optimize title tags, hashtags, and spoken metadata so YouTube and Instagram search recommend your video for months.',
    date: 'Oct 2026',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-zinc-950',
    iconName: 'Sparkles',
    previewSnippet: '#SHORTS • SEARCH INTENT METADATA',
    fullGuide: {
      intro: 'Most creators think Shorts only get traffic from the Shorts feed. But evergreen search traffic is how top channels gain consistent daily subscribers for 12+ months from a single 40-second video.',
      keyTakeaway: 'YouTube’s AI transcribes your audio and indexes every spoken word. Spoken keywords + title search intent = endless algorithmic traffic.',
      steps: [
        {
          stepNumber: 1,
          title: 'Target "How-To" and High-Intent Search Queries',
          description: 'Use the YouTube search suggest bar. When you type "how to grow on...", observe the top auto-complete keywords and build shorts answering those exact questions.',
          tip: 'Search-based shorts have 3x higher subscriber conversion rates than random comedy clips.'
        },
        {
          stepNumber: 2,
          title: 'Say Your Target Keyword in the First 5 Seconds',
          description: 'Because YouTube auto-transcribes your audio, saying "Alex Hormozi captions" aloud helps YouTube categorise your video into the right search bucket.',
          tip: 'ViralClip AI embeds clear audio tracks so speech recognizers transcribe with 99% accuracy.'
        },
        {
          stepNumber: 3,
          title: 'The 3-Hashtag Rule for Shorts',
          description: 'Include #Shorts in your title or description, plus 2 specific niche tags (e.g. #ContentCreation #VideoEditing). Avoid spamming 20 hashtags.',
          tip: 'Keep the title under 50 characters so it does not get truncated on mobile screens.'
        },
        {
          stepNumber: 4,
          title: 'Select a High-Click Thumbnail Frame',
          description: 'In the YouTube Shorts mobile uploader, drag the thumbnail selector frame to a scene showing high emotion or bold subtitle text.',
          tip: 'Thumbnails showing bold text get 24% higher click-through on YouTube search result pages.'
        }
      ],
      proTips: [
        'Always include #shorts in the title or description to guarantee shorts feed eligibility.',
        'Write descriptions with 2-3 sentences packed with natural synonyms of your main keyword.',
        'Pin a top comment asking a question to kickstart community engagement.'
      ],
      faq: [
        {
          question: 'Do tags matter for YouTube Shorts in 2026?',
          answer: 'Standard video tags have minimal weight; spoken audio transcription and video titles carry 90% of the SEO power.'
        },
        {
          question: 'Can Shorts generate revenue from search traffic?',
          answer: 'Yes! Shorts viewed through search and feed both count toward Creator Pool monetization and long-term channel authority.'
        }
      ]
    }
  },
  {
    id: 'opus-clip-alternative',
    slug: 'opus-clip-alternative-convert-long-videos-to-shorts',
    title: 'Opus Clip Alternative: Convert Long YouTube Videos into 10 Viral Shorts',
    category: 'AI Video Editing Tips',
    readTime: '4 min read',
    summary: 'Why paying $29/month for video clipping is outdated when you can get 1080p Full HD, zero watermark, and affordable ₹49 micro-plans.',
    date: 'Oct 2026',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-zinc-950',
    iconName: 'Crown',
    previewSnippet: 'LONG-TO-SHORT • ZERO WATERMARK',
    fullGuide: {
      intro: 'Converting 2-hour podcasts or YouTube tutorials into bite-sized 9:16 vertical shorts used to take 6 hours of manual timeline cutting. Modern AI auto-detects highlights, centers the speaker, and animates subtitles in seconds.',
      keyTakeaway: 'One long-form podcast can easily yield 10-15 viral shorts. Repurposing is the #1 growth lever for busy creators and agencies.',
      steps: [
        {
          stepNumber: 1,
          title: 'Input Video Source (Upload or URL)',
          description: 'Feed any MP4, MOV, or YouTube link into ViralClip AI. The engine analyzes speech density, energy spikes, and key topic shifts.',
          tip: 'Supports 4K and 1080p source videos without quality degradation.'
        },
        {
          stepNumber: 2,
          title: 'Auto Split & Viral Moments Detection',
          description: 'The smart trimmer extracts natural 30s to 60s clips that start with a clear hook and end on a punchline or thought conclusion.',
          tip: 'You can adjust clip start/end boundaries on the interactive waveform timeline.'
        },
        {
          stepNumber: 3,
          title: 'Smart 9:16 Vertical Reframing',
          description: 'Choose between "Full Video Fit" (no crop, 100% visible on dark background) or "Fill Crop" for cinematic full-screen immersion.',
          tip: 'Use "Full Video Fit" for tutorials with desktop screens or multi-person interviews.'
        },
        {
          stepNumber: 4,
          title: 'Export Without Watermarks',
          description: 'Export all generated shorts in 1 click. Unlike competitors that slap giant logos on free exports, ViralClip AI gives 100% clean creator videos.',
          tip: 'Get 5 free minutes on signup with budget top-ups starting at just ₹49.'
        }
      ],
      proTips: [
        'Repurpose each long episode into at least 1 TikTok, 1 Reel, and 1 YouTube Short every day.',
        'Use Part 1, Part 2, and Part 3 serial tags to encourage viewers to visit your profile for the next episode.',
        'Add a custom branded title banner like "EPISODE 42 • THE AI REVOLUTION".'
      ],
      faq: [
        {
          question: 'Does ViralClip AI charge expensive monthly subscriptions?',
          answer: 'No! Unlike tools charging $19-$49/month recurring fees, ViralClip AI provides pay-as-you-go micro-packs from ₹49 with credits that never expire.'
        },
        {
          question: 'Can I download videos on mobile?',
          answer: 'Yes, the web app is fully mobile-responsive and renders directly in your phone browser.'
        }
      ]
    }
  },
  {
    id: 'kinetic-subtitles-guide',
    slug: 'kinetic-subtitles-dynamic-word-highlighting-secret',
    title: 'Dynamic Subtitles: The Secret Behind 10M+ View Shorts & Reels',
    category: 'Shorts SEO Hacks',
    readTime: '3 min read',
    summary: 'Why kinetic word-by-word highlighting drives 5x higher engagement and keeps viewers glued until the final second.',
    date: 'Oct 2026',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    gradient: 'from-rose-500/20 via-pink-500/10 to-zinc-950',
    iconName: 'Flame',
    previewSnippet: 'KINETIC SUBTITLES • 100% RETENTION',
    fullGuide: {
      intro: 'Over 85% of mobile viewers watch videos in sound-off or noisy environments. Dynamic word-by-word synchronized subtitles reset viewer attention every 0.3 seconds and drastically prevent swipe-away rates.',
      keyTakeaway: 'Uppercase kinetic subtitles with active color highlights match human reading velocity, boosting watch time past 85% on Shorts & Reels.',
      steps: [
        {
          stepNumber: 1,
          title: 'Automated Speech Recognition',
          description: 'ViralClip AI uses neural speech models designed to transcribe voice with high phonetic accuracy, handling fast speech and multilingual terms effortlessly.',
          tip: 'Works seamlessly even when speakers talk quickly or use industry slang.'
        },
        {
          stepNumber: 2,
          title: 'Uppercase Typography & Contrast',
          description: 'Subtitles are styled in crisp bold uppercase typography with transparent backgrounds for maximum cinematic immersion.',
          tip: 'Eliminates ugly black boxes that obscure the video subject.'
        },
        {
          stepNumber: 3,
          title: 'Kinetic Word Synchronization',
          description: 'Each word glows in bright yellow at the exact microsecond it is spoken by the creator.',
          tip: 'Syncs perfectly with fast-paced storytelling videos and reaction shorts.'
        },
        {
          stepNumber: 4,
          title: 'Viral Title Stickers & Part Tags',
          description: 'Top creators use series tags like "PART 1" or "EPISODE 1". Enable the Title Sticker in Settings for instant series branding.',
          tip: 'Boosts channel binge-watching as viewers hunt for Part 2 in your shorts feed.'
        }
      ],
      proTips: [
        'Always format subtitle text in all-caps (UPPERCASE) for crisp readability against busy video backgrounds.',
        'Keep font weight extra-bold (Black 900) so subtitles pop on small phone screens.',
        'Keep backgrounds 100% transparent so the video remains completely visible.'
      ],
      faq: [
        {
          question: 'Can I edit the generated subtitle words?',
          answer: 'Yes, ViralClip AI provides an interactive word-by-word editor where you can tweak spellings or timings with zero hassle.'
        },
        {
          question: 'Does this work for English and other global languages?',
          answer: 'Absolutely! ViralClip transcribes crisp global captions with identical viral word-level highlighting.'
        }
      ]
    }
  }
];

export const CREATOR_FAQS = [
  {
    q: 'How do Alex Hormozi style animated captions increase viewer retention?',
    a: 'Kinetic, word-by-word highlighted subtitles create visual movement every 0.3 to 0.5 seconds. Because over 70% of viewers scroll on mute or in public spaces, reading dynamic captions keeps their cognitive focus locked to your video, reducing swipe-away rates by up to 38%.'
  },
  {
    q: 'What is the ideal duration for a YouTube Short or Instagram Reel in 2026?',
    a: 'Data from millions of viral clips reveals the sweet spot is between 28 and 48 seconds. This allows sufficient time to deliver a complete story arc with a hook, key insight, and call to action while maintaining an average view duration (AVD) above 80%.'
  },
  {
    q: 'Can I convert long YouTube podcasts into shorts without watermarks?',
    a: 'Yes! ViralClip AI does not force watermark logos on your content. Both trial exports and paid plans render clean, professional 1080p Full HD video ready for immediate creator distribution.'
  },
  {
    q: 'How does ViralClip AI generate word-by-word synchronized subtitles?',
    a: 'ViralClip AI processes your audio waveform using advanced speech-to-text recognition to map exact start and end timestamps down to the millisecond for each individual spoken word, synchronizing glowing highlights seamlessly with your voice.'
  },
  {
    q: 'Do I get free minutes to test the AI video editor before purchasing?',
    a: 'Yes! Every new creator gets 5 free processing minutes upon signup. You can upload a real video, generate viral clips, customize animated subtitles, and export a clean Full HD short with zero commitments.'
  }
];
