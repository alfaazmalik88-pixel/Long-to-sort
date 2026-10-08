import fs from 'fs';
import { execSync } from 'child_process';

console.log('Generating official ViralClip AI highlighted demo scenes...');

// Scene 1: Desktop Workspace with High-Contrast Highlight Banners
const scene1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="deskBg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#deskBg)" />

  <!-- Background Ambience -->
  <circle cx="200" cy="200" r="300" fill="#facc15" opacity="0.12" filter="blur(80px)" />
  <circle cx="1720" cy="300" r="320" fill="#6366f1" opacity="0.18" filter="blur(80px)" />

  <!-- TOP PROMINENT HIGHLIGHT BADGE -->
  <g transform="translate(960, 60)" text-anchor="middle">
    <rect x="-340" y="-30" width="680" height="60" rx="30" fill="#facc15" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.8))" />
    <text y="10" fill="#000000" font-family="sans-serif" font-size="28" font-weight="900" letter-spacing="1">
      🎬 STEP 1: UPLOAD ANY LONG VIDEO
    </text>
  </g>

  <!-- Desktop Monitor Frame -->
  <g transform="translate(360, 115)">
    <!-- Stand -->
    <rect x="560" y="620" width="80" height="120" fill="#334155" rx="8" />
    <ellipse cx="600" cy="740" rx="140" ry="16" fill="#1e293b" stroke="#475569" stroke-width="2" />
    
    <!-- Monitor Outer Bezel -->
    <rect width="1200" height="640" rx="24" fill="#090d16" stroke="#475569" stroke-width="4" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.9))" />
    <!-- Screen Display -->
    <rect x="16" y="16" width="1168" height="608" rx="12" fill="#0f172a" />

    <!-- Video Player Interface inside monitor -->
    <rect x="40" y="35" width="1120" height="48" rx="8" fill="#1e293b" />
    <circle cx="70" cy="59" r="8" fill="#ef4444" />
    <circle cx="95" cy="59" r="8" fill="#eab308" />
    <circle cx="120" cy="59" r="8" fill="#22c55e" />
    <rect x="160" y="45" width="600" height="28" rx="6" fill="#0f172a" />
    <text x="180" y="64" fill="#94a3b8" font-family="sans-serif" font-size="14">https://youtube.com/watch?v=podcast-interview-45min</text>

    <!-- Video Canvas -->
    <rect x="40" y="100" width="800" height="420" rx="12" fill="#020617" stroke="#334155" stroke-width="2" />
    
    <!-- Center Upload Callout Card with Bright Neon Glow -->
    <rect x="150" y="180" width="580" height="160" rx="20" fill="#020617" stroke="#6366f1" stroke-width="3" filter="drop-shadow(0 10px 25px rgba(99,102,241,0.5))" />
    <!-- Highlighted Badge on Card -->
    <rect x="220" y="210" width="440" height="42" rx="21" fill="#facc15" />
    <text x="440" y="239" fill="#000000" font-family="sans-serif" font-size="22" font-weight="900" text-anchor="middle">
      ⬆️ LONG VIDEO DETECTED (45:00)
    </text>
    <text x="440" y="285" fill="#38bdf8" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">
      AI Analyzing Audio, Speech &amp; Viral Hooks...
    </text>

    <!-- Side Clips Output Column -->
    <rect x="860" y="100" width="300" height="420" rx="12" fill="#1e293b" stroke="#6366f1" stroke-width="2" />
    <!-- Side Header Badge -->
    <rect x="880" y="115" width="260" height="38" rx="8" fill="#22c55e" />
    <text x="1010" y="141" fill="#000000" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">
      10+ VIRAL MOMENTS FOUND
    </text>
    
    <rect x="880" y="165" width="260" height="75" rx="8" fill="#0f172a" stroke="#facc15" stroke-width="2" />
    <text x="900" y="195" fill="#facc15" font-family="sans-serif" font-size="14" font-weight="bold">Clip #1: The Ultimate Hook</text>
    <text x="900" y="222" fill="#22c55e" font-family="sans-serif" font-size="13" font-weight="900">Score 98% • 0:45s</text>

    <rect x="880" y="250" width="260" height="75" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <text x="900" y="280" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Clip #2: The Crazy Story</text>
    <text x="900" y="307" fill="#22c55e" font-family="sans-serif" font-size="13" font-weight="900">Score 95% • 0:52s</text>

    <rect x="880" y="335" width="260" height="75" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <text x="900" y="365" fill="#94a3b8" font-family="sans-serif" font-size="14" font-weight="bold">Clip #3: The Big Secret</text>
    <text x="900" y="392" fill="#22c55e" font-family="sans-serif" font-size="13" font-weight="900">Score 97% • 0:38s</text>
  </g>

  <!-- BOTTOM GRAND HIGHLIGHT BANNER (SUPER HIGH CONTRAST) -->
  <g transform="translate(960, 920)" text-anchor="middle">
    <!-- Solid Jet Black Card with Vivid Neon Stroke -->
    <rect x="-620" y="-70" width="1240" height="150" rx="30" fill="#020617" stroke="#6366f1" stroke-width="4" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.95))" />
    
    <!-- Big Bold Header -->
    <text y="-20" fill="#ffffff" font-family="sans-serif" font-size="46" font-weight="900" letter-spacing="-1">
      ✂️ LONG VIDEO? MAKE IT VIRAL SHORT CLIPS!
    </text>

    <!-- Highlighter Yellow Pill for Subtitle -->
    <rect x="-480" y="10" width="960" height="48" rx="24" fill="#facc15" />
    <text y="43" fill="#000000" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="1">
      🔥 Convert 1 Long Video Into 10+ High-Retention Shorts in 60s 🔥
    </text>
  </g>
</svg>`;

// Scene 2: AI Neural Processor with Creator Thumbnails
const scene2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="chipBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#chipBg)" />

  <!-- TOP PROMINENT HIGHLIGHT BADGE -->
  <g transform="translate(960, 60)" text-anchor="middle">
    <rect x="-320" y="-30" width="640" height="60" rx="30" fill="#06b6d4" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.8))" />
    <text y="10" fill="#000000" font-family="sans-serif" font-size="28" font-weight="900" letter-spacing="1">
      🧠 STEP 2: AI FINDS BEST MOMENTS
    </text>
  </g>

  <!-- Circuit Board Traces -->
  <g stroke="url(#glowLine)" stroke-width="3" fill="none" opacity="0.6">
    <path d="M100 240 L400 240 L600 440 L800 440" />
    <path d="M100 820 L500 820 L700 640 L800 640" />
    <path d="M1820 240 L1520 240 L1320 440 L1120 440" />
    <path d="M1820 820 L1420 820 L1220 640 L1120 640" />
  </g>

  <!-- Central Glowing AI Chip -->
  <g transform="translate(960, 480)">
    <circle r="240" fill="#6366f1" opacity="0.2" filter="blur(50px)" />
    <!-- Chip Base -->
    <rect x="-170" y="-170" width="340" height="340" rx="32" fill="#020617" stroke="#6366f1" stroke-width="4" filter="drop-shadow(0 0 35px #4f46e5)" />
    <rect x="-140" y="-140" width="280" height="280" rx="20" fill="#1e1b4b" stroke="#06b6d4" stroke-width="2" />
    
    <!-- Microprocessor icon & text -->
    <text y="-35" fill="#facc15" font-family="sans-serif" font-size="64" text-anchor="middle">⚡</text>
    <text y="25" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="900" text-anchor="middle" letter-spacing="2">AI NEURAL</text>
    <text y="65" fill="#38bdf8" font-family="sans-serif" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="1">VIRAL DETECTOR</text>
    
    <!-- Status Pill -->
    <rect x="-110" y="90" width="220" height="34" rx="17" fill="#22c55e" />
    <text x="0" y="113" fill="#000000" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle">● ANALYZING AUDIO 100%</text>
  </g>

  <!-- Highlighted Viral Moment Cards around chip -->
  <!-- Card 1 -->
  <g transform="translate(320, 240)">
    <rect width="320" height="180" rx="18" fill="#020617" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))" />
    <rect x="20" y="20" width="100" height="26" rx="13" fill="#22c55e" />
    <text x="70" y="38" fill="#000" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle">VIRAL 98%</text>
    <text x="20" y="80" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Viral Hook Spike</text>
    <text x="20" y="110" fill="#94a3b8" font-family="sans-serif" font-size="14">High listener energy detected</text>
    <rect x="20" y="130" width="280" height="6" rx="3" fill="#6366f1" />
  </g>

  <!-- Card 2 -->
  <g transform="translate(1280, 240)">
    <rect width="320" height="180" rx="18" fill="#020617" stroke="#ec4899" stroke-width="3" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))" />
    <rect x="20" y="20" width="100" height="26" rx="13" fill="#22c55e" />
    <text x="70" y="38" fill="#000" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle">VIRAL 96%</text>
    <text x="20" y="80" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Emotional Peak</text>
    <text x="20" y="110" fill="#94a3b8" font-family="sans-serif" font-size="14">Speech cadence jump at 14:20</text>
    <rect x="20" y="130" width="280" height="6" rx="3" fill="#ec4899" />
  </g>

  <!-- Card 3 -->
  <g transform="translate(320, 560)">
    <rect width="320" height="180" rx="18" fill="#020617" stroke="#a855f7" stroke-width="3" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))" />
    <rect x="20" y="20" width="100" height="26" rx="13" fill="#22c55e" />
    <text x="70" y="38" fill="#000" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle">VIRAL 99%</text>
    <text x="20" y="80" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Core Lesson / Advice</text>
    <text x="20" y="110" fill="#94a3b8" font-family="sans-serif" font-size="14">High shareability score</text>
    <rect x="20" y="130" width="280" height="6" rx="3" fill="#a855f7" />
  </g>

  <!-- Card 4 -->
  <g transform="translate(1280, 560)">
    <rect width="320" height="180" rx="18" fill="#020617" stroke="#facc15" stroke-width="3" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))" />
    <rect x="20" y="20" width="100" height="26" rx="13" fill="#22c55e" />
    <text x="70" y="38" fill="#000" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle">VIRAL 97%</text>
    <text x="20" y="80" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">The Golden Punchline</text>
    <text x="20" y="110" fill="#94a3b8" font-family="sans-serif" font-size="14">Audience engagement 99%</text>
    <rect x="20" y="130" width="280" height="6" rx="3" fill="#facc15" />
  </g>

  <!-- BOTTOM GRAND HIGHLIGHT BANNER -->
  <g transform="translate(960, 920)" text-anchor="middle">
    <rect x="-620" y="-70" width="1240" height="150" rx="30" fill="#020617" stroke="#06b6d4" stroke-width="4" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.95))" />
    <text y="-20" fill="#ffffff" font-family="sans-serif" font-size="46" font-weight="900" letter-spacing="-1">
      🎯 AI FINDS THE BEST MOMENTS AUTOMATICALLY
    </text>
    <rect x="-480" y="10" width="960" height="48" rx="24" fill="#facc15" />
    <text y="43" fill="#000000" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="1">
      ⚡ Detects High Energy, Punchlines &amp; Golden Insights Instantly ⚡
    </text>
  </g>
</svg>`;

// Scene 3: 4 Mobile Phones with Shorts & Reels
const scene3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="phoneBg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#phoneBg)" />

  <!-- TOP PROMINENT HIGHLIGHT BADGE -->
  <g transform="translate(960, 60)" text-anchor="middle">
    <rect x="-350" y="-30" width="700" height="60" rx="30" fill="#facc15" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.8))" />
    <text y="10" fill="#000000" font-family="sans-serif" font-size="28" font-weight="900" letter-spacing="1">
      📱 STEP 3: AUTO 9:16 VERTICAL REFRAME
    </text>
  </g>

  <!-- 4 iPhone Mockups with Highlighted Captions -->
  <!-- Phone 1 -->
  <g transform="translate(240, 130)">
    <rect width="320" height="660" rx="36" fill="#000000" stroke="#facc15" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(250,204,21,0.4))" />
    <rect x="12" y="12" width="296" height="636" rx="28" fill="#1e293b" />
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <!-- Yellow Highlighted Caption -->
    <rect x="20" y="440" width="280" height="70" rx="16" fill="#facc15" stroke="#000" stroke-width="2" />
    <text x="160" y="482" fill="#000000" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">🔥 VIRAL HOOK (98%)</text>
    <rect x="30" y="550" width="260" height="8" rx="4" fill="#6366f1" />
  </g>

  <!-- Phone 2 -->
  <g transform="translate(620, 130)">
    <rect width="320" height="660" rx="36" fill="#000000" stroke="#38bdf8" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(56,189,248,0.4))" />
    <rect x="12" y="12" width="296" height="636" rx="28" fill="#0f172a" />
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <!-- Cyan Highlighted Caption -->
    <rect x="20" y="440" width="280" height="70" rx="16" fill="#0284c7" stroke="#ffffff" stroke-width="2" />
    <text x="160" y="482" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">✨ HORMOZI CAPTIONS</text>
    <rect x="30" y="550" width="260" height="8" rx="4" fill="#38bdf8" />
  </g>

  <!-- Phone 3 -->
  <g transform="translate(1000, 130)">
    <rect width="320" height="660" rx="36" fill="#000000" stroke="#22c55e" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(34,197,94,0.4))" />
    <rect x="12" y="12" width="296" height="636" rx="28" fill="#1e293b" />
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <!-- Green Highlighted Caption -->
    <rect x="20" y="440" width="280" height="70" rx="16" fill="#22c55e" stroke="#000" stroke-width="2" />
    <text x="160" y="482" fill="#000000" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">🛡️ ZERO WATERMARK</text>
    <rect x="30" y="550" width="260" height="8" rx="4" fill="#22c55e" />
  </g>

  <!-- Phone 4 -->
  <g transform="translate(1380, 130)">
    <rect width="320" height="660" rx="36" fill="#000000" stroke="#ec4899" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(236,72,153,0.4))" />
    <rect x="12" y="12" width="296" height="636" rx="28" fill="#0f172a" />
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <!-- Pink Highlighted Caption -->
    <rect x="20" y="440" width="280" height="70" rx="16" fill="#ec4899" stroke="#ffffff" stroke-width="2" />
    <text x="160" y="482" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">🎬 PART 1 &amp; 2 SERIES</text>
    <rect x="30" y="550" width="260" height="8" rx="4" fill="#ec4899" />
  </g>

  <!-- BOTTOM GRAND HIGHLIGHT BANNER -->
  <g transform="translate(960, 920)" text-anchor="middle">
    <rect x="-620" y="-70" width="1240" height="150" rx="30" fill="#020617" stroke="#facc15" stroke-width="4" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.95))" />
    <text y="-20" fill="#ffffff" font-family="sans-serif" font-size="46" font-weight="900" letter-spacing="-1">
      🚀 100% READY FOR SHORTS, REELS &amp; TIKTOK
    </text>
    <rect x="-480" y="10" width="960" height="48" rx="24" fill="#facc15" />
    <text y="43" fill="#000000" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="1">
      🔥 Auto-Reframed in 9:16 Full HD with Animated Hormozi Subtitles 🔥
    </text>
  </g>
</svg>`;

// Scene 4: ViralClip AI Web Application Workflow
const scene4Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="appBg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#appBg)" />

  <!-- TOP PROMINENT HIGHLIGHT BADGE -->
  <g transform="translate(960, 60)" text-anchor="middle">
    <rect x="-320" y="-30" width="640" height="60" rx="30" fill="#22c55e" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.8))" />
    <text y="10" fill="#000000" font-family="sans-serif" font-size="28" font-weight="900" letter-spacing="1">
      ⚡ STEP 4: 1-CLICK 1080P EXPORT
    </text>
  </g>

  <!-- Modern SaaS Web App Card -->
  <g transform="translate(310, 130)">
    <rect width="1300" height="680" rx="28" fill="#090d16" stroke="#4f46e5" stroke-width="4" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.9))" />
    
    <!-- App Header Navbar -->
    <rect x="0" y="0" width="1300" height="70" rx="28" fill="#0f172a" />
    <circle cx="50" cy="35" r="16" fill="#6366f1" />
    <text x="80" y="44" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900">ViralClip AI Dashboard</text>
    <rect x="1100" y="16" width="160" height="38" rx="10" fill="#22c55e" />
    <text x="1180" y="41" fill="#000000" font-family="sans-serif" font-size="16" font-weight="900" text-anchor="middle">PRO CREATOR</text>

    <!-- Upload Box in center -->
    <rect x="350" y="100" width="600" height="240" rx="20" fill="#1e1b4b" stroke="#facc15" stroke-width="3" stroke-dasharray="8 6" />
    <circle cx="650" cy="180" r="36" fill="#facc15" />
    <text x="635" y="193" fill="#000000" font-family="sans-serif" font-size="36">☁️</text>
    <text x="650" y="250" fill="#ffffff" font-family="sans-serif" font-size="26" font-weight="900" text-anchor="middle">Upload Any Video (Up to 4K)</text>
    <text x="650" y="280" fill="#facc15" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Drag &amp; drop podcast, vlog, or interview file</text>

    <!-- Generated Shorts Row -->
    <!-- Clip 1 -->
    <rect x="60" y="380" width="360" height="250" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <text x="80" y="420" fill="#38bdf8" font-family="sans-serif" font-size="18" font-weight="900">Clip #1: The Ultimate Hook (0:45)</text>
    <text x="80" y="450" fill="#94a3b8" font-family="sans-serif" font-size="14">Viral Score: 98% • Hormozi Subtitles</text>
    <rect x="80" y="550" width="320" height="54" rx="12" fill="#22c55e" />
    <text x="240" y="584" fill="#000000" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">⬇️ DOWNLOAD 1080P HD</text>

    <!-- Clip 2 -->
    <rect x="470" y="380" width="360" height="250" rx="16" fill="#1e293b" stroke="#facc15" stroke-width="2" />
    <text x="490" y="420" fill="#fde047" font-family="sans-serif" font-size="18" font-weight="900">Clip #2: The Crazy Story (0:52)</text>
    <text x="490" y="450" fill="#94a3b8" font-family="sans-serif" font-size="14">Viral Score: 95% • Hormozi Subtitles</text>
    <rect x="490" y="550" width="320" height="54" rx="12" fill="#22c55e" />
    <text x="650" y="584" fill="#000000" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">⬇️ DOWNLOAD 1080P HD</text>

    <!-- Clip 3 -->
    <rect x="880" y="380" width="360" height="250" rx="16" fill="#1e293b" stroke="#ec4899" stroke-width="2" />
    <text x="900" y="420" fill="#ec4899" font-family="sans-serif" font-size="18" font-weight="900">Clip #3: The Final Lesson (0:38)</text>
    <text x="900" y="450" fill="#94a3b8" font-family="sans-serif" font-size="14">Viral Score: 97% • Hormozi Subtitles</text>
    <rect x="900" y="550" width="320" height="54" rx="12" fill="#22c55e" />
    <text x="1060" y="584" fill="#000000" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">⬇️ DOWNLOAD 1080P HD</text>
  </g>

  <!-- BOTTOM GRAND HIGHLIGHT BANNER -->
  <g transform="translate(960, 920)" text-anchor="middle">
    <rect x="-620" y="-70" width="1240" height="150" rx="30" fill="#020617" stroke="#22c55e" stroke-width="4" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.95))" />
    <text y="-20" fill="#ffffff" font-family="sans-serif" font-size="46" font-weight="900" letter-spacing="-1">
      ⚡ 10+ CLIPS PROCESSED IN UNDER 60 SECONDS
    </text>
    <rect x="-480" y="10" width="960" height="48" rx="24" fill="#facc15" />
    <text y="43" fill="#000000" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="1">
      🎬 1-Click Batch Download with Zero Watermarks &amp; Full 1080p Resolution 🎬
    </text>
  </g>
</svg>`;

// Scene 5: ViralClip AI Outro Brand Card - 100% Highlighted, Crisp Official Logo
const scene5Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="outroBg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#DB2777" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#outroBg)" />
  <circle cx="960" cy="500" r="400" fill="#6366f1" opacity="0.22" filter="blur(70px)" />

  <!-- Center Grand Highlight Card -->
  <g transform="translate(960, 500)">
    <!-- Main Card Body with Glowing Purple/Cyan Border -->
    <rect x="-560" y="-360" width="1120" height="720" rx="40" fill="#020617" stroke="#6366f1" stroke-width="5" filter="drop-shadow(0 30px 60px rgba(0,0,0,0.95))" />
    
    <!-- Top Highlight Badge Pill -->
    <rect x="-240" y="-395" width="480" height="64" rx="32" fill="#facc15" stroke="#ffffff" stroke-width="2.5" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.8))" />
    <text x="0" y="-353" fill="#000000" font-family="sans-serif" font-size="26" font-weight="900" letter-spacing="1" text-anchor="middle">
      ⚡ OFFICIAL AI VIDEO REPURPOSER
    </text>

    <!-- Clean Brand Logo Squircle (100% Crisp, ZERO Gemini Sparkles) -->
    <rect x="-80" y="-280" width="160" height="160" rx="42" fill="url(#logoGrad)" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 15px 30px rgba(99,102,241,0.6))" />
    <!-- Crisp Centered White Play Symbol -->
    <path d="M-22 -225 L34 -200 L-22 -175 Z" fill="#ffffff" />

    <!-- Big Bold Brand Name -->
    <text x="0" y="-50" fill="#ffffff" font-family="sans-serif" font-size="82" font-weight="900" letter-spacing="-1" text-anchor="middle">
      ViralClip AI
    </text>

    <!-- Vivid Yellow Highlighter Banner for Core Tagline -->
    <rect x="-440" y="-10" width="880" height="72" rx="36" fill="#facc15" filter="drop-shadow(0 10px 20px rgba(250,204,21,0.3))" />
    <text x="0" y="38" fill="#000000" font-family="sans-serif" font-size="34" font-weight="900" letter-spacing="1" text-anchor="middle">
      🔥 LONG VIDEOS → VIRAL SHORT CLIPS 🔥
    </text>

    <!-- 3 Highlighted Feature Pills -->
    <g transform="translate(0, 150)">
      <rect x="-480" y="-28" width="300" height="56" rx="28" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" />
      <text x="-330" y="8" fill="#38bdf8" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">⚡ AI Auto-Detect</text>

      <rect x="-150" y="-28" width="300" height="56" rx="28" fill="#1e293b" stroke="#22c55e" stroke-width="2.5" />
      <text x="0" y="8" fill="#22c55e" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">🛡️ Zero Watermark</text>

      <rect x="180" y="-28" width="300" height="56" rx="28" fill="#1e293b" stroke="#ec4899" stroke-width="2.5" />
      <text x="330" y="8" fill="#ec4899" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">🎬 Hormozi Captions</text>
    </g>

    <!-- Bottom Action Highlight Banner -->
    <rect x="-480" y="225" width="960" height="64" rx="20" fill="#1e1b4b" stroke="#a855f7" stroke-width="2" />
    <text x="0" y="267" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="1" text-anchor="middle">
      🚀 TRY FREE NOW • 100% AUTOMATIC • 1080P HD EXPORT 🚀
    </text>
  </g>
</svg>`;

fs.writeFileSync('/tmp/s1.svg', scene1Svg);
fs.writeFileSync('/tmp/s2.svg', scene2Svg);
fs.writeFileSync('/tmp/s3.svg', scene3Svg);
fs.writeFileSync('/tmp/s4.svg', scene4Svg);
fs.writeFileSync('/tmp/s5.svg', scene5Svg);

console.log('Rendering 5 scenes to PNG...');
execSync('ffmpeg -i /tmp/s1.svg -vframes 1 -s 1920x1080 /tmp/s1.png -y');
execSync('ffmpeg -i /tmp/s2.svg -vframes 1 -s 1920x1080 /tmp/s2.png -y');
execSync('ffmpeg -i /tmp/s3.svg -vframes 1 -s 1920x1080 /tmp/s3.png -y');
execSync('ffmpeg -i /tmp/s4.svg -vframes 1 -s 1920x1080 /tmp/s4.png -y');
execSync('ffmpeg -i /tmp/s5.svg -vframes 1 -s 1920x1080 /tmp/s5.png -y');

console.log('Rendering clips for each scene...');
execSync('ffmpeg -loop 1 -framerate 30 -t 2.2 -i /tmp/s1.png -c:v libx264 -pix_fmt yuv420p /tmp/c1.mp4 -y');
execSync('ffmpeg -loop 1 -framerate 30 -t 2.2 -i /tmp/s2.png -c:v libx264 -pix_fmt yuv420p /tmp/c2.mp4 -y');
execSync('ffmpeg -loop 1 -framerate 30 -t 2.2 -i /tmp/s3.png -c:v libx264 -pix_fmt yuv420p /tmp/c3.mp4 -y');
execSync('ffmpeg -loop 1 -framerate 30 -t 1.8 -i /tmp/s4.png -c:v libx264 -pix_fmt yuv420p /tmp/c4.mp4 -y');
execSync('ffmpeg -loop 1 -framerate 30 -t 1.6 -i /tmp/s5.png -c:v libx264 -pix_fmt yuv420p /tmp/c5.mp4 -y');

const concatList = `file '/tmp/c1.mp4'
file '/tmp/c2.mp4'
file '/tmp/c3.mp4'
file '/tmp/c4.mp4'
file '/tmp/c5.mp4'
`;
fs.writeFileSync('/tmp/list.txt', concatList);

console.log('Generating audio and concatenating...');
execSync('ffmpeg -y -f lavfi -i "sine=frequency=330:duration=10" -af "volume=0.2" -c:a aac /tmp/audio.aac');
execSync('ffmpeg -y -f concat -safe 0 -i /tmp/list.txt -i /tmp/audio.aac -c:v libx264 -pix_fmt yuv420p -c:a copy -shortest public/official-demo.mp4');

// Synchronize all demo video names and distributions
const filesToSync = [
  'public/demo-sample.mp4',
  'public/broadcast-demo.mp4',
  'public/demo-30s.mp4',
  'public/viralclip-demo.mp4',
  'public/gemini_generated_video_af295f55.mp4',
  'dist/official-demo.mp4',
  'dist/demo-sample.mp4',
  'dist/broadcast-demo.mp4',
  'dist/demo-30s.mp4',
  'dist/viralclip-demo.mp4',
  'dist/gemini_generated_video_af295f55.mp4'
];

execSync('mkdir -p dist');
for (const dest of filesToSync) {
  execSync(`cp public/official-demo.mp4 "${dest}"`);
}

console.log('Official Highlighted Demo Video generated and synchronized everywhere!');
