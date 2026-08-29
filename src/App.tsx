import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { VideoUploader } from './components/VideoUploader';
import { ClipSelector } from './components/ClipSelector';
import { ShortsEditor } from './components/ShortsEditor';
import { SettingsPanel } from './components/SettingsPanel';
import { ExportQueue } from './components/ExportQueue';
import { VideoState, Clip, EditorSettings, RenderJob } from './types';

// Mock AI Data
const MOCK_CLIPS: Clip[] = [
  {
    id: 'c1',
    title: 'The Secret to Infinite Energy',
    viralityScore: 94,
    startTime: 124,
    endTime: 168,
    duration: 44,
    transcript: "If you want to have infinite energy throughout the day, you need to stop drinking coffee first thing in the morning. Here is what you should do instead to hack your cortisol."
  },
  {
    id: 'c2',
    title: 'Why You Are Failing at Productivity',
    viralityScore: 88,
    startTime: 345,
    endTime: 402,
    duration: 57,
    transcript: "People think productivity is about doing more things. It's actually about doing less. It's about aggressively eliminating everything that doesn't move the needle."
  },
  {
    id: 'c3',
    title: 'The 1% Rule of Wealth',
    viralityScore: 82,
    startTime: 890,
    endTime: 924,
    duration: 34,
    transcript: "The wealthy don't trade time for money. They build systems that trade capital for time. If you understand this one concept, your life will change in the next 12 months."
  }
];

import { renderVideoClip } from './lib/renderVideo';

import { PolicyView } from './components/PolicyView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'clips' | 'editor' | 'export'>('upload');
  const isPausedRef = React.useRef(false);
  const currentXhrRef = React.useRef<XMLHttpRequest | null>(null);
  const [policyView, setPolicyView] = useState<'privacy' | 'terms' | null>(null);

  
  const [videoState, setVideoState] = useState<VideoState>({
    url: null,
    file: null,
    status: 'idle',
    clips: []
  });

  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    aspectRatio: '9:16',
    subtitleStyle: 'hormozi',
    showProgressBar: true,
    showWaveform: true,
    showTitleSticker: false,
    customTitle: 'WAIT FOR IT'
  });

  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);

  // Setup beforeunload to prevent accidental closing while rendering or processing
  useEffect(() => {
    const hasActiveJobs = renderJobs.some(job => job.status === 'processing' || job.status === 'pending');
    const isProcessing = videoState.status !== 'idle' && videoState.status !== 'error';
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasActiveJobs || isProcessing) {
        e.preventDefault();
        e.returnValue = 'Progress is active. Are you sure you want to leave? You may lose your progress.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [renderJobs, videoState.status]);

  const handleTabChange = (tab: typeof activeTab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const [globalClipDuration, setGlobalClipDuration] = useState<number>(60);
  const [videoTotalDuration, setVideoTotalDuration] = useState<number>(0);

  const generateClips = (totalDuration: number, interval: number): Clip[] => {
    const newClips: Clip[] = [];
    for (let i = 0; i < totalDuration; i += interval) {
      const end = Math.min(i + interval, totalDuration);
      if (end - i > 1) { // Skip tiny trailing chunks
        newClips.push({
          id: `part-${newClips.length + 1}`,
          title: `Part ${newClips.length + 1}`,
          viralityScore: 100,
          startTime: i,
          endTime: end,
          duration: end - i,
          transcript: `Part ${newClips.length + 1}`
        });
      }
    }
    return newClips;
  };

  useEffect(() => {
    if (videoTotalDuration > 0 && videoState.url) {
      const newClips = generateClips(videoTotalDuration, globalClipDuration);
      setVideoState(prev => ({ ...prev, clips: newClips }));
      if (!newClips.find(c => c.id === selectedClipId)) {
        setSelectedClipId(newClips[0]?.id || null);
      }
    }
  }, [globalClipDuration, videoTotalDuration]);

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    if (isPausedRef.current && currentXhrRef.current) {
      currentXhrRef.current.abort();
    }
    setVideoState(prev => ({ ...prev, isPaused: isPausedRef.current }));
  };

  const handleAnalyze = async (url: string | null, file: File | null) => {
    let videoUrl = url;
    let videoId = undefined;
    
    if (file) {
      videoUrl = URL.createObjectURL(file);
    }
    
    setVideoState({ url: videoUrl, file, status: 'uploading', clips: [], uploadProgress: 1 });
    
    try {
      if (file || url) {
        // --- UPLOAD TO SERVER FIRST ---
        videoId = `video_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        let blobToUpload;
        if (file) {
          if (file.size > 1000 * 1024 * 1024) {
            throw new Error("File is too large. Please select a video smaller than 1GB.");
          }
          blobToUpload = file;
        } else {
          if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
             throw new Error("YouTube has recently blocked direct downloads from cloud servers to prevent bots. Please download the video to your device first, and use the 'Upload File' option here instead.");
          }
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
        }

        const CHUNK_SIZE = 256 * 1024; // 256KB for better scaling
        const totalChunks = Math.ceil(blobToUpload.size / CHUNK_SIZE);
        let uploadedChunks = 0;
        const uploadStartTime = Date.now();
        let uploadedBytes = 0;

        const uploadChunk = async (i: number, retries = 100): Promise<void> => {
          // Wait if paused before even starting the chunk
          while (isPausedRef.current) {
            await new Promise(r => setTimeout(r, 1000));
          }

          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, blobToUpload.size);
          const chunk = blobToUpload.slice(start, end);
          
          const formData = new FormData();
          formData.append('chunk', chunk, 'chunk.mp4');
          formData.append('jobId', videoId!); 
          formData.append('chunkIndex', i.toString());
          formData.append('totalChunks', totalChunks.toString());

          try {
            await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              currentXhrRef.current = xhr;
              xhr.open('POST', '/api/upload-chunk', true);
              
              let lastProgressTime = Date.now();
              let initialProgressBytes = uploadedBytes;
              
              const watchdog = setInterval(() => {
                // If 30 seconds pass without any progress bytes moving, kill it to trigger a retry
                if (Date.now() - lastProgressTime > 60000) {
                  clearInterval(watchdog);
                  xhr.abort();
                  reject(new Error("Upload stalled"));
                }
                if (isPausedRef.current) {
                  clearInterval(watchdog);
                  xhr.abort();
                  reject(new Error("Paused by user"));
                }
              }, 5000);

              xhr.upload.onprogress = (e) => {
                lastProgressTime = Date.now();
                if (e.lengthComputable && e.total > 0) {
                  const chunkProgress = e.loaded / e.total;
                  const currentProgress = ((uploadedChunks + chunkProgress) / totalChunks) * 100;
                  
                  // Compute dynamic speed
                  const timeElapsed = (Date.now() - uploadStartTime) / 1000;
                  let currentSpeed = 0;
                  if (timeElapsed > 0) {
                     currentSpeed = ((initialProgressBytes + e.loaded) * 8) / 1000000 / timeElapsed;
                  }

                  setVideoState(prev => ({
                    ...prev,
                    uploadProgress: Math.min(99, currentProgress),
                    uploadSpeed: currentSpeed
                  }));
                }
              };

              xhr.onload = () => {
                clearInterval(watchdog);
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(xhr.responseText);
                } else {
                  reject(new Error(`Status ${xhr.status}`));
                }
              };

              xhr.onerror = () => {
                clearInterval(watchdog);
                reject(new Error("Network error"));
              };

              xhr.onabort = () => {
                clearInterval(watchdog);
                reject(new Error("Aborted"));
              };

              xhr.send(formData);
            });
            
            uploadedChunks++;
            uploadedBytes += chunk.size;
            
          } catch (err) {
            console.error(`Chunk ${i} failed, retrying...`, err);
            setVideoState(prev => ({ ...prev, uploadSpeed: 0 }));
            
            // Wait while paused
            while (isPausedRef.current) {
               await new Promise(r => setTimeout(r, 1000));
            }
            
            if (retries > 0) {
              const waitTime = Math.min(5000, 1000 * Math.pow(1.2, 100 - retries));
              await new Promise(r => setTimeout(r, waitTime));
              return uploadChunk(i, retries - 1);
            }
            throw err;
          }
        };

        let currentConcurrency = 1;
        for (let i = 0; i < totalChunks; ) {
          while (isPausedRef.current) {
            await new Promise(r => setTimeout(r, 1000));
          }
          const tasks = [];
          for (let j = 0; j < currentConcurrency && i + j < totalChunks; j++) {
            tasks.push(uploadChunk(i + j));
          }
          
          const batchStart = Date.now();
          await Promise.all(tasks);
          const elapsed = Date.now() - batchStart;
          
          i += tasks.length;
          
          if (elapsed < 1000) {
             currentConcurrency = Math.min(6, currentConcurrency + 1);
          } else if (elapsed > 3000) {
             currentConcurrency = Math.max(1, currentConcurrency - 1);
          }
          
          if (elapsed > 2000 && currentConcurrency === 1) {
             await new Promise(r => setTimeout(r, 200)); 
          }
        }

        // Notify server that upload is complete to combine chunks
        let completeSuccess = false;
        for (let r = 0; r < 5; r++) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            const completeRes = await fetch('/api/upload-complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ videoId, totalChunks }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!completeRes.ok) throw new Error("Failed to finalize");
            completeSuccess = true;
            break;
          } catch (e) {
            console.warn("Retrying upload-complete...", e);
            setVideoState(prev => ({ ...prev, uploadSpeed: 0 }));
            await new Promise(res => setTimeout(res, 2000));
          }
        }
        if (!completeSuccess) throw new Error("Failed to finalize upload on server after retries");
        
        setVideoState(prev => ({ ...prev, uploadProgress: 100, videoId, status: 'analyzing' }));
        // --- END UPLOAD TO SERVER ---

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
      }
    } catch (error) {
      console.error(error);
      // alert('Error uploading/analyzing: ' + (error.message || String(error)));
      setVideoState(prev => ({ ...prev, status: 'error', errorMessage: error.message || "Failed due to slow internet connection or server error." }));
    }
  };

  const handleSelectClip = (id: string) => {
    setSelectedClipId(id);
    handleTabChange('editor');
  };

  const processRenderJob = async (clip: Clip) => {
    if (!videoState.url) return;

    const newJob: RenderJob = {
      id: Math.random().toString(36).substring(7),
      clipId: clip.id,
      title: `${clip.title} - Render`,
      status: 'pending',
      progress: 0,
      thumbnailUrl: clip.thumbnailUrl,
      startTime: clip.startTime,
      duration: clip.duration
    };

    setRenderJobs(prev => [...prev, newJob]);

    try {
      // Mark as processing before starting
      setRenderJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: 'processing' } : job
      ));

      const blobUrl = await renderVideoClip(
        clip,
        videoState.videoId || videoState.url || 'demo_video',
        editorSettings,
        (progress) => {
          setRenderJobs(prev => prev.map(job => 
            job.id === newJob.id ? { ...job, progress: Math.min(99, progress) } : job
          ));
        },
        newJob.id
      );

      setRenderJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, progress: 100, status: 'ready', blobUrl } : job
      ));
    } catch (error: any) {
      console.error(error);
      setRenderJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: 'failed', errorMessage: error.message || 'Unknown error occurred' } : job
      ));
    }
  };

  const handleExport = async () => {
    const selectedClip = videoState.clips.find(c => c.id === selectedClipId);
    if (!selectedClip || !videoState.url) return;
    
    handleTabChange('export');
    await processRenderJob(selectedClip);
  };

  const handleExportAll = async () => {
    if (!videoState.url || videoState.clips.length === 0) return;
    
    handleTabChange('export');
    
    // Process sequentially to save memory
    for (const clip of videoState.clips) {
      await processRenderJob(clip);
    }
  };

  const activeClip = videoState.clips.find(c => c.id === selectedClipId) || null;

  return (
    <div className="flex flex-col-reverse md:flex-row h-[100dvh] w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {policyView ? (
          <PolicyView type={policyView} onBack={() => setPolicyView(null)} />
        ) : (
          <>
            {activeTab === 'upload' && (
              <VideoUploader 
                onAnalyze={handleAnalyze} 
                status={videoState.status} 
                uploadProgress={videoState.uploadProgress}
                uploadSpeed={videoState.uploadSpeed}
                errorMessage={videoState.errorMessage}
                isPaused={videoState.isPaused}
                onTogglePause={togglePause}
                onCancel={() => setVideoState({ url: null, file: null, status: 'idle', clips: [] })}
                onOpenPolicy={setPolicyView}
              />
            )}
            
            {activeTab === 'clips' && (
              <ClipSelector 
                clips={videoState.clips} 
                selectedClipId={selectedClipId}
                onSelectClip={handleSelectClip}
                onRenderAll={handleExportAll}
              />
            )}
            
            {activeTab === 'editor' && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                <ShortsEditor clip={activeClip} settings={editorSettings} videoUrl={videoState.url} />
                <SettingsPanel 
                  settings={editorSettings} 
                  setSettings={setEditorSettings} 
                  onExport={handleExport}
                  clipDuration={globalClipDuration}
                  setClipDuration={setGlobalClipDuration}
                  clips={videoState.clips}
                  selectedClipId={selectedClipId}
                  onSelectClip={handleSelectClip}
                  onExportAll={handleExportAll}
                  renderJobs={renderJobs}
                />
              </div>
            )}
            
            {activeTab === 'export' && (
              <ExportQueue jobs={renderJobs} videoUrl={videoState.url} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

