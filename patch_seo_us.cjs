const fs = require('fs');
let content = fs.readFileSync('src/components/SeoSection.tsx', 'utf8');

content = content.replace(
  'Convert Long Video to Shorts <ArrowRight className="w-4 h-4" />',
  'Try the Best Opus Clip Alternative <ArrowRight className="w-4 h-4" />'
);

content = content.replace(
  'Skip hours of manual editing. Our free long video to short video AI finds the best moments, creates 10+ engaging Shorts, and gets your content ready for TikTok, Instagram, and YouTube.',
  'Skip hours of manual editing and expensive subscriptions. As the best free Opus Clip alternative, our AI video editor finds the best moments from podcasts and videos, adds auto-subtitles, and exports vertical clips for TikTok, Instagram Reels, and YouTube Shorts without watermarks.'
);

content = content.replace(
  '<h3 className="text-xl font-bold text-emerald-400 mb-2">1. Paste a video link or upload your file</h3>',
  '<h3 className="text-xl font-bold text-emerald-400 mb-2">1. Paste a YouTube link or upload</h3>'
);

content = content.replace(
  'Is this a completely free youtube video to shorts ai converter?',
  'Is this a completely free Opus Clip alternative?'
);

content = content.replace(
  'Yes, ViralClip AI is a 100% free tool. Whether you need a <em>podcast to shorts ai free</em> tool or a general <em>long video to reels ai online converter</em>, you can do it all here without any hidden fees.',
  'Yes, ViralClip AI is a 100% free AI shorts maker. Whether you need an <em>auto subtitle generator free</em> tool or a full-stack <em>podcast to tiktok</em> converter, you get premium features with zero hidden fees.'
);

content = content.replace(
  'ViralClip AI is a free online tool designed to turn long videos into shorts, reels, and TikTok clips in seconds.',
  'ViralClip AI is a free online tool designed to repurpose long form videos into viral shorts, reels, and TikToks in seconds.'
);

fs.writeFileSync('src/components/SeoSection.tsx', content);
console.log("Updated SeoSection.tsx");
