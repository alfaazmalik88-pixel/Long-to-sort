import fs from 'fs';
import { execSync } from 'child_process';

console.log('Generating official ViralClip AI demo scenes...');

// Scene 1: Desktop Workspace with "Long Video? Make It Short!"
const scene1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="deskBg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="monitorGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#deskBg)" />

  <!-- Studio Desk Lamp Glow -->
  <circle cx="150" cy="300" r="240" fill="#f59e0b" opacity="0.12" filter="blur(60px)" />
  <circle cx="1770" cy="350" r="240" fill="#6366f1" opacity="0.15" filter="blur(60px)" />

  <!-- Desktop Monitor Frame -->
  <g transform="translate(360, 100)">
    <!-- Stand -->
    <rect x="560" y="660" width="80" height="140" fill="#334155" rx="8" />
    <ellipse cx="600" cy="800" rx="140" ry="16" fill="#1e293b" stroke="#475569" stroke-width="2" />
    
    <!-- Monitor Outer Bezel -->
    <rect width="1200" height="680" rx="20" fill="#090d16" stroke="#475569" stroke-width="4" />
    <!-- Screen Display -->
    <rect x="16" y="16" width="1168" height="648" rx="8" fill="#0f172a" />

    <!-- Video Player Interface inside monitor -->
    <rect x="40" y="40" width="1120" height="52" rx="8" fill="#1e293b" />
    <circle cx="70" cy="66" r="8" fill="#ef4444" />
    <circle cx="95" cy="66" r="8" fill="#eab308" />
    <circle cx="120" cy="66" r="8" fill="#22c55e" />
    <rect x="160" y="52" width="600" height="28" rx="6" fill="#0f172a" />
    <text x="180" y="71" fill="#94a3b8" font-family="Arial, sans-serif" font-size="14">https://youtube.com/watch?v=long-podcast-interview</text>

    <!-- Video Player Canvas -->
    <rect x="40" y="110" width="820" height="460" rx="12" fill="#000000" stroke="#334155" stroke-width="2" />
    
    <!-- Uploading Bar Simulation -->
    <rect x="180" y="280" width="540" height="100" rx="16" fill="#1e1b4b" stroke="#6366f1" stroke-width="2" />
    <circle cx="240" cy="330" r="28" fill="#6366f1" />
    <text x="230" y="338" fill="#ffffff" font-family="Arial, sans-serif" font-size="24">⬆️</text>
    <text x="290" y="325" fill="#ffffff" font-family="Arial, sans-serif" font-size="20" font-weight="bold">Long Video Uploaded (45:00)</text>
    <text x="290" y="352" fill="#818cf8" font-family="Arial, sans-serif" font-size="14">Auto-detecting viral high-energy moments...</text>

    <!-- Side Clips List -->
    <rect x="880" y="110" width="280" height="460" rx="12" fill="#1e293b" />
    <text x="900" y="145" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Viral Moments (10+)</text>
    <rect x="900" y="170" width="240" height="80" rx="8" fill="#0f172a" stroke="#6366f1" stroke-width="1.5" />
    <rect x="900" y="265" width="240" height="80" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <rect x="900" y="360" width="240" height="80" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
  </g>

  <!-- Animated Bottom Typography Overlay -->
  <g transform="translate(960, 860)" text-anchor="middle">
    <rect x="-540" y="-50" width="1080" height="150" rx="24" fill="#000000" fill-opacity="0.8" stroke="#334155" stroke-width="2" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.9))" />
    <text y="0" fill="#ffffff" font-family="Arial, sans-serif" font-size="52" font-weight="900" letter-spacing="-1">
      Long Video? Make It Short!
    </text>
    <text y="58" fill="#fde047" font-family="Arial, sans-serif" font-size="28" font-weight="bold">
      Convert a long video into short clips 🎥✂️
    </text>
  </g>
</svg>`;

// Scene 2: AI Neural Processor with creator thumbnails
const scene2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="chipBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#020617" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
    <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#chipBg)" />

  <!-- Circuit Board Traces -->
  <g stroke="url(#glowLine)" stroke-width="3" fill="none" opacity="0.6">
    <path d="M100 200 L400 200 L600 400 L800 400" />
    <path d="M100 880 L500 880 L700 680 L800 680" />
    <path d="M1820 200 L1520 200 L1320 400 L1120 400" />
    <path d="M1820 880 L1420 880 L1220 680 L1120 680" />
    <path d="M960 100 L960 350" />
    <path d="M960 980 L960 730" />
    <circle cx="600" cy="400" r="8" fill="#06b6d4" />
    <circle cx="1320" cy="400" r="8" fill="#ec4899" />
    <circle cx="700" cy="680" r="8" fill="#3b82f6" />
    <circle cx="1220" cy="680" r="8" fill="#a855f7" />
  </g>

  <!-- Central Glowing AI Chip -->
  <g transform="translate(960, 500)">
    <circle r="220" fill="#6366f1" opacity="0.15" filter="blur(40px)" />
    <!-- Chip Base -->
    <rect x="-140" y="-140" width="280" height="280" rx="24" fill="#0f172a" stroke="#6366f1" stroke-width="4" filter="drop-shadow(0 0 30px #4f46e5)" />
    <rect x="-110" y="-110" width="220" height="220" rx="16" fill="#1e1b4b" stroke="#06b6d4" stroke-width="2" />
    
    <!-- Microprocessor icon & text -->
    <text y="-20" fill="#38bdf8" font-family="Arial, sans-serif" font-size="54" text-anchor="middle">⚡</text>
    <text y="35" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="3">AI NEURAL</text>
    <text y="70" fill="#a5f3fc" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" letter-spacing="2">MOMENT DETECTOR</text>
  </g>

  <!-- Creator Video Thumbnails floating around chip -->
  <g transform="translate(360, 260)">
    <rect width="260" height="160" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <circle cx="60" cy="70" r="30" fill="#0284c7" />
    <rect x="110" y="55" width="120" height="12" rx="4" fill="#94a3b8" />
    <rect x="110" y="75" width="80" height="10" rx="4" fill="#64748b" />
    <rect x="20" y="120" width="80" height="22" rx="6" fill="#22c55e" />
    <text x="60" y="136" fill="#000" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SCORE 98%</text>
  </g>

  <g transform="translate(1300, 260)">
    <rect width="260" height="160" rx="14" fill="#1e293b" stroke="#ec4899" stroke-width="2" />
    <circle cx="60" cy="70" r="30" fill="#db2777" />
    <rect x="110" y="55" width="120" height="12" rx="4" fill="#94a3b8" />
    <rect x="110" y="75" width="80" height="10" rx="4" fill="#64748b" />
    <rect x="20" y="120" width="80" height="22" rx="6" fill="#22c55e" />
    <text x="60" y="136" fill="#000" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SCORE 95%</text>
  </g>

  <g transform="translate(360, 640)">
    <rect width="260" height="160" rx="14" fill="#1e293b" stroke="#a855f7" stroke-width="2" />
    <circle cx="60" cy="70" r="30" fill="#7e22ce" />
    <rect x="110" y="55" width="120" height="12" rx="4" fill="#94a3b8" />
    <rect x="110" y="75" width="80" height="10" rx="4" fill="#64748b" />
    <rect x="20" y="120" width="80" height="22" rx="6" fill="#22c55e" />
    <text x="60" y="136" fill="#000" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SCORE 99%</text>
  </g>

  <g transform="translate(1300, 640)">
    <rect width="260" height="160" rx="14" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
    <circle cx="60" cy="70" r="30" fill="#b45309" />
    <rect x="110" y="55" width="120" height="12" rx="4" fill="#94a3b8" />
    <rect x="110" y="75" width="80" height="10" rx="4" fill="#64748b" />
    <rect x="20" y="120" width="80" height="22" rx="6" fill="#22c55e" />
    <text x="60" y="136" fill="#000" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SCORE 97%</text>
  </g>

  <!-- Title & Subtitle Banner -->
  <g transform="translate(960, 890)" text-anchor="middle">
    <rect x="-560" y="-50" width="1120" height="145" rx="24" fill="#000000" fill-opacity="0.8" stroke="#334155" stroke-width="2" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.9))" />
    <text y="2" fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="900">
      AI Finds the Best Moments ⚡
    </text>
    <text y="56" fill="#fde047" font-family="Arial, sans-serif" font-size="28" font-weight="bold">
      AI automatically identifies moments ⚡
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

  <text x="960" y="120" fill="#ffffff" font-family="Arial, sans-serif" font-size="46" font-weight="900" text-anchor="middle">
    Shorts • Reels • Social Media
  </text>

  <!-- 4 iPhone Mockups -->
  <!-- Phone 1 -->
  <g transform="translate(240, 160)">
    <rect width="320" height="640" rx="36" fill="#000000" stroke="#334155" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))" />
    <rect x="12" y="12" width="296" height="616" rx="28" fill="#1e293b" />
    <!-- Dynamic Island -->
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <!-- Caption inside reel -->
    <rect x="25" y="460" width="270" height="60" rx="10" fill="#000000" fill-opacity="0.8" />
    <text x="160" y="495" fill="#fde047" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">SECRET TO VIRAL HOOKS 🔥</text>
    <!-- Waveform -->
    <rect x="30" y="550" width="260" height="6" rx="3" fill="#6366f1" />
  </g>

  <!-- Phone 2 -->
  <g transform="translate(620, 160)">
    <rect width="320" height="640" rx="36" fill="#000000" stroke="#6366f1" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(99,102,241,0.3))" />
    <rect x="12" y="12" width="296" height="616" rx="28" fill="#0f172a" />
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <rect x="25" y="460" width="270" height="60" rx="10" fill="#000000" fill-opacity="0.8" />
    <text x="160" y="495" fill="#38bdf8" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">HORMOZI SUBTITLES 🎬</text>
    <rect x="30" y="550" width="260" height="6" rx="3" fill="#38bdf8" />
  </g>

  <!-- Phone 3 -->
  <g transform="translate(1000, 160)">
    <rect width="320" height="640" rx="36" fill="#000000" stroke="#334155" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))" />
    <rect x="12" y="12" width="296" height="616" rx="28" fill="#1e293b" />
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <rect x="25" y="460" width="270" height="60" rx="10" fill="#000000" fill-opacity="0.8" />
    <text x="160" y="495" fill="#22c55e" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">ZERO WATERMARK 🛡️</text>
    <rect x="30" y="550" width="260" height="6" rx="3" fill="#22c55e" />
  </g>

  <!-- Phone 4 -->
  <g transform="translate(1380, 160)">
    <rect width="320" height="640" rx="36" fill="#000000" stroke="#334155" stroke-width="4" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))" />
    <rect x="12" y="12" width="296" height="616" rx="28" fill="#0f172a" />
    <rect x="110" y="24" width="100" height="24" rx="12" fill="#000000" />
    <rect x="25" y="460" width="270" height="60" rx="10" fill="#000000" fill-opacity="0.8" />
    <text x="160" y="495" fill="#ec4899" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">PART 1 &amp; PART 2 SERIES</text>
    <rect x="30" y="550" width="260" height="6" rx="3" fill="#ec4899" />
  </g>

  <!-- Bottom CTA Text -->
  <g transform="translate(960, 890)" text-anchor="middle">
    <rect x="-500" y="-45" width="1000" height="140" rx="24" fill="#000000" fill-opacity="0.85" stroke="#334155" stroke-width="2" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.9))" />
    <text y="5" fill="#fde047" font-family="Arial, sans-serif" font-size="44" font-weight="900">
      Get ready short videos 🔥
    </text>
    <text y="54" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
      Ready for YouTube Shorts, Instagram Reels &amp; TikTok
    </text>
  </g>
</svg>`;

// Scene 4: ViralClip AI Web Application
const scene4Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="appBg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#appBg)" />

  <text x="960" y="110" fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="900" text-anchor="middle">
    Turn Long Videos Into Shorts 🚀
  </text>

  <!-- Modern SaaS Web App Card -->
  <g transform="translate(310, 160)">
    <rect width="1300" height="680" rx="24" fill="#090d16" stroke="#4f46e5" stroke-width="3" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.9))" />
    
    <!-- App Header Navbar -->
    <rect x="0" y="0" width="1300" height="65" rx="24" fill="#0f172a" />
    <circle cx="45" cy="32" r="14" fill="#6366f1" />
    <text x="70" y="40" fill="#ffffff" font-family="Arial, sans-serif" font-size="20" font-weight="bold">ViralClip AI</text>
    <rect x="1120" y="18" width="140" height="32" rx="8" fill="#4f46e5" />
    <text x="1190" y="39" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Dashboard</text>

    <!-- Upload Box in center -->
    <rect x="350" y="130" width="600" height="260" rx="20" fill="#1e1b4b" stroke="#6366f1" stroke-width="2" stroke-dasharray="8 6" />
    <circle cx="650" cy="220" r="40" fill="#6366f1" />
    <text x="635" y="232" fill="#ffffff" font-family="Arial, sans-serif" font-size="36">☁️</text>
    <text x="650" y="295" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">Upload Video</text>
    <text x="650" y="325" fill="#94a3b8" font-family="Arial, sans-serif" font-size="15" text-anchor="middle">Drop your podcast or long video here</text>

    <!-- Generated Shorts Row -->
    <rect x="80" y="430" width="350" height="190" rx="14" fill="#1e293b" />
    <text x="100" y="470" fill="#38bdf8" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Clip #1: The Best Hook (0:45)</text>
    <rect x="100" y="550" width="120" height="34" rx="8" fill="#22c55e" />
    <text x="160" y="572" fill="#000" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Download 1080p</text>

    <rect x="470" y="430" width="350" height="190" rx="14" fill="#1e293b" />
    <text x="490" y="470" fill="#fde047" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Clip #2: The Crazy Story (0:52)</text>
    <rect x="490" y="550" width="120" height="34" rx="8" fill="#22c55e" />
    <text x="550" y="572" fill="#000" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Download 1080p</text>

    <rect x="860" y="430" width="350" height="190" rx="14" fill="#1e293b" />
    <text x="880" y="470" fill="#ec4899" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Clip #3: The Final Lesson (0:38)</text>
    <rect x="880" y="550" width="120" height="34" rx="8" fill="#22c55e" />
    <text x="940" y="572" fill="#000" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Download 1080p</text>
  </g>

  <!-- Bottom Subtitle Banner -->
  <g transform="translate(960, 920)" text-anchor="middle">
    <rect x="-480" y="-40" width="960" height="110" rx="20" fill="#000000" fill-opacity="0.85" stroke="#334155" stroke-width="2" />
    <text y="28" fill="#fde047" font-family="Arial, sans-serif" font-size="34" font-weight="bold">
      Upload video and create shorts 🎬
    </text>
  </g>
</svg>`;

// Scene 5: ViralClip AI Outro Brand Card - 100% Clean Official Logo, Zero Gemini Sparkles
const scene5Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="outroBg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#DB2777" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#outroBg)" />

  <circle cx="960" cy="460" r="320" fill="#6366f1" opacity="0.18" filter="blur(60px)" />

  <!-- Clean Official Brand Logo & Icon (Crisp squircle + Play symbol, NO Gemini logo) -->
  <g transform="translate(960, 420)">
    <!-- Squircle Icon -->
    <rect x="-80" y="-180" width="160" height="160" rx="42" fill="url(#logoGrad)" filter="drop-shadow(0 15px 30px rgba(99,102,241,0.5))" />
    <!-- Crisp centered Play Symbol -->
    <path d="M-22 -135 L34 -100 L-22 -65 Z" fill="#ffffff" />

    <!-- Brand Name -->
    <text y="40" fill="#ffffff" font-family="Arial, sans-serif" font-size="76" font-weight="900" letter-spacing="-1" text-anchor="middle">
      ViralClip AI
    </text>
    <!-- Tagline -->
    <text y="105" fill="#94a3b8" font-family="Arial, sans-serif" font-size="32" font-weight="bold" letter-spacing="4" text-anchor="middle">
      LONG VIDEO → SHORT CLIPS
    </text>
  </g>

  <!-- Bottom CTA Badge -->
  <g transform="translate(960, 780)" text-anchor="middle">
    <rect x="-420" y="-35" width="840" height="90" rx="20" fill="#000000" fill-opacity="0.8" stroke="#6366f1" stroke-width="2" />
    <text y="24" fill="#fde047" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
      ViralClip AI: Long to Short 🚀
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

console.log('Concatenating clips and adding upbeat synth audio track...');
// Concatenate all scenes into a 10s video with upbeat audio
const finalCmd = `ffmpeg -f concat -safe 0 -i /tmp/list.txt \
  -f lavfi -i "sine=frequency=261.63:duration=10[n1];sine=frequency=329.63:duration=10[n2];sine=frequency=392.00:duration=10[n3];sine=frequency=523.25:duration=10[n4];[n1][n2][n3][n4]amix=inputs=4,volume=0.25[a]" \
  -map 0:v -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k public/official-demo.mp4 -y`;

execSync(finalCmd);

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

console.log('Official Clean Demo Video generated and synchronized everywhere!');
