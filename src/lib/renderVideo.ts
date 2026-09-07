import { Clip, EditorSettings } from '../types';

export const renderVideoClip = async (
  clip: Clip,
  videoSource: string | File,
  settings: EditorSettings,
  onProgress: (progress: number) => void,
  jobIdParam: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting FAST SERVER-SIDE Render via FFmpeg...");
      
      let currentProgress = 5;
      onProgress(currentProgress); 
      
      const formData = new FormData();
      formData.append('startTime', clip.startTime.toString());
      formData.append('duration', clip.duration.toString());
      formData.append('title', clip.title);
      formData.append('titleSticker', settings.titleSticker ? 'true' : 'false');
      
      if (videoSource instanceof File) {
        formData.append('video', videoSource);
      } else {
        const response = await fetch(videoSource);
        if (!response.ok) throw new Error("Failed to read local video file.");
        const blob = await response.blob();
        formData.append('video', blob, 'video.mp4');
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/trim', true);
      xhr.responseType = 'blob'; 
      xhr.timeout = 180000; 

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const p = Math.floor((e.loaded / e.total) * 30); // upload is 30% visual progress
          const calculatedProgress = 5 + p; 
          
          if (calculatedProgress > currentProgress) { 
             currentProgress = calculatedProgress; 
             onProgress(currentProgress); 
           }
        }
      };

      // Visually faster simulation for the processing time
      let simInterval = setInterval(() => {
          if (currentProgress >= 35 && currentProgress < 99 && xhr.readyState < 4) { 
             const increment = currentProgress > 85 ? 0.2 : Math.random() * 1.5 + 0.5; 
             currentProgress += increment; 
             onProgress(currentProgress); 
         }
      }, 400);

      xhr.onload = () => {
        clearInterval(simInterval);
        
        if (xhr.status === 200) {
          onProgress(100);
          const finalUrl = URL.createObjectURL(xhr.response);
          resolve(finalUrl);
        } else {
          reject(new Error(`Server Error: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        clearInterval(simInterval);
        reject(new Error('Network error during upload/processing'));
      };
      
      xhr.ontimeout = () => {
        clearInterval(simInterval);
        reject(new Error('Server processing timed out.'));
      };

      xhr.send(formData);
    } catch (error) {
      console.error("renderVideoClip error:", error);
      reject(error);
    }
  });
};
