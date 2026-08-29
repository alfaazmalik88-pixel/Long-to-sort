const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the upload section
const uploadSection = `        let blobToUpload;
        if (file) {
          blobToUpload = file;
        } else {
          const response = await fetch(videoUrl!);
          blobToUpload = await response.blob();
        }`;

const newUploadSection = `        let blobToUpload;
        if (file) {
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
          return; // Skip the rest of the file upload logic
        }`;

code = code.replace(uploadSection, newUploadSection);
fs.writeFileSync('src/App.tsx', code);
