import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { VideoUploader } from './components/VideoUploader';
import { ClipSelector } from './components/ClipSelector';
import { ShortsEditor } from './components/ShortsEditor';
import { SettingsPanel } from './components/SettingsPanel';
import { ExportQueue } from './components/ExportQueue';
import { SeoSection } from './components/SeoSection';
import { VideoState, Clip, EditorSettings, RenderJob } from './types';
import { renderVideoClip } from './lib/renderVideo';
import { Routes, Route } from 'react-router-dom';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Contact } from './pages/Contact';

export default function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'clips' | 'editor' | 'export'>('upload');
  const [videoState, setVideoState] = useState<VideoState>({
    url: null,
    file: null,
    serverPath: null,
    status: 'idle',
    clips: []
  });
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    clipDuration: 60,
    format: 'shorts',
    captionStyle: 'hormozi',
    audioWaveform: true,
    titleSticker: true,
    exportQuality: '720p'
  });
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);

  const generateClips = (totalDuration: number, interval: number): Clip[] => {
    const newClips: Clip[] = [];
    for (let i = 0; i < totalDuration; i += interval) {
      const end = Math.min(i + interval, totalDuration);
      if (end - i > 1) {
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

  const handleAnalyze = (file: File | string, serverPath?: string) => {
    setVideoState(prev => ({ ...prev, status: 'analyzing' }));
    
    const videoUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const newClips = generateClips(duration, editorSettings.clipDuration);
      
      setVideoState({
        url: videoUrl,
        file: typeof file === 'string' ? null : file,
        serverPath: serverPath || null,
        status: 'ready',
        clips: newClips
      });
      setSelectedClipId(newClips[0]?.id || null);
      setActiveTab('editor');
    };
    
    video.onerror = () => {
      alert("Failed to load video");
      setVideoState(prev => ({ ...prev, status: 'error' }));
    };
  };

  useEffect(() => {
    if (videoState.url && videoState.clips.length > 0) {
      const video = document.createElement('video');
      video.src = videoState.url;
      video.onloadedmetadata = () => {
        const newClips = generateClips(video.duration, editorSettings.clipDuration);
        setVideoState(prev => ({ ...prev, clips: newClips }));
        if (!newClips.find(c => c.id === selectedClipId)) {
          setSelectedClipId(newClips[0]?.id || null);
        }
      };
    }
  }, [editorSettings.clipDuration]);

  const processRenderJob = async (clip: Clip) => {
    if (!videoState.url || !videoState.serverPath) {
      alert("Video not fully uploaded to server yet.");
      return;
    }
    
    const jobId = `job-${Date.now()}`;
    const newJob: RenderJob = {
      id: jobId,
      clipId: clip.id,
      title: clip.title,
      status: 'processing',
      progress: 0
    };
    
    setRenderJobs(prev => [...prev, newJob]);

    try {
      const url = await renderVideoClip(
        clip, 
        videoState.serverPath, 
        { ...editorSettings, showTitleSticker: editorSettings.titleSticker, customTitle: '' } as any, 
        (p) => setRenderJobs(prev => prev.map(j => j.id === jobId ? { ...j, progress: p } : j)),
        jobId
      );
      
      setRenderJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'ready', blobUrl: url } : j));
    } catch (e) {
      console.error(e);
      setRenderJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'error' } : j));
    }
  };

  const handleExport = async () => {
    const activeClip = videoState.clips.find(c => c.id === selectedClipId);
    if (!activeClip || !videoState.url) return;
    
    setActiveTab('export');
    await processRenderJob(activeClip);
  };

  const handleExportAll = async () => {
    if (!videoState.url || videoState.clips.length === 0) return;
    
    setActiveTab('export');
    for (const clip of videoState.clips) {
      await processRenderJob(clip);
    }
  };

  const activeClip = videoState.clips.find(c => c.id === selectedClipId) || null;

  return (
    <Routes>
      <Route path="/" element={
        
    <div className="flex flex-col h-[100dvh] w-full bg-black text-zinc-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-black">
          {activeTab === 'upload' && (
            <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pb-24 md:pb-0">
              <VideoUploader onAnalyze={handleAnalyze} status={videoState.status} />
              <SeoSection />
            </div>
          )}

          {activeTab === 'clips' && (
            <ClipSelector 
              clips={videoState.clips} 
              selectedClipId={selectedClipId} 
              onSelectClip={(id) => { setSelectedClipId(id); setActiveTab('editor'); }}
              onRenderAll={handleExportAll}
            />
          )}

          {activeTab === 'editor' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden pb-20 md:pb-0">
              <ShortsEditor clip={activeClip} settings={editorSettings as any} videoUrl={videoState.url} />
              <SettingsPanel 
                settings={editorSettings}
                setSettings={setEditorSettings}
                onExport={handleExport}
                clips={videoState.clips}
                selectedClipId={selectedClipId}
                onSelectClip={setSelectedClipId}
                onExportAll={handleExportAll}
              />
            </div>
          )}

          {activeTab === 'export' && (
            <ExportQueue jobs={renderJobs} videoUrl={videoState.url} />
          )}
        </main>
      </div>
    </div>
  
      } />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
