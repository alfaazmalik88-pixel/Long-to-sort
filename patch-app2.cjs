const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newAnalyzeCode = `  const handleAnalyze = async (url: string | null, file: File | null) => {
    let videoUrl = url;
    let videoId = undefined;
    
    if (file) {
      videoUrl = URL.createObjectURL(file);
    } else if (url) {
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com') || url.includes('tiktok.com')) {
        videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
        alert("Note: YouTube/Social links are loaded with a demo video due to platform restrictions. For real processing, please download and upload the MP4 directly.");
      } else if (!url.startsWith('blob:') && !url.startsWith('data:')) {
        videoUrl = \`https://corsproxy.io/?url=\${encodeURIComponent(url)}\`;
      }
    }
    
    setVideoState({ url: videoUrl, file, status: 'uploading', clips: [], uploadProgress: 0 });
    
    try {
      if (file || url) {
        // --- UPLOAD TO SERVER FIRST ---
        videoId = \`video_\${Date.now()}_\${Math.random().toString(36).substring(7)}\`;
        
        let blobToUpload;
        if (file) {
          blobToUpload = file;
        } else {
          const response = await fetch(videoUrl!);
          blobToUpload = await response.blob();
        }

        const CHUNK_SIZE = 2 * 1024 * 1024;
        const totalChunks = Math.ceil(blobToUpload.size / CHUNK_SIZE);
        let uploadedChunks = 0;

        const uploadChunk = async (i: number) => {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, blobToUpload.size);
          const chunk = blobToUpload.slice(start, end);
          
          const formData = new FormData();
          formData.append('chunk', chunk, 'chunk.mp4');
          formData.append('jobId', videoId!); // using videoId as jobId here for the upload-chunk endpoint
          formData.append('chunkIndex', i.toString());
          formData.append('totalChunks', totalChunks.toString());

          const res = await fetch('/api/upload-chunk', { method: 'POST', body: formData });
          if (!res.ok) throw new Error(\`Failed to upload chunk \${i}\`);
          
          uploadedChunks++;
          setVideoState(prev => ({ ...prev, uploadProgress: Math.min(99, (uploadedChunks / totalChunks) * 100) }));
        };

        const concurrency = 2;
        for (let i = 0; i < totalChunks; i += concurrency) {
          const tasks = [];
          for (let j = 0; j < concurrency && i + j < totalChunks; j++) {
            tasks.push(uploadChunk(i + j));
          }
          await Promise.all(tasks);
        }

        // Notify server that upload is complete to combine chunks
        const completeRes = await fetch('/api/upload-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, totalChunks })
        });
        
        if (!completeRes.ok) throw new Error("Failed to finalize upload on server");
        
        setVideoState(prev => ({ ...prev, uploadProgress: 100, videoId, status: 'analyzing' }));
        // --- END UPLOAD TO SERVER ---

        await new Promise((resolve, reject) => {`;

code = code.replace(/  const handleAnalyze = async \([\s\S]*?await new Promise\(\(resolve, reject\) => \{/, newAnalyzeCode);

// update VideoUploader component usage in App.tsx
code = code.replace(
  /<VideoUploader[\s\S]*?onOpenPolicy=\{setPolicyView\}/,
  `<VideoUploader 
                onAnalyze={handleAnalyze} 
                status={videoState.status} 
                uploadProgress={videoState.uploadProgress}
                onOpenPolicy={setPolicyView}`
);

fs.writeFileSync('src/App.tsx', code);
