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

export default function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'clips' | 'editor' | 'export'>('upload');
  
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

  // Setup beforeunload to prevent accidental closing while rendering
  useEffect(() => {
    const hasActiveJobs = renderJobs.some(job => job.status === 'processing' || job.status === 'pending');
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasActiveJobs) {
        e.preventDefault();
        e.returnValue = 'Export is in progress. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [renderJobs]);

  // Setup history API for mobile back button support
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Set initial state
    window.history.replaceState({ tab: 'upload' }, '');
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: typeof activeTab) => {
    if (activeTab !== tab) {
      window.history.pushState({ tab }, '');
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
    if (file) {
      videoUrl = URL.createObjectURL(file);
    }
    
    setVideoState({ url: videoUrl, file, status: 'uploading', clips: [] });
    
    try {
      if (file || url) {
        setVideoState(prev => ({ ...prev, status: 'analyzing' }));
        
        // Fast client-side metadata extraction instead of uploading to server
        const video = document.createElement('video');
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
          // Go straight to editor as user requested
          handleTabChange('editor');
        };

        video.onerror = () => {
          throw new Error("Failed to load video. Ensure the file is a valid MP4/MOV.");
        };
      }
    } catch (error) {
      console.error(error);
      alert('Error analyzing video: ' + (error as Error).message);
      setVideoState(prev => ({ ...prev, status: 'idle' }));
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
      progress: 0
    };

    setRenderJobs(prev => [...prev, newJob]);

    try {
      // Mark as processing before starting
      setRenderJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: 'processing' } : job
      ));

      const blobUrl = await renderVideoClip(
        clip,
        videoState.url,
        editorSettings,
        (progress) => {
          setRenderJobs(prev => prev.map(job => 
            job.id === newJob.id ? { ...job, progress: Math.min(99, progress) } : job
          ));
        }
      );

      setRenderJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, progress: 100, status: 'ready', blobUrl } : job
      ));
    } catch (error) {
      console.error(error);
      setRenderJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: 'failed' } : job
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
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'upload' && (
          <VideoUploader onAnalyze={handleAnalyze} status={videoState.status} />
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
            />
          </div>
        )}
        
        {activeTab === 'export' && (
          <ExportQueue jobs={renderJobs} />
        )}
      </main>
    </div>
  );
}

