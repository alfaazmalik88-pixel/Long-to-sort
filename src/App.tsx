import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { VideoUploader } from './components/VideoUploader';
import { ClipSelector } from './components/ClipSelector';
import { ShortsEditor } from './components/ShortsEditor';
import { SettingsPanel } from './components/SettingsPanel';
import { ExportQueue } from './components/ExportQueue';
import { SeoSection } from './components/SeoSection';
import { Header } from './components/Header';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { VideoState, Clip, EditorSettings, RenderJob } from './types';
import { renderVideoClip } from './lib/renderVideo';
import { Routes, Route } from 'react-router-dom';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Contact } from './pages/Contact';
import { RefundPolicy } from './pages/RefundPolicy';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { BlogArticlePage } from './pages/BlogArticlePage';
import { AboutUs } from './pages/AboutUs';
import { AlternativePage } from './pages/AlternativePage';
import { PricingSection } from './components/PricingSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';
import { DEMO_PRELOADED_SUBTITLES } from './data/demoSubtitles';
import { translateSubtitlesInstant } from './utils/instantTranslation';

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
    subtitleLanguage: 'auto', // Multi-language: Hindi -> Hinglish, others Global / Local
    exportQuality: '720p',
    customTitle: ''
  });
  const [mobileEditorTab, setMobileEditorTab] = useState<'preview' | 'controls'>('preview');
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServerUploading, setIsServerUploading] = useState<boolean>(false);
  const [serverUploadProgress, setServerUploadProgress] = useState<number>(100);
  const [deductedJobs, setDeductedJobs] = useState<Set<string>>(new Set());
  const deductedJobsRef = useRef<Set<string>>(new Set());
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

  const handleDeductMinute = (id: string, durationInSeconds?: number) => {
    if (deductedJobsRef.current.has(id)) return;
    deductedJobsRef.current.add(id);
    setDeductedJobs(new Set(deductedJobsRef.current));

    // Jitne minutes ki video download hui hai, theek utne minutes minus karo:
    // 30 second clip -> 30/60 = 0.5 minute minus
    // 60 second clip -> 60/60 = 1.0 minute minus
    // 90 second clip -> 90/60 = 1.5 minutes minus
    // jitne bhi second ya minute ki video download ho, theek utne minutes minus honge
    const exactSeconds = durationInSeconds && durationInSeconds > 0 ? durationInSeconds : (editorSettings.clipDuration || 60);
    const minutesToDeduct = Math.round((exactSeconds / 60) * 100) / 100;
    useMinutes(minutesToDeduct);
  };

  const uploadVideoFile = (file: File, onProgress: (pct: number) => void): Promise<{ path: string; duration?: number }> => {
    return new Promise(async (resolve, reject) => {
      // Strict 5GB upload safety check
      if (file.size > 5 * 1024 * 1024 * 1024) {
        return reject(new Error("File size exceeds 5GB maximum upload limit. 5GB ke upar upload nahi kar sakte."));
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
              if (data.duration && data.duration > 3600) {
                const durMin = Math.round(data.duration / 60);
                return reject(new Error(`Video duration (${durMin} mins) exceeds 60 minutes limit. 60 minute ke aage upload nahi kar sakte.`));
              }
              onProgress(100);
              resolve({ path: data.videoPath, duration: data.duration });
            } catch (err) {
              reject(err);
            }
          } else {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData.error || `Direct upload failed with status ${xhr.status}`));
            } catch (_) {
              reject(new Error(`Direct upload failed with status ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error('Direct upload network error'));
        xhr.send(formData);
      };

      // Resilient chunked upload with 2.5MB chunks (smoother progress, resilient to network drops)
      const CHUNK_SIZE = 2.5 * 1024 * 1024;
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
        xhr.timeout = 45000; // 45 seconds timeout per chunk

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
            const pct = Math.min(99, Math.round((currentChunk / totalChunks) * 100));
            onProgress(pct);

            if (currentChunk < totalChunks) {
              setTimeout(() => uploadChunk(0), 10);
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                if (data.duration && data.duration > 3600) {
                  const durMin = Math.round(data.duration / 60);
                  return reject(new Error(`Video duration (${durMin} mins) exceeds 60 minutes limit. 60 minute ke aage upload nahi kar sakte.`));
                }
                onProgress(100);
                resolve({ path: data.videoPath, duration: data.duration });
              } catch (err) {
                reject(err);
              }
            }
          } else if (xhr.status === 400) {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData.error || "Upload rejected: limits exceeded."));
            } catch (_) {
              reject(new Error("Upload rejected: limits exceeded."));
            }
          } else {
            // Server error or network drop: retry current chunk without resetting counter
            if (retry < 4) {
              const backoff = (retry + 1) * 1000;
              setTimeout(() => uploadChunk(retry + 1), backoff);
            } else {
              console.warn("Chunked upload retries exceeded, falling back to direct upload...");
              directUpload();
            }
          }
        };

        xhr.ontimeout = () => {
          if (retry < 4) {
            const backoff = (retry + 1) * 1000;
            setTimeout(() => uploadChunk(retry + 1), backoff);
          } else {
            directUpload();
          }
        };

        xhr.onerror = () => {
          // Network dropped temporarily: retry the same chunk with backoff
          if (retry < 4) {
            const backoff = (retry + 1) * 1000;
            setTimeout(() => uploadChunk(retry + 1), backoff);
          } else {
            directUpload();
          }
        };

        xhr.send(formData);
      };

      uploadChunk(0);
    });
  };

  const assignSubtitlesToClips = (clips: Clip[], allSubtitles: any[]): Clip[] => {
    return clips.map(clip => {
      const clipStart = clip.startTime || 0;
      const clipEnd = clip.endTime || 60;
      
      // Check if subtitles have timestamps beyond this clip's start
      const matching = allSubtitles.filter(s => {
        const sStart = Number(s.startTime ?? s.start ?? 0);
        const sEnd = Number(s.endTime ?? s.end ?? (sStart + 2));
        return (sStart >= clipStart - 0.5 && sStart < clipEnd) ||
               (sEnd > clipStart && sEnd <= clipEnd + 0.5);
      });

      if (matching.length > 0 && clipStart > 0) {
        // Normalize timestamps relative to clip local start (0.0s to duration)
        const normalized = matching.map(s => {
          const sStart = Math.max(0, Number((Number(s.startTime ?? s.start ?? 0) - clipStart).toFixed(2)));
          const sEnd = Math.max(sStart + 0.3, Number((Number(s.endTime ?? s.end ?? 0) - clipStart).toFixed(2)));
          return {
            ...s,
            startTime: sStart,
            endTime: sEnd,
            start: sStart,
            end: sEnd,
            words: Array.isArray(s.words) ? s.words.map((w: any) => ({
              ...w,
              start: Math.max(0, Number((Number(w.start ?? 0) - clipStart).toFixed(2))),
              end: Math.max(0, Number((Number(w.end ?? 0) - clipStart).toFixed(2)))
            })) : []
          };
        });
        return { ...clip, subtitles: normalized };
      }

      return {
        ...clip,
        subtitles: matching.length > 0 ? matching : allSubtitles
      };
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
        if (detectedDur > 3600) {
          setIsServerUploading(false);
          const durMin = Math.round(detectedDur / 60);
          alert(`Video length (${durMin} mins) exceeds the 60 minutes maximum allowed limit. 60 minute ke aage upload nahi kar sakte.`);
          return;
        }

        const is4K = (video.videoWidth >= 3840 || video.videoHeight >= 2160 || (video.videoWidth >= 2160 && video.videoHeight >= 2160));
        const generatedClips = generateClips(detectedDur, editorSettings.clipDuration);

        // Fast direct transcription before opening editor so real captions are ready
        let clipsWithSubs = generatedClips;
        const currentSelectedLang = (editorSettings.subtitleLanguage || 'auto').toLowerCase();
        try {
          const transPromise = fetch('/api/gemini-transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoPath: result.path,
              startTime: 0,
              duration: Math.min(detectedDur, 30),
              language: currentSelectedLang
            })
          }).then(res => res.json());

          // 2.5s quick race so editor opens swiftly without freezing
          const timeoutPromise = new Promise<any>((resolve) => setTimeout(() => resolve(null), 2500));
          const data = await Promise.race([transPromise, timeoutPromise]);

          if (data && data.subtitles && Array.isArray(data.subtitles) && data.subtitles.length > 0) {
            clipsWithSubs = assignSubtitlesToClips(generatedClips, data.subtitles);
            clipsWithSubs = clipsWithSubs.map(c => ({ ...c, subtitleLanguage: currentSelectedLang }));
          }
        } catch (e) {
          console.warn('Initial fast transcription notice:', e);
        }

        setVideoState({
          url: videoUrl,
          file: file,
          serverPath: result.path,
          status: 'ready',
          clips: clipsWithSubs,
          is4K: is4K
        });
        setSelectedClipId(clipsWithSubs[0]?.id || null);
        setIsServerUploading(false);
        setActiveTab('editor');

      } catch (err: any) {
        console.error("Upload notice:", err);
        setIsServerUploading(false);
        // Graceful network resilience: Open editor immediately with local blob video so user is never blocked!
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = videoUrl;
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => resolve();
          setTimeout(() => resolve(), 800);
        });
        const fallbackDur = video.duration && !isNaN(video.duration) ? video.duration : 60;
        const generatedClips = generateClips(fallbackDur, editorSettings.clipDuration);
        setVideoState({
          url: videoUrl,
          file: file,
          serverPath: null,
          status: 'ready',
          clips: generatedClips,
          is4K: false
        });
        setSelectedClipId(generatedClips[0]?.id || null);
        setActiveTab('editor');
      }
    } else {
      // Demo sample video: load instant pre-cached subtitles and open editor immediately (0s delay!)
      const targetDemoPath = serverPath || 'public/official-demo.mp4';
      const curLang = (editorSettings.subtitleLanguage || 'auto').toLowerCase();
      const demoSubs = DEMO_PRELOADED_SUBTITLES[curLang] || DEMO_PRELOADED_SUBTITLES.hi;
      let demoClips = generateClips(10, editorSettings.clipDuration);
      demoClips = assignSubtitlesToClips(demoClips, demoSubs);
      demoClips = demoClips.map(c => ({ ...c, subtitleLanguage: curLang }));

      setServerUploadProgress(100.0);
      setVideoState({
        url: videoUrl,
        file: null,
        serverPath: targetDemoPath,
        status: 'ready',
        clips: demoClips
      });
      setSelectedClipId(demoClips[0]?.id || null);
      setIsServerUploading(false);
      setActiveTab('editor');
    }
  };

  useEffect(() => {
    if (videoState.url && videoState.clips.length > 0) {
      const currentTotalDuration = Math.max(...videoState.clips.map(c => c.endTime || c.duration || 0), 10);
      
      const updateClipsWithDuration = (dur: number) => {
        const totalDur = dur && dur > 0 ? dur : currentTotalDuration;
        const newClips = generateClips(totalDur, editorSettings.clipDuration);
        const existingSubs = videoState.clips.flatMap(c => c.subtitles || []);
        const mergedClips = existingSubs.length > 0 ? assignSubtitlesToClips(newClips, existingSubs) : newClips;
        setVideoState(prev => ({ ...prev, clips: mergedClips }));
        if (!mergedClips.find(c => c.id === selectedClipId)) {
          setSelectedClipId(mergedClips[0]?.id || null);
        }
      };

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = videoState.url;
      video.onloadedmetadata = () => {
        updateClipsWithDuration(video.duration);
      };
      setTimeout(() => {
        if (!video.duration || isNaN(video.duration)) {
          updateClipsWithDuration(currentTotalDuration);
        }
      }, 200);
    }
  }, [editorSettings.clipDuration]);

  // Live instant language shift across all clips when user changes Subtitle Language (Hinglish -> Arabic / English / etc.)
  useEffect(() => {
    const targetLang = (editorSettings.subtitleLanguage || 'auto').toLowerCase();
    if (!videoState.clips || videoState.clips.length === 0) return;

    setVideoState(prev => {
      const isDemo = !prev.serverPath || prev.serverPath.includes('demo') || (prev.url ? prev.url.includes('demo') : false);
      const updatedClips = prev.clips.map(clip => {
        if (isDemo) {
          const demoSubs = DEMO_PRELOADED_SUBTITLES[targetLang] || (targetLang === 'ar' ? DEMO_PRELOADED_SUBTITLES.ar : DEMO_PRELOADED_SUBTITLES.hi);
          return {
            ...clip,
            subtitles: demoSubs,
            subtitleLanguage: targetLang
          };
        }

        if (clip.subtitles && clip.subtitles.length > 0) {
          const currentClipLang = (clip.subtitleLanguage || 'hi').toLowerCase();
          if (targetLang !== 'auto' && currentClipLang !== targetLang) {
            const translated = translateSubtitlesInstant(clip.subtitles, targetLang);
            return {
              ...clip,
              subtitles: translated,
              subtitleLanguage: targetLang
            };
          }
        }
        return clip;
      });
      return { ...prev, clips: updatedClips };
    });
  }, [editorSettings.subtitleLanguage]);

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
      alert("You have reached your Free Minutes limit. Please upgrade your plan to continue downloading videos.");
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
      
      setRenderJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'ready', blobUrl: url, progress: 100 } : j));
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
      alert("Your free trial limit has been reached. Please choose a plan (starting at $4.99 / ₹49) to export more videos!");
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
      alert("Your free trial limit has been reached. Please choose a plan (starting at $4.99 / ₹49) to export more videos!");
      return;
    }
    if (!videoState.url || videoState.clips.length === 0) return;
    
    setActiveTab('export');
    for (let i = 0; i < videoState.clips.length; i++) {
      const clip = videoState.clips[i];
      if (user && user.minutes !== undefined && user.minutes <= 0) {
        setIsPricingOpen(true);
        alert("Your free trial limit has been reached. Please choose a plan (starting at $4.99 / ₹49) to export more videos!");
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
                <SeoSection onLoadDemo={() => handleAnalyze('/official-demo.mp4?v=clean_hd', 'public/official-demo.mp4')} />
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
                    serverPath={videoState.serverPath}
                    onUpdateClipSubtitles={(clipId, subtitles, lang) => {
                      setVideoState(prev => ({
                        ...prev,
                        clips: prev.clips.map(c => c.id === clipId ? { ...c, subtitles, subtitleLanguage: lang || editorSettings.subtitleLanguage || 'auto' } : c)
                      }));
                    }}
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
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  
      } />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/cancellation-refund" element={<RefundPolicy />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/guides" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogArticlePage />} />
      <Route path="/guides/:slug" element={<BlogArticlePage />} />
      
      {/* Individual dedicated pages for all remaining blog articles */}
      <Route path="/how-to-add-alex-hormozi-captions-in-60-seconds" element={<BlogArticlePage slug="how-to-add-alex-hormozi-captions-in-60-seconds" />} />
      <Route path="/viral-hooks-formula-retain-85-percent-watch-time" element={<BlogArticlePage slug="viral-hooks-formula-retain-85-percent-watch-time" />} />
      <Route path="/shorts-seo-secrets-rank-number-1-youtube-explore" element={<BlogArticlePage slug="shorts-seo-secrets-rank-number-1-youtube-explore" />} />
      <Route path="/kinetic-subtitles-dynamic-word-highlighting-secret" element={<BlogArticlePage slug="kinetic-subtitles-dynamic-word-highlighting-secret" />} />
      <Route path="/opus-clip-alternative-convert-long-videos-to-shorts" element={<BlogArticlePage slug="opus-clip-alternative-convert-long-videos-to-shorts" />} />

      <Route path="/about" element={<AboutUs />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/opus-clip-alternative" element={<AlternativePage tool="opus" />} />
      <Route path="/submagic-alternative" element={<AlternativePage tool="submagic" />} />
      <Route path="/klap-alternative" element={<AlternativePage tool="klap" />} />
      <Route path="/vizard-alternative" element={<AlternativePage tool="vizard" />} />
    </Routes>
  );
}
