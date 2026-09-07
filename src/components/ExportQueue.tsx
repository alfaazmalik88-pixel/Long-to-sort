import React from 'react';
import { RenderJob } from '../types';
import { DownloadModal } from './DownloadModal';
import { Film, CheckCircle2, Download, AlertTriangle, ExternalLink, XCircle } from 'lucide-react';

interface ExportQueueProps {
  jobs: RenderJob[];
  videoUrl: string | null;
}

export const ExportQueue: React.FC<ExportQueueProps> = ({ jobs }) => {
  const [downloadJob, setDownloadJob] = React.useState<RenderJob | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-black">
      <div className="max-w-2xl mx-auto pb-32 space-y-6">
        
        <div className="mb-2">
          <h2 className="text-xl font-bold text-white mb-1">Export Queue</h2>
          <p className="text-zinc-400 text-sm">Manage your rendering shorts</p>
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-zinc-600 font-medium text-center py-8 bg-[#0a0a0a] rounded-xl border border-zinc-900 text-sm">
            No jobs in queue.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-lg transition-all">
                
                {/* Header Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#111] rounded-xl flex items-center justify-center shrink-0 border border-zinc-700">
                    {job.status === 'ready' ? (
                       <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    ) : job.status === 'error' ? (
                       <XCircle className="w-7 h-7 text-red-500" />
                    ) : (
                      <Film className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-zinc-100 truncate">{job.title || 'Video'}</h3>
                    {job.status === 'processing' ? (
                      <p className="text-sm text-indigo-400 font-semibold mt-1">Rendering: {Math.round(job.progress)}%</p>
                    ) : job.status === 'ready' ? (
                      <p className="text-sm text-emerald-500 font-semibold mt-1">Ready to download</p>
                    ) : (
                      <p className="text-sm text-red-500 font-semibold mt-1">Rendering failed</p>
                    )}
                  </div>
                </div>

                {/* Processing Bar */}
                {job.status === 'processing' && (
                  <div className="w-full">
                    <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden mb-2">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${job.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Please keep this tab open while rendering.
                    </p>
                  </div>
                )}

                {/* Big Full-Width Download Button */}
                {job.status === 'ready' && (
                  <button 
                    onClick={() => setDownloadJob(job)}
                    className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50 active:scale-[0.98] transition-all border border-indigo-500"
                  >
                    <Download className="w-6 h-6" />
                    DOWNLOAD VIDEO
                  </button>
                )}

                {/* Error Fallback Box / Alternative Link */}
                {job.status === 'error' && (
                  <div className="mt-2 bg-[#120e0a] border border-amber-900/50 p-5 rounded-xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-300">
                    <div className="space-y-1">
                      <h4 className="text-amber-500 font-bold text-sm">Server Limits Reached</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Due to high traffic on this free tool, the server couldn't render your video. Please use our alternative tool to cut or download videos directly.
                      </p>
                    </div>
                    <a 
                      href="https://ghost-ig512.alfaazmalik88.workers.dev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 px-5 py-3 rounded-xl text-sm font-bold transition-colors items-center justify-center gap-2"
                    >
                      Use Alternative Video Cutter <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
                
              </div>
            ))}
          </div>
        )}
      </div>

      <DownloadModal
          isOpen={!!downloadJob}
          onClose={() => setDownloadJob(null)}
          downloadUrl={downloadJob?.blobUrl || ''}
          fileName={downloadJob?.title || 'video'}
        />
    </div>
  );
};
