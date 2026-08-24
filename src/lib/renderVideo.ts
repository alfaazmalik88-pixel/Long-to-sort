import { Clip, EditorSettings } from "../types";

export const renderVideoClip = async (
  clip: Clip,
  videoUrl: string,
  settings: EditorSettings,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.preload = "auto"; // Prevent decode errors by loading properly
      if (!videoUrl.startsWith('blob:')) {
        video.crossOrigin = "anonymous";
      }
      video.muted = true; // Initially mute to allow autoplay
      video.playsInline = true;

      // Ensure video is in DOM if Safari needs it, but keep it stable to avoid pipeline errors
      video.style.position = "fixed";
      video.style.top = "0";
      video.style.left = "0";
      video.style.width = "10px";
      video.style.height = "10px";
      video.style.opacity = "0.01";
      video.style.pointerEvents = "none";
      video.style.zIndex = "-9999";
      document.body.appendChild(video);

      const canvas = document.createElement("canvas");
      // Set canvas size based on aspect ratio (1080p Full HD as requested)
      let width = 1080;
      let height = 1920; // 9:16
      if (settings.aspectRatio === "1:1") {
        width = 1080;
        height = 1080;
      } else if (settings.aspectRatio === "16:9") {
        width = 1920;
        height = 1080;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      video.onloadedmetadata = () => {
        console.log("renderVideo: metadata loaded, seeking to", clip.startTime);
        // Force a seek event by setting to a slightly different time if it's 0
        video.currentTime = clip.startTime === 0 ? 0.001 : clip.startTime;
      };

      video.onseeked = () => {
        console.log("renderVideo: seeked, starting recording");
        startRecording();
      };
      
      video.onerror = (e) => {
        const errorDetails = video.error ? `Code: ${video.error.code}, Message: ${video.error.message}` : 'Unknown';
        console.error("renderVideo: video error", errorDetails, e);
        // Do not reject immediately if it's just a warning, but MEDIA_ERR_SRC_NOT_SUPPORTED is fatal
        if (video.error && video.error.code === 4) {
          reject(new Error("Video format not supported or file too large."));
        } else {
          reject(new Error("Video load error: " + errorDetails));
        }
      };

      // Ensure video is in DOM if Safari needs it
      video.style.position = "fixed";
      video.style.top = "-9999px";
      video.style.opacity = "0";
      document.body.appendChild(video);

      const startRecording = () => {
        console.log("renderVideo: startRecording called");
        
        // Capture at 30 FPS for mobile stability (60fps causes Out Of Memory)
        const canvasStream = canvas.captureStream(30);
        let combinedStream = canvasStream;
        let audioCtx: AudioContext | null = null;
        let source: MediaElementAudioSourceNode | null = null;
        
        try {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          source = audioCtx.createMediaElementSource(video);
          const destination = audioCtx.createMediaStreamDestination();
          source.connect(destination);
          
          if (destination.stream.getAudioTracks().length > 0) {
            combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...destination.stream.getAudioTracks()]);
          }
        } catch (err) {
          console.warn("renderVideo: Could not capture audio using AudioContext", err);
        }

        let mimeType = "video/webm;codecs=vp9";
        if (typeof MediaRecorder !== 'undefined' && !MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "video/mp4";
          }
        }
        
        // Use 8 Mbps for Full HD video output
        const videoBitsPerSecond = 8000000;
        
        let recorder: MediaRecorder;
        try {
          recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond });
        } catch (e) {
          // Fallback if even mp4 is not supported or bit rate fails
          try {
            recorder = new MediaRecorder(combinedStream, { videoBitsPerSecond });
          } catch(e2) {
            recorder = new MediaRecorder(combinedStream);
          }
        }
        
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || "video/mp4" });
          const url = URL.createObjectURL(blob);
          resolve(url);
          video.pause();
          
          if (source) source.disconnect();
          if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
          
          video.removeAttribute('src'); // Free memory
          video.load();
          if (video.parentNode) {
            video.parentNode.removeChild(video);
          }
        };

        recorder.start(1000); // Flush chunks every 1 second to prevent massive C++ buffer build up on mobile
        
        // Try to play unmuted if possible, otherwise fallback to muted
        video.muted = false;
        video.play().catch(e => {
          console.warn("renderVideo: unmuted play error, falling back to muted", e);
          video.muted = true;
          video.play().catch(e2 => {
            console.error("renderVideo: fallback play error", e2);
            // Some browsers (iOS Safari) require user interaction to play
            // Try one more time with a small timeout
            setTimeout(() => {
              video.play().catch(e3 => reject(new Error("Browser blocked video playback. " + e3.message)));
            }, 100);
          });
        });

        const renderFrame = () => {
          if (video.paused && !video.ended) {
            requestAnimationFrame(renderFrame);
            return;
          }
          
          if (video.ended || video.currentTime >= clip.endTime) {
            recorder.stop();
            return;
          }

          // Draw video covering the canvas (cropping logic)
          const videoRatio = video.videoWidth / video.videoHeight;
          const canvasRatio = canvas.width / canvas.height;
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;

          if (videoRatio > canvasRatio) {
            // Video is wider, crop sides
            drawWidth = canvas.height * videoRatio;
            offsetX = (canvas.width - drawWidth) / 2;
          } else {
            // Video is taller, crop top/bottom
            drawHeight = canvas.width / videoRatio;
            offsetY = (canvas.height - drawHeight) / 2;
          }

          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

          // Add Overlays (Title, Subtitles, etc.)
          if (settings.showTitleSticker && settings.customTitle) {
            ctx.fillStyle = "#facc15"; // yellow-400
            ctx.fillRect(canvas.width / 2 - 250, 150, 500, 90);
            ctx.fillStyle = "black";
            ctx.font = "bold 45px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(settings.customTitle.toUpperCase(), canvas.width / 2, 195);
          }

          // Add simple subtitle
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(0, canvas.height - 350, canvas.width, 150);
          ctx.fillStyle = "white";
          ctx.font = "bold 60px Arial";
          ctx.textAlign = "center";
          ctx.fillText(clip.transcript.substring(0, 45) + "...", canvas.width / 2, canvas.height - 260);

          // Progress
          const progress = ((video.currentTime - clip.startTime) / clip.duration) * 100;
          onProgress(progress);
          
          if (settings.showProgressBar) {
            ctx.fillStyle = "#6366f1"; // indigo-500
            ctx.fillRect(0, canvas.height - 10, (canvas.width * progress) / 100, 10);
          }

          requestAnimationFrame(renderFrame);
        };

        requestAnimationFrame(renderFrame);
      };
    } catch (err) {
      reject(err);
    }
  });
};
