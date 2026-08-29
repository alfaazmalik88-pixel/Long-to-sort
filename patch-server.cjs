const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `      await youtubedl(url, {
        output: outputFilename,
        format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        mergeOutputFormat: 'mp4',
      });`;

const replacement = `      // Use yt-dlp with options to bypass YouTube blocking (multiple techniques)
      await youtubedl(url, {
        output: outputFilename,
        format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        mergeOutputFormat: 'mp4',
        noCheckCertificates: true,
        noWarnings: true,
        addHeader: [
          'referer:youtube.com',
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        ],
        // Bypass geographic restrictions
        geoBypass: true,
      });`;

if (code.includes('output: outputFilename,')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log("Patched server.ts!");
} else {
  console.log("Could not find target in server.ts!");
}
