import { Clip, EditorSettings } from '../types';

export const renderVideoClip = async (
  clip: Clip,
  videoId: string,
  settings: EditorSettings,
  onProgress: (progress: number) => void,
  jobIdParam: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Starting backend render for clip: ${clip.title}`);
      
      const generatedJobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      onProgress(10); // Start rendering

      // Now trigger the actual render
      const renderFormData = new FormData();
      renderFormData.append('startTime', clip.startTime.toString());
      renderFormData.append('endTime', clip.endTime.toString());
      renderFormData.append('aspectRatio', settings.aspectRatio);
      
      if (settings.showTitleSticker && settings.customTitle) {
        renderFormData.append('customTitle', settings.customTitle);
      }
      
      renderFormData.append('subtitle', clip.transcript);
      renderFormData.append('jobId', generatedJobId);
      if (videoId.startsWith('http') || videoId.startsWith('blob:') || videoId.startsWith('data:')) {
        renderFormData.append('videoUrl', videoId);
      } else {
        renderFormData.append('videoId', videoId);
      } // use the videoId that was uploaded on the first page
      renderFormData.append('totalChunks', "0");

      const res = await fetch('/api/render', {
        method: 'POST',
        body: renderFormData
      });

      if (!res.ok) {
        throw new Error("Failed to start render job");
      }

      const response = await res.json();
      const actualJobId = response.jobId || generatedJobId;
      
      // Poll for render progress
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/render/status/${actualJobId}`);
          if (!statusRes.ok) throw new Error("Failed to fetch job status");
          
          const job = await statusRes.json();

          if (job.status === 'completed') {
            clearInterval(pollInterval);
            onProgress(100);
            try {
              const videoRes = await fetch(job.url);
              const videoBlob = await videoRes.blob();
              const finalBlobUrl = URL.createObjectURL(videoBlob);
              resolve(finalBlobUrl);
            } catch (err) {
              resolve(job.url);
            }
          } else if (job.status === 'failed') {
            clearInterval(pollInterval);
            reject(new Error(job.error || "Render job failed"));
          } else {
            // Map FFmpeg progress (0-100) to 10-99% range
            const renderProgress = job.progress || 0;
            onProgress(10 + Math.floor(renderProgress * 0.89));
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
