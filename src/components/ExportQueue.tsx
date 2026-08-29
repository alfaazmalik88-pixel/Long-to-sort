import React from 'react';
import { Film, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import { RenderJob } from '../types';
import { cn } from '../utils';
import { AdBanner } from './AdBanner';

interface ExportQueueProps {
  jobs: RenderJob[];
  videoUrl?: string | null;
}

export const ExportQueue: React.FC<ExportQueueProps> = ({ jobs, videoUrl }) => {
  const handleDownload = (url: string, title: string) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download failed:", e);
      window.open(url, '_blank');
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950">
        <Film className="w-16 h-16 text-zinc-800 mb-4" />
        <h2 className="text-xl font-medium text-zinc-300">Render Queue Empty</h2>
        <p className="text-zinc-500 mt-2">Export a clip from the editor to start rendering.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      <div className="p-8 border-b border-zinc-800 shrink-0">
        <h2 className="text-2xl font-bold text-zinc-100">Export Queue</h2>
        <p className="text-zinc-400 mt-1">Manage your rendering shorts</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-6">
              <div id={`render-preview-container-${job.id}`} className="w-24 h-36 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 shrink-0 relative overflow-hidden group">
                {job.thumbnailUrl ? (
                  <img src={job.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" />
                ) : (
                  <Film className="w-8 h-8 text-zinc-700 absolute z-0" />
                )}
                <div className="absolute inset-0 bg-black/40 transition-colors z-0"></div>
                {job.status === 'pending' && (
                  <Loader2 className="w-6 h-6 text-zinc-300 animate-spin relative z-10" />
                )}
                {job.status === 'ready' && (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 relative z-10" />
                )}
                {job.status === 'failed' && (
                  <AlertCircle className="w-8 h-8 text-red-400 relative z-10" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-zinc-100">{job.title}</h3>
                  <div className="text-sm font-medium">
                    {job.status === 'pending' && <span className="text-zinc-500">Waiting...</span>}
                    {job.status === 'processing' && <span className="text-indigo-400">{Math.round(job.progress)}%</span>}
                    {job.status === 'ready' && <span className="text-emerald-400">Ready</span>}
                    {job.status === 'failed' && <span className="text-red-400">Failed</span>}
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mb-4 border border-zinc-800">
                    <div 
                      className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                )}
                
                {job.status === 'pending' && (
                  <p className="text-sm text-zinc-500">
                    Waiting for previous renders to complete...
                  </p>
                )}

                {job.status === 'processing' && (
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Rendering your clip on the server...<br/>
                    <span className="text-zinc-500 text-xs">You can safely leave this page or queue more clips.</span>
                  </p>
                )}

                {job.status === 'failed' && (
                  <p className="text-sm text-red-400/90 leading-relaxed bg-red-500/10 p-3 rounded-lg border border-red-500/20 mt-2">
                    {job.errorMessage || 'Unknown error occurred while rendering.'}
                  </p>
                )}

                {job.status === 'ready' && (
                  <div className="flex items-center gap-3 mt-4">
                    {job.blobUrl ? (
                      <button 
                        onClick={() => handleDownload(job.blobUrl!, job.title)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Video
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed">
                        <Download className="w-4 h-4" />
                        Download MP4
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <AdBanner />
        </div>
      </div>
    </div>
  );
};
