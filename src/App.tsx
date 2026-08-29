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

        const CHUNK_SIZE = 512 * 1024; // 512KB chunks for smooth progress and stable speed
        const totalChunks = Math.ceil(blobToUpload.size / CHUNK_SIZE);
        let uploadedChunks = 0;
        const uploadStartTime = Date.now();
        let uploadedBytes = 0;

        const uploadChunk = async (i: number, retries = 20): Promise<void> => {
    
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, blobToUpload.size);
          const chunk = blobToUpload.slice(start, end);
          
          
    console.log(`Preparing chunk ${i} (size: ${chunk.size})`);
    const formData = new FormData();
          formData.append('chunk', chunk, 'chunk.mp4');
          formData.append('jobId', videoId!); // using videoId as jobId here for the upload-chunk endpoint
          formData.append('chunkIndex', i.toString());
          formData.append('totalChunks', totalChunks.toString());

          try {
    console.log(`Sending fetch for chunk ${i}...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout to allow slow connections to finish
    const res = await fetch('/api/upload-chunk', { method: 'POST', body: formData, signal: controller.signal });
    clearTimeout(timeoutId);
    console.log(`Fetch returned for chunk ${i} with status ${res.status}`);
            if (!res.ok) throw new Error(`Status ${res.status}: ` + await res.text());
            
            uploadedChunks++;
            uploadedBytes += chunk.size;
            const timeElapsed = (Date.now() - uploadStartTime) / 1000; // in seconds
            let uploadSpeed = 0;
            if (timeElapsed > 0) {
               // Calculate speed in Megabits per second (Mbps) as user requested
               // (uploadedBytes * 8) / 1,000,000 / timeElapsed
               uploadSpeed = (uploadedBytes * 8) / 1000000 / timeElapsed;
            }
            setVideoState(prev => ({ 
              ...prev, 
              uploadProgress: Math.min(99, (uploadedChunks / totalChunks) * 100),
              uploadSpeed 
            }));
          } catch (err) {
    console.error(`Error uploading chunk ${i}:`, err);
    if (retries > 0) {
              console.log(`Retrying chunk ${i}... (${retries} left)`);
              const waitTime = Math.min(15000, 2000 * Math.pow(1.5, 20 - retries)); // Exponential backoff for bad networks
              await new Promise(r => setTimeout(r, waitTime));
              return uploadChunk(i, retries - 1);
            }
            throw err;
          }
        };

        const concurrency = 2; // Reduced to 2 to prevent bandwidth splitting on slow connections
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

