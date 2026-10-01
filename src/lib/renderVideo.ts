import { Clip, EditorSettings } from '../types';

export const renderVideoClip = async (
  clip: Clip,
  serverVideoPath: string,
  settings: EditorSettings,
  onProgress: (progress: number) => void,
  jobIdParam: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting FAST SERVER-SIDE Render via FFmpeg using JSON payload...");
      
      let currentProgress = 6;
      onProgress(currentProgress); 

      const progressTimer = setInterval(() => {
        if (currentProgress < 95) {
          const step = Math.floor(Math.random() * 4) + 3;
          currentProgress = Math.min(95, currentProgress + step);
          onProgress(currentProgress);
        }
      }, 500);

      const payload = {
        videoPath: serverVideoPath,
        startTime: clip.startTime,
        duration: clip.duration,
        title: settings.customTitle?.trim() || clip.title,
        titleSticker: !!settings.titleSticker,
        enableCaptions: !!settings.enableCaptions,
        captionStyle: settings.captionStyle || 'hormozi',
        captionPosition: settings.captionPosition || 'bottom',
        videoFit: settings.videoFit || 'contain',
        subtitles: clip.subtitles || []
      };

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/trim', true);
      xhr.responseType = 'blob'; 
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 180000; 

      xhr.onload = () => {
        clearInterval(progressTimer);
        if (xhr.status === 200) {
          onProgress(100);
          const finalUrl = URL.createObjectURL(xhr.response);
          resolve(finalUrl);
        } else {
          // If blob is a JSON error, try to parse it (requires FileReader)
          if (xhr.response.type === 'application/json') {
             const reader = new FileReader();
             reader.onload = () => {
                 try {
                     const errData = JSON.parse(reader.result as string);
                     reject(new Error(errData.error || `Server Error: ${xhr.statusText}`));
                 } catch(e) {
                     reject(new Error(`Server Error: ${xhr.statusText}`));
                 }
             };
             reader.readAsText(xhr.response);
          } else {
             reject(new Error(`Server Error: ${xhr.statusText}`));
          }
        }
      };

      xhr.onerror = () => {
        clearInterval(progressTimer);
        reject(new Error('Network error during processing'));
      };
      
      xhr.ontimeout = () => {
        clearInterval(progressTimer);
        reject(new Error('Server processing timed out.'));
      };

      xhr.send(JSON.stringify(payload));
    } catch (error) {
      console.error("renderVideoClip error:", error);
      reject(error);
    }
  });
};
