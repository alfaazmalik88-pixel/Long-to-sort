const fs = require('fs');

let code = fs.readFileSync('src/lib/renderVideo.ts', 'utf8');
code = code.replace(
  /resolve\(job\.url\);/,
  `try {
              // Fetch the final video and convert to a blob URL to bypass auth proxy downloads
              const videoRes = await fetch(job.url);
              const videoBlob = await videoRes.blob();
              const finalBlobUrl = URL.createObjectURL(videoBlob);
              resolve(finalBlobUrl);
            } catch (err) {
              console.error("Failed to fetch final video blob:", err);
              resolve(job.url); // Fallback to raw URL
            }`
);
fs.writeFileSync('src/lib/renderVideo.ts', code);
