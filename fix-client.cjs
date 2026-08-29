const fs = require('fs');

const code = `
import { Clip, EditorSettings } from '../types';

export const renderVideoClip = async (
  clip: Clip,
  videoUrl: string,
  file: File | null,
  settings: EditorSettings,
  onProgress: (progress: number) => void,
  jobIdParam: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(\`Starting backend render for clip: \${clip.title}\`);
      
      let blobToUpload: Blob;
      if (file) {
        blobToUpload = file;
      } else if (videoUrl.startsWith('blob:')) {
        const response = await fetch(videoUrl);
        blobToUpload = await response.blob();
      } else {
        throw new Error("No valid video file available to render.");
      }

      const generatedJobId = \`job_\${Date.now()}_\${Math.random().toString(36).substring(7)}\`;
      
      // Upload in chunks to avoid 413 Payload Too Large limits
      const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
      const totalChunks = Math.ceil(blobToUpload.size / CHUNK_SIZE);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, blobToUpload.size);
        const chunk = blobToUpload.slice(start, end);
        
        const formData = new FormData();
        formData.append('chunk', chunk, 'chunk.mp4');
        formData.append('jobId', generatedJobId);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());

        const res = await fetch('/api/upload-chunk', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(\`Failed to upload chunk \${i}\`);
        }

        // Map upload progress from 0 to 40%
        onProgress(Math.floor(((i + 1) / totalChunks) * 40));
      }

      // Now trigger the actual render
      const renderFormData = new FormData();
      renderFormData.append('startTime', clip.startTime.toString());
      renderFormData.append('endTime', clip.endTime.toString());
      renderFormData.append('aspectRatio', settings.aspectRatio);
      
      if (settings.showTitleSticker && settings.customTitle) {
        renderFormData.append('customTitle', settings.customTitle);
      }
      renderFormData.append('subtitle', clip.transcript.substring(0, 40) + '...');
      renderFormData.append('jobId', generatedJobId);
      renderFormData.append('totalChunks', totalChunks.toString());

      const res = await fetch('/api/render', {
        method: 'POST',
        body: renderFormData
      });

      if (!res.ok) {
        throw new Error("Failed to start render job");
      }

      const response = await res.json();
      const actualJobId = response.jobId || generatedJobId;
      
      // Upload complete. Now poll for render progress (40 to 99%)
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(\`/api/render/status/\${actualJobId}\`);
          if (!statusRes.ok) throw new Error("Failed to fetch job status");
          const job = await statusRes.json();

          if (job.status === 'completed') {
            clearInterval(pollInterval);
            onProgress(100);
            resolve(job.url);
          } else if (job.status === 'failed') {
            clearInterval(pollInterval);
            reject(new Error(job.error || "Render job failed"));
          } else {
            // Map FFmpeg progress (0-100) to 40-99% range
            const renderProgress = job.progress || 0;
            onProgress(40 + Math.floor(renderProgress * 0.59));
          }
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
        }
      }, 1000);

    } catch (error) {
      console.error("renderVideoClip error:", error);
      reject(error);
    }
  });
};
`;
fs.writeFileSync('src/lib/renderVideo.ts', code);
