import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { VideoUploader } from './components/VideoUploader';
import { ClipSelector } from './components/ClipSelector';
import { ShortsEditor } from './components/ShortsEditor';
import { SettingsPanel } from './components/SettingsPanel';
import { ExportQueue } from './components/ExportQueue';
import { SeoSection } from './components/SeoSection';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { VideoState, Clip, EditorSettings, RenderJob } from './types';
import { renderVideoClip } from './lib/renderVideo';
import { Routes, Route } from 'react-router-dom';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Contact } from './pages/Contact';
import { RefundPolicy } from './pages/RefundPolicy';
import { PricingPage } from './pages/PricingPage';
import { PricingSection } from './components/PricingSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, useMinutes } = useAuth();
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
    captionPosition: 'bottom',
    videoFit: 'contain', // Default: No crop, full video 100% visible
    audioWaveform: false,
    titleSticker: true, // Part 1, Part 2 series tag toggle (ON by default)
    enableCaptions: true, // Generate Animated Captions (Default: ON)
    exportQuality: '720p',
    customTitle: ''
  });
  const [mobileEditorTab, setMobileEditorTab] = useState<'preview' | 'controls'>('preview');
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isServerUploading, setIsServerUploading] = useState<boolean>(false);
  const [serverUploadProgress, setServerUploadProgress] = useState<number>(100);
  const [deductedJobs, setDeductedJobs] = useState<Set<string>>(new Set());
  const sideScrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);

  const handleFastScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      const total = el.scrollHeight - el.clientHeight;
      if (total > 0 && sideScrollIndicatorRef.current) {
        const pct = (el.scrollTop / total) * 100;
        sideScrollIndicatorRef.current.style.height = `${Math.min(100, Math.max(3, pct))}%`;
      }
    });
  };

  const handleDeductMinute = (id: string, durationInSeconds?: number, is4KJob?: boolean) => {
    if (deductedJobs.has(id)) return;
    setDeductedJobs(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    // Exact minutes based on downloaded video duration (e.g. 30s = 0.5m, 60s = 1.0m, 90s = 1.5m)
    const sec = durationInSeconds && durationInSeconds > 0 ? durationInSeconds : 60;
    const baseMinutes = sec / 60;

    // ₹199 Plan rule:
    // If using 4K: 50 minutes quota
    // If using 1080p: 160 minutes quota
    // Ratio: 160 / 50 = 3.2x credit deduction for 4K video rendering
    const is4K = is4KJob !== undefined ? is4KJob : (videoState.is4K || false);
    const rateMultiplier = is4K ? (160 / 50) : 1.0;
    const minutesToDeduct = Number(Math.max(0.1, (baseMinutes * rateMultiplier)).toFixed(1));
    useMinutes(minutesToDeduct);
  };

  const uploadVideoFile = (file: File, onProgress: (pct: number) => void): Promise<{ path: string; duration?: number }> => {
    return new Promise(async (resolve, reject) => {
      // Strict 5GB upload safety check
      if (file.size > 5 * 1024 * 1024 * 1024) {
        return reject(new Error("File size exceeds 5GB maximum upload limit."));
      }

      // Fallback direct upload if small or chunked fails
      const directUpload = () => {
        const formData = new FormData();
        formData.append('video', file);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              onProgress(100);
              resolve({ path: data.videoPath, duration: data.duration });
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`Direct upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Direct upload network error'));
        xhr.send(formData);
      };

      // Chunked upload with 10MB chunks
      const CHUNK_SIZE = 10 * 1024 * 1024;
      if (file.size < CHUNK_SIZE) {
        directUpload();
        return;
      }

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let currentChunk = 0;
      const uploadId = Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7);
      const fileName = file.name;

      const uploadChunk = (retry = 0) => {
        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('fileName', fileName);
        formData.append('chunkIndex', currentChunk.toString());
        formData.append('totalChunks', totalChunks.toString());

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload-chunk', true);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const chunkProgress = e.loaded / e.total;
            const overall = ((currentChunk + chunkProgress) / totalChunks) * 100;
            onProgress(Math.min(99, Math.round(overall)));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            currentChunk++;
            onProgress(Math.min(99, Math.round((currentChunk / totalChunks) * 100)));
            if (currentChunk < totalChunks) {
              setTimeout(() => uploadChunk(0), 10);
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                onProgress(100);
                resolve({ path: data.videoPath, duration: data.duration });
              } catch (err) {
                reject(err);
              }
            }
          } else {
            if (retry < 2) {
              setTimeout(() => uploadChunk(retry + 1), 1000);
            } else {
              // Fallback to direct upload
              console.warn("Chunked upload failed, falling back to direct upload...");
              directUpload();
            }
          }
        };
        xhr.onerror = () => {
          if (retry < 2) {
            setTimeout(() => uploadChunk(retry + 1), 1000);
          } else {
            directUpload();
          }
        };
        xhr.send(formData);
      };
      uploadChunk(0);
    });
  };

  const generateClips = (totalDuration: number, interval: number): Clip[] => {
    // If video duration is less than or equal to the selected interval (or <= 60s), keep it as 1 full clip!
    if (totalDuration <= interval) {
      return [
        {
          id: 'part-1',
          title: 'Part 1',
          viralityScore: 99,
          startTime: 0,
          endTime: Number(totalDuration.toFixed(1)),
          duration: Number(totalDuration.toFixed(1)),
          transcript: 'Highlight 1'
        }
      ];
    }

    const newClips: Clip[] = [];
    for (let i = 0; i < totalDuration; i += interval) {
      const end = Math.min(i + interval, totalDuration);
      if (end - i > 1) {
        const partNum = newClips.length + 1;
        newClips.push({
          id: `part-${partNum}`,
          title: `Part ${partNum}`,
          viralityScore: Math.max(88, 99 - ((partNum - 1) * 2)),
          startTime: i,
          endTime: end,
          duration: end - i,
          transcript: `Part ${partNum}`
        });
      }
    }
    return newClips;
  };

  const handleAnalyze = async (file: File | string, serverPath?: string) => {
    const videoUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

    if (typeof file !== 'string') {
      // Real file upload to server with live progress percentage
      setIsServerUploading(true);
      setServerUploadProgress(0.5);

      try {
        const result = await uploadVideoFile(file, (pct) => {
          setServerUploadProgress(Math.max(0.5, pct));
        });

        setServerUploadProgress(100.0);

        // Get video duration to compute clips accurately
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = videoUrl;

        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => resolve();
          setTimeout(() => resolve(), 1000);
        });

        const detectedDur = result.duration && result.duration > 0 ? result.duration : (video.duration || 60);
        const is4K = (video.videoWidth >= 3840 || video.videoHeight >= 2160 || (video.videoWidth >= 2160 && video.videoHeight >= 2160));
        const generatedClips = generateClips(detectedDur, editorSettings.clipDuration);

        setVideoState({
          url: videoUrl,
          file: file,
          serverPath: result.path,
          status: 'ready',
          clips: generatedClips,
          is4K: is4K
        });
        setSelectedClipId(generatedClips[0]?.id || null);

        // Pause briefly at 100% then transition to editor
        setTimeout(() => {
          setIsServerUploading(false);
          setActiveTab('editor');
        }, 400);

        // Fetch Whisper AI captions in background
        fetch('/api/whisper-transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoPath: result.path,
            startTime: 0,
            duration: Math.min(detectedDur, 60)
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.subtitles && Array.isArray(data.subtitles)) {
              setVideoState(prev => ({
                ...prev,
                clips: prev.clips.map(c => ({
                  ...c,
                  subtitles: data.subtitles
                }))
              }));
            }
          })
          .catch(e => console.warn('Whisper background transcription error:', e));

      } catch (err) {
        console.error("Upload error:", err);
        setIsServerUploading(false);
        alert("Failed to upload video to server. Please try again.");
      }
    } else {
      // Demo sample video: show fast smooth progress then open editor
      setIsServerUploading(true);
      setServerUploadProgress(15);
      const timer = setInterval(() => {
        setServerUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer);
            return 100.0;
          }
          return prev + 25;
        });
      }, 150);

      setTimeout(() => {
        clearInterval(timer);
        setServerUploadProgress(100.0);
        const generatedClips = generateClips(30, editorSettings.clipDuration);
        setVideoState({
          url: videoUrl,
          file: null,
          serverPath: serverPath || videoUrl,
          status: 'ready',
          clips: generatedClips
        });
        setSelectedClipId(generatedClips[0]?.id || null);

        // Call Whisper AI transcription for demo video to enable animated captions
        fetch('/api/whisper-transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoPath: 'public/demo-sample.mp4', startTime: 0, duration: 30 })
        })
          .then(r => r.json())
          .then(data => {
            if (data?.subtitles && Array.isArray(data.subtitles) && data.subtitles.length > 0) {
              setVideoState(prev => ({
                ...prev,
                clips: prev.clips.map(c => ({
                  ...c,
                  subtitles: data.subtitles
                }))
              }));
            }
          })
          .catch(e => console.warn('Whisper demo transcription error:', e));

        setTimeout(() => {
          setIsServerUploading(false);
          setActiveTab('editor');
        }, 300);
      }, 750);
    }
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
    let currentServerPath = videoState.serverPath;

    // If video is still syncing in the background, wait or notify user gracefully
    if (!currentServerPath && videoState.file) {
      if (isServerUploading) {
        alert(`Video is still uploading to render server (${serverUploadProgress}%). Please wait a few moments.`);
        return;
      }
      try {
        setIsServerUploading(true);
        const result = await uploadVideoFile(videoState.file, setServerUploadProgress);
        currentServerPath = result.path;
        setVideoState(prev => ({ ...prev, serverPath: result.path }));
        setIsServerUploading(false);
      } catch (err) {
        setIsServerUploading(false);
        alert("Failed to upload video to server for rendering. Please try again.");
        return;
      }
    }

    if (!videoState.url || !currentServerPath) {
      alert("Video not fully uploaded to server yet. Please wait a moment.");
      return;
    }
    
    if (user && user.minutes !== undefined && user.minutes <= 0) {
      setIsPricingOpen(true);
      alert("Aapke Free Minutes poore ho chuke hain. Mazeed video download karne ke liye please plan upgrade karein.");
      return null;
    }

    const jobTitle = editorSettings.customTitle?.trim() || clip.title.toLowerCase();
    const jobId = `job-${Date.now()}`;
    const clipDur = clip.duration || (clip.endTime - clip.startTime) || 60;
    const newJob: RenderJob = {
      id: jobId,
      clipId: clip.id,
      title: jobTitle,
      status: 'processing',
      progress: 0,
      duration: clipDur
    };
    
    setRenderJobs(prev => [...prev, newJob]);

    try {
      const url = await renderVideoClip(
        clip, 
        currentServerPath, 
        { ...editorSettings, showTitleSticker: editorSettings.titleSticker, customTitle: jobTitle } as any, 
        (p) => setRenderJobs(prev => prev.map(j => j.id === jobId ? { ...j, progress: p } : j)),
        jobId
      );
      
      setRenderJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'ready', blobUrl: url } : j));
      return url;
    } catch (e) {
      console.error(e);
      setRenderJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'error' } : j));
      return null;
    }
  };

  const handleExport = async () => {
    if (user && user.minutes !== undefined && user.minutes <= 0) {
      setIsPricingOpen(true);
      if (user.currency === 'USD' && user.plan === 'free') {
        alert("You have used your daily free trial minutes! They will refresh in the next 24-hour cycle (Total 50 Mins Trial).");
      } else {
        alert("Aapke Free Minutes khatam ho chuke hain. Mazeed video download karne ke liye please Starter Pack (₹49) le lijiye!");
      }
      return;
    }
    const activeClip = videoState.clips.find(c => c.id === selectedClipId);
    if (!activeClip || !videoState.url) return;
    
    setActiveTab('export');
    const url = await processRenderJob(activeClip);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      const fileName = (activeClip.title || 'video').toLowerCase().replace(/[^a-z0-9]/gi, '_');
      a.download = `${fileName}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      const activeDur = activeClip.duration || (activeClip.endTime - activeClip.startTime) || 60;
      handleDeductMinute(activeClip.id, activeDur);
    }
  };

  const handleExportAll = async () => {
    if (user && user.minutes !== undefined && user.minutes <= 0) {
      setIsPricingOpen(true);
      if (user.currency === 'USD' && user.plan === 'free') {
        alert("You have used your daily free trial minutes! They will refresh in the next 24-hour cycle (Total 50 Mins Trial).");
      } else {
        alert("Aapke Free Minutes khatam ho chuke hain. Mazeed video download karne ke liye please Starter Pack (₹49) le lijiye!");
      }
      return;
    }
    if (!videoState.url || videoState.clips.length === 0) return;
    
    setActiveTab('export');
    for (let i = 0; i < videoState.clips.length; i++) {
      const clip = videoState.clips[i];
      if (user && user.minutes !== undefined && user.minutes <= 0) {
        setIsPricingOpen(true);
        if (user.currency === 'USD' && user.plan === 'free') {
          alert("You have used your daily free trial minutes! They will refresh in the next 24-hour cycle (Total 50 Mins Trial).");
        } else {
          alert("Aapke Free Minutes khatam ho chuke hain. Mazeed video download karne ke liye please Starter Pack (₹49) le lijiye!");
        }
        break;
      }
      const url = await processRenderJob(clip);
      if (url) {
        // Automatically initiate download for each rendered part as soon as it completes
        const a = document.createElement('a');
        a.href = url;
        const fileName = (clip.title || `part-${i + 1}`).toLowerCase().replace(/[^a-z0-9]/gi, '_');
        a.download = `${fileName}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        const clipDur = clip.duration || (clip.endTime - clip.startTime) || 60;
        handleDeductMinute(clip.id, clipDur);
      }
    }
  };

  const handleOpenPricing = () => {
    setIsPricingOpen(true);
    if (activeTab !== 'upload') {
      setActiveTab('upload');
    }
    setTimeout(() => {
      const el = document.getElementById('pricing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const activeClip = videoState.clips.find(c => c.id === selectedClipId) || null;

  return (
    <Routes>
      <Route path="/" element={
        
    <div className="flex flex-col h-[100dvh] w-full bg-black text-zinc-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Header onOpenAuth={() => setIsAuthOpen(true)} onOpenPricing={handleOpenPricing} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeRenderCount={renderJobs.length}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-black">
          <ErrorBoundary fallbackTitle="Error loading workspace view">
          {activeTab === 'upload' && (
            <div className="relative flex-1 flex flex-col h-full overflow-hidden">
              {/* Ultra-Fast Responsive Side Scroll Line Indicator */}
              <div className="absolute top-0 right-0 bottom-0 w-[4px] bg-zinc-900/30 pointer-events-none z-30">
                <div 
                  ref={sideScrollIndicatorRef}
                  className="w-full bg-gradient-to-b from-indigo-500 via-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.9)] rounded-full will-change-[height]"
                  style={{ height: '3%' }}
                />
              </div>

              <div 
                onScroll={handleFastScroll}
                className="flex-1 flex flex-col overflow-y-auto custom-scrollbar overscroll-y-contain pb-32 md:pb-12"
              >
                <VideoUploader 
                  onAnalyze={handleAnalyze} 
                  status={videoState.status} 
                  onOpenAuth={() => setIsAuthOpen(true)} 
                  onOpenPricing={handleOpenPricing}
                  isUploading={isServerUploading}
                  uploadProgress={serverUploadProgress}
                  onCancelUpload={() => {
                    setIsServerUploading(false);
                    setServerUploadProgress(0);
                  }}
                />
                <PricingSection onOpenAuth={() => setIsAuthOpen(true)} />
                <SeoSection onLoadDemo={() => handleAnalyze('/demo-sample.mp4?v=7', 'public/demo-sample.mp4')} />
              </div>
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
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-24 md:pb-0 h-full">
              {/* Mobile Editor Switcher (Preview vs Controls) - Only on Phones (<768px) */}
              <div className="md:hidden flex items-center justify-center p-2 bg-zinc-950/95 border-b border-zinc-800/80 shrink-0 z-30">
                <div className="flex bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 w-full max-w-xs justify-center gap-1 shadow-md">
                  <button
                    type="button"
                    onClick={() => setMobileEditorTab('preview')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      mobileEditorTab === 'preview'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>🎬 Video Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileEditorTab('controls')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      mobileEditorTab === 'controls'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>⚙️ Controls & Export</span>
                  </button>
                </div>
              </div>

              {/* Editor Workspace: Dual-Pane on Tablets & PC, Tabbed on Phones */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full h-full min-h-0">
                <div className={`flex-1 flex flex-col min-w-0 h-full min-h-0 overflow-hidden ${mobileEditorTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
                  <ShortsEditor 
                    clip={activeClip} 
                    settings={editorSettings as any} 
                    setSettings={setEditorSettings}
                    videoUrl={videoState.url} 
                    clips={videoState.clips}
                    onSelectClip={setSelectedClipId}
                  />
                </div>
                <div className={`w-full md:w-80 lg:w-96 flex flex-col flex-1 md:flex-none h-full min-h-0 overflow-hidden shrink-0 ${mobileEditorTab === 'controls' ? 'flex' : 'hidden md:flex'}`}>
                  <SettingsPanel 
                    settings={editorSettings}
                    setSettings={setEditorSettings}
                    clips={videoState.clips}
                    selectedClipId={selectedClipId}
                    onSelectClip={setSelectedClipId}
                    onExport={handleExport}
                    onExportAll={handleExportAll}
                    isServerUploading={isServerUploading}
                    serverUploadProgress={serverUploadProgress}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <ExportQueue 
              jobs={renderJobs} 
              videoUrl={videoState.url} 
              onDownloadJob={handleDeductMinute}
            />
          )}
          </ErrorBoundary>
        </main>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />
    </div>
  
      } />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/cancellation-refund" element={<RefundPolicy />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Routes>
  );
}
