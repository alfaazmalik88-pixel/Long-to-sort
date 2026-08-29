const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `    if (file) {
      videoUrl = URL.createObjectURL(file);
    } else if (url) {
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com') || url.includes('tiktok.com')) {
        videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
        alert("Note: YouTube/Social links are loaded with a demo video due to platform restrictions. For real processing, please download and upload the MP4 directly.");
      } else if (!url.startsWith('blob:') && !url.startsWith('data:')) {
        videoUrl = \`https://corsproxy.io/?url=\${encodeURIComponent(url)}\`;
      }
    }`;

const replace1 = `    if (file) {
      videoUrl = URL.createObjectURL(file);
    }`;

code = code.replace(target1, replace1);

const target2 = `        let blobToUpload;
        if (file) {
          if (file.size > 1000 * 1024 * 1024) {
            throw new Error("File is too large. Please select a video smaller than 1GB.");
          }
          blobToUpload = file;
        } else {
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
              
              // Clean up the temporary video to free up mobile hardware decoders
              video.removeAttribute('src');
              video.load();
              
              // Go straight to editor as user requested
              handleTabChange('editor');
              resolve(true);
            };
            
            video.onerror = () => {
              video.removeAttribute('src');
              video.load();
              reject(new Error("Failed to load video. Ensure the file is a valid direct MP4 link."));
            };
          });
          return; // Skip the rest of the file upload logic
        }`;

const replace2 = `        let blobToUpload;
        if (file) {
          if (file.size > 1000 * 1024 * 1024) {
            throw new Error("File is too large. Please select a video smaller than 1GB.");
          }
          blobToUpload = file;
        } else if (url) {
          // It's a URL! Request the server to download it via yt-dlp
          setVideoState(prev => ({ ...prev, uploadProgress: 10, status: 'uploading' }));
          
          const res = await fetch('/api/download-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });
          
          if (!res.ok) {
             throw new Error("Failed to download video from URL. It might be restricted or unsupported.");
          }
          const data = await res.json();
          videoId = data.videoId;
          
          setVideoState(prev => ({ ...prev, uploadProgress: 100, videoId, status: 'analyzing' }));
          
          // Generate a local blob URL for playback from our server
          videoUrl = \`/api/video/\${videoId}\`; 
          
          await new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.crossOrigin = "anonymous";
            video.src = videoUrl;
            
            video.onloadedmetadata = () => {
              const duration = video.duration;
              setVideoTotalDuration(duration);
              
              const newClips = generateClips(duration, globalClipDuration);
              
              setVideoState(prev => ({
                ...prev,
                url: videoUrl,
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
              reject(new Error("Failed to load video metadata from downloaded file."));
            };
          });
          return;
        }`;

code = code.replace(target2, replace2);
fs.writeFileSync('src/App.tsx', code);
