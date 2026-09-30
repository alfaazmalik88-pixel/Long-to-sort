import React from 'react';
import { RenderJob } from '../types';
import { DownloadModal } from './DownloadModal';
import { Film, CheckCircle2, Download, AlertTriangle, XCircle, FolderDown } from 'lucide-react';

interface ExportQueueProps {
  jobs: RenderJob[];
  videoUrl?: string | null;
  onDownloadJob?: (jobId: string, duration?: number) => void;
}

export const ExportQueue: React.FC<ExportQueueProps> = ({ jobs, onDownloadJob }) => {
  const [downloadJob, setDownloadJob] = React.useState<RenderJob | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = React.useState(false);

  const readyJobs = jobs.filter(j => j.status === 'ready' && j.blobUrl);
  const hasProcessing = jobs.some(j => j.status === 'processing');

  const handleDownloadAll = async () => {
    if (readyJobs.length === 0) return;
    setIsDownloadingAll(true);

    for (let i = 0; i < readyJobs.length; i++) {
      const job = readyJobs[i];
      if (job.blobUrl) {
        const a = document.createElement('a');
        a.href = job.blobUrl;
        a.download = `${(job.title || `part-${i + 1}`).toLowerCase().replace(/[^a-z0-9]/gi, '_')}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (onDownloadJob) {
          onDownloadJob(job.id, job.duration);
        }
        await new Promise(r => setTimeout(r, 800));
      }
    }

    setIsDownloadingAll(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black text-zinc-100 custom-scrollbar">
      <div className="max-w-2xl mx-auto pb-32 space-y-6">
        
        {/* Title: Export Queue */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Export Queue
          </h1>

          {readyJobs.length > 1 && (
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FolderDown className="w-4 h-4" />
              <span>{isDownloadingAll ? 'Downloading All...' : `Download All (${readyJobs.length})`}</span>
            </button>
          )}
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-zinc-500 font-medium text-center py-16 bg-zinc-950/60 rounded-3xl border border-zinc-800/80 text-sm space-y-2">
            <Film className="w-8 h-8 text-zinc-700 mx-auto stroke-[1.5]" />
            <p className="text-zinc-400 font-semibold">No active render jobs in queue.</p>
            <p className="text-xs text-zinc-600">Go to Editor tab and click 'Render All Parts'.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map(job => (
              <div 
                key={job.id} 
                className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl backdrop-blur-xl transition-all"
              >
                
                {/* Header Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0 border border-zinc-800 shadow-inner">
                    {job.status === 'ready' ? (
                       <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : job.status === 'error' ? (
                       <XCircle className="w-6 h-6 text-rose-500" />
                    ) : (
                       <Film className="w-6 h-6 text-zinc-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      {job.title || 'Part 1'}
                    </h3>
                    
                    {job.status === 'processing' ? (
                      <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                        Rendering: {Math.round(job.progress || 6)}%
                      </p>
                    ) : job.status === 'ready' ? (
                      <p className="text-xs text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1080p Full HD Ready
                      </p>
                    ) : (
                      <p className="text-xs text-rose-400 font-semibold mt-0.5">Processing failed</p>
                    )}
                  </div>
                </div>

                {/* Processing Progress Bar */}
                {job.status === 'processing' && (
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800/60">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${Math.max(5, Math.min(100, job.progress || 6))}%` }}
                    />
                  </div>
                )}

                {/* Download CTA Button */}
                {job.status === 'ready' && (
                  <button 
                    onClick={() => setDownloadJob(job)}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Clean Video</span>
                  </button>
                )}
                
              </div>
            ))}
          </div>
        )}

        {/* Warning / Tab Notice matching frame 02:06 */}
        {hasProcessing && (
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Please keep this tab open while rendering.</span>
          </div>
        )}
        
        {downloadJob && (
          <DownloadModal 
            isOpen={!!downloadJob}
            onClose={() => setDownloadJob(null)}
            downloadUrl={downloadJob.blobUrl || ''}
            fileName={`${(downloadJob.title || 'video').toLowerCase().replace(/\s+/g, '-')}.mp4`}
            onDownloadSuccess={() => {
              if (onDownloadJob && downloadJob) {
                onDownloadJob(downloadJob.id, downloadJob.duration);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
