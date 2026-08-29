const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        } else {
          // It's a URL! We don't need to upload anything.`;

const replacement = `        } else {
          if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
             throw new Error("YouTube has recently blocked direct downloads from cloud servers to prevent bots. Please download the video to your device first, and use the 'Upload File' option here instead.");
          }
          // It's a URL! We don't need to upload anything.`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched YouTube error message!");
