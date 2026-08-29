const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        } else {
          // It's a URL! We don't need to upload anything.
          // FFmpeg can stream it directly from the URL.
          setVideoState(prev => ({ ...prev, uploadProgress: 100, videoId: undefined, status: 'analyzing' }));
          
          await new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.crossOrigin = "anonymous";
            video.src = videoUrl!;
            
            video.onloadedmetadata = () => {
              const duration = video.duration;
              setVideoTotalDuration(duration);
              
              const newClips = generateClips(duration, globalClipDuration);
              
              setVideoState(prev => ({
                ...prev,
                status: 'ready',
                clips: newClips
              }));
              
              setSelectedClipId(newClips[0]?.id || null);
              
              video.removeAttribute('src');
              video.load();
              
              handleTabChange('editor');
              resolve(true);
            };
            video.onerror = () => {
              video.removeAttribute('src');
              video.load();
              reject(new Error("Failed to load video from URL. Ensure the link points directly to an MP4 video."));
            };
          });
        }`;

const replacement = `        } else {
          // It's a URL (like YouTube)! We need to ask the server to download it.
          setVideoState(prev => ({ ...prev, uploadProgress: 10, status: 'uploading' }));
          
          const res = await fetch('/api/download-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: videoUrl })
          });
          
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || \`Status \${res.status}: Failed to download video\`);
          }
          
          const data = await res.json();
          videoId = data.videoId;
          setVideoState(prev => ({ ...prev, uploadProgress: 100, videoId, status: 'analyzing' }));
          
          // Now fetch metadata from the downloaded video
          await new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.crossOrigin = "anonymous";
            video.src = \`/api/video/\${videoId}\`;
            
            video.onloadedmetadata = () => {
              const duration = video.duration;
              setVideoTotalDuration(duration);
              const newClips = generateClips(duration, globalClipDuration);
              setVideoState(prev => ({ ...prev, status: 'ready', clips: newClips }));
              setSelectedClipId(newClips[0]?.id || null);
              video.removeAttribute('src');
              video.load();
              handleTabChange('editor');
              resolve(true);
            };
            video.onerror = () => {
              video.removeAttribute('src');
              video.load();
              reject(new Error("Failed to load downloaded video metadata."));
            };
          });
        }`;

if (code.includes(`// It's a URL! We don't need to upload anything.`)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched URL downloading logic!");
} else {
  console.log("Could not find target in App.tsx!");
}
