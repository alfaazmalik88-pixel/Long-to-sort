import fs from 'fs';
import { execSync } from 'child_process';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <!-- Deep Studio Ambient Gradient -->
    <radialGradient id="studioBg" cx="50%" cy="45%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="40%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>

    <!-- Neon Rim Lights -->
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="neonPurple" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
    </linearGradient>

    <!-- Studio Desk Gradient -->
    <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="40%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- Metallic Mic Gradient -->
    <linearGradient id="micMetal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#studioBg)" />

  <!-- Acoustic Panel Grid Background -->
  <g opacity="0.15">
    <pattern id="acousticGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="56" height="56" rx="8" fill="#334155" />
    </pattern>
    <rect width="1920" height="700" fill="url(#acousticGrid)" />
  </g>

  <!-- Backlight Pillars -->
  <rect x="250" y="80" width="12" height="600" rx="6" fill="#06b6d4" opacity="0.6" filter="blur(10px)" />
  <rect x="1650" y="80" width="12" height="600" rx="6" fill="#ec4899" opacity="0.6" filter="blur(10px)" />

  <!-- Center Hex Studio Light -->
  <circle cx="960" cy="380" r="280" fill="#6366f1" opacity="0.08" filter="blur(40px)" />

  <!-- "ON AIR" Studio Sign -->
  <g transform="translate(860, 60)">
    <rect width="200" height="54" rx="12" fill="#450a0a" stroke="#ef4444" stroke-width="2" />
    <circle cx="35" cy="27" r="7" fill="#ef4444" />
    <text x="55" y="35" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="4">ON AIR</text>
  </g>

  <!-- Broadcast Camera HUD Info (Top Left & Top Right) -->
  <text x="60" y="80" fill="#94a3b8" font-family="monospace" font-size="18" font-weight="bold">REC ● 4K 60FPS • PRO AUDIO</text>
  <text x="60" y="110" fill="#64748b" font-family="monospace" font-size="15">CH 1: -6.2 dB  |  CH 2: -5.8 dB</text>

  <text x="1680" y="80" fill="#ef4444" font-family="monospace" font-size="20" font-weight="bold">LIVE STREAM</text>
  <text x="1680" y="110" fill="#94a3b8" font-family="monospace" font-size="15">STUDIO MASTER A</text>

  <!-- Podcast Host 1 (Left Silhouette) -->
  <g opacity="0.45" transform="translate(380, 420)">
    <!-- Head & Shoulders -->
    <ellipse cx="140" cy="110" rx="60" ry="70" fill="#1e293b" />
    <path d="M40 260 C40 180, 100 170, 140 170 C180 170, 240 180, 240 260 Z" fill="#1e293b" />
    <!-- Headphones -->
    <path d="M75 90 C70 50, 210 50, 205 90" stroke="#64748b" stroke-width="8" fill="none" stroke-linecap="round" />
    <rect x="70" y="80" width="18" height="40" rx="9" fill="#06b6d4" />
    <rect x="192" y="80" width="18" height="40" rx="9" fill="#06b6d4" />
  </g>

  <!-- Podcast Host 2 (Right Silhouette) -->
  <g opacity="0.45" transform="translate(1260, 420)">
    <!-- Head & Shoulders -->
    <ellipse cx="140" cy="110" rx="60" ry="70" fill="#1e293b" />
    <path d="M40 260 C40 180, 100 170, 140 170 C180 170, 240 180, 240 260 Z" fill="#1e293b" />
    <!-- Headphones -->
    <path d="M75 90 C70 50, 210 50, 205 90" stroke="#64748b" stroke-width="8" fill="none" stroke-linecap="round" />
    <rect x="70" y="80" width="18" height="40" rx="9" fill="#ec4899" />
    <rect x="192" y="80" width="18" height="40" rx="9" fill="#ec4899" />
  </g>

  <!-- Modern Podcast Desk Arc -->
  <path d="M0 680 Q960 620 1920 680 L1920 1080 L0 1080 Z" fill="url(#deskGrad)" stroke="#334155" stroke-width="2" />
  <ellipse cx="960" cy="650" rx="700" ry="15" fill="#38bdf8" opacity="0.15" filter="blur(8px)" />

  <!-- Studio Microphone 1 (Left - Shure SM7B Style with Boom Arm) -->
  <g transform="translate(680, 520)">
    <!-- Boom Arm -->
    <line x1="-120" y1="260" x2="-20" y2="120" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
    <line x1="-20" y1="120" x2="60" y2="40" stroke="#1e293b" stroke-width="10" stroke-linecap="round" />
    <circle cx="-20" cy="120" r="14" fill="#334155" />
    <circle cx="60" cy="40" r="12" fill="#334155" />
    <!-- Shockmount Yoke -->
    <path d="M40 40 L60 60 L80 40" stroke="#64748b" stroke-width="6" fill="none" />
    <!-- Mic Body -->
    <rect x="45" y="-30" width="30" height="75" rx="10" fill="url(#micMetal)" />
    <!-- Foam Windscreen -->
    <rect x="42" y="-95" width="36" height="70" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2" />
    <line x1="44" y1="-65" x2="76" y2="-65" stroke="#475569" stroke-width="2" />
    <line x1="44" y1="-45" x2="76" y2="-45" stroke="#475569" stroke-width="2" />
    <!-- XLR Gold Ring -->
    <rect x="52" y="45" width="16" height="6" fill="#eab308" />
  </g>

  <!-- Studio Microphone 2 (Right - Shure SM7B Style with Boom Arm) -->
  <g transform="translate(1160, 520) scale(-1, 1)">
    <!-- Boom Arm -->
    <line x1="-120" y1="260" x2="-20" y2="120" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
    <line x1="-20" y1="120" x2="60" y2="40" stroke="#1e293b" stroke-width="10" stroke-linecap="round" />
    <circle cx="-20" cy="120" r="14" fill="#334155" />
    <circle cx="60" cy="40" r="12" fill="#334155" />
    <!-- Shockmount Yoke -->
    <path d="M40 40 L60 60 L80 40" stroke="#64748b" stroke-width="6" fill="none" />
    <!-- Mic Body -->
    <rect x="45" y="-30" width="30" height="75" rx="10" fill="url(#micMetal)" />
    <!-- Foam Windscreen -->
    <rect x="42" y="-95" width="36" height="70" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2" />
    <line x1="44" y1="-65" x2="76" y2="-65" stroke="#475569" stroke-width="2" />
    <line x1="44" y1="-45" x2="76" y2="-45" stroke="#475569" stroke-width="2" />
    <!-- XLR Gold Ring -->
    <rect x="52" y="45" width="16" height="6" fill="#eab308" />
  </g>

  <!-- Studio Audio Interface / Console on Desk -->
  <g transform="translate(860, 710)">
    <rect width="200" height="110" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2" />
    <!-- Knobs -->
    <circle cx="45" cy="40" r="16" fill="#334155" stroke="#6366f1" stroke-width="3" />
    <circle cx="95" cy="40" r="16" fill="#334155" stroke="#06b6d4" stroke-width="3" />
    <circle cx="145" cy="40" r="16" fill="#334155" stroke="#ec4899" stroke-width="3" />
    <!-- VU Meter bar -->
    <rect x="30" y="75" width="140" height="14" rx="4" fill="#020617" />
    <rect x="34" y="78" width="95" height="8" rx="2" fill="#22c55e" />
    <rect x="130" y="78" width="18" height="8" rx="2" fill="#eab308" />
  </g>
</svg>`;

fs.writeFileSync('/tmp/studio.svg', svg);

console.log('Rendering SVG to 1080p frame...');
execSync('ffmpeg -i /tmp/studio.svg -vframes 1 -s 1920x1080 /tmp/studio_frame.png -y');

console.log('Generating 12-second broadcast video with audio waveform and sound...');
// We generate an ambient podcast audio background (voice/synth harmonics) with dynamic waveform overlay
const ffmpegCmd = `ffmpeg -loop 1 -framerate 30 -i /tmp/studio_frame.png \
  -f lavfi -i "sine=frequency=220:duration=12[s1];sine=frequency=440:duration=12[s2];anoisesrc=d=12:c=pink:a=0.015[n];[s1][s2]amix=inputs=2[tone];[tone][n]amix=inputs=2,volume=0.3[aout]" \
  -filter_complex "[1:a]showwaves=s=1200x120:mode=line:colors=0x6366F1|0x06B6D4:scale=cbrt[wave];[0:v][wave]overlay=(W-w)/2:H-160:shortest=1[vout]" \
  -map "[vout]" -map "[aout]" -c:v libx264 -pix_fmt yuv420p -t 12 -c:a aac -b:a 128k public/broadcast-demo.mp4 -y`;

execSync(ffmpegCmd);
console.log('Broadcast video created successfully at public/broadcast-demo.mp4');
