import React, { useState } from 'react';
import { UploadCloud, Video, Link as LinkIcon, Loader2 } from 'lucide-react';
import { cn } from '../utils';

interface VideoUploaderProps {
  onAnalyze: (url: string | null, file: File | null) => void;
  status: 'idle' | 'uploading' | 'analyzing' | 'ready';
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onAnalyze, status }) => {
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'video/mp4' || file.type === 'video/quicktime')) {
      onAnalyze(null, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyze(null, file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onAnalyze(url, null);
    }
  };

  const isProcessing = status === 'uploading' || status === 'analyzing';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-900/50 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-6 md:space-y-8 py-4">
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
            Turn Long Videos into <span className="text-indigo-400">Viral Shorts</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg px-2">
            Upload a video or paste a link to get started.
          </p>
        </div>

        <form onSubmit={handleUrlSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Video className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="url"
            placeholder="Paste YouTube or Video URL here..."
            className="block w-full pl-11 pr-32 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isProcessing}
          />
          <div className="absolute inset-y-2 right-2">
            <button
              type="submit"
              disabled={!url || isProcessing}
              className="h-full px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LinkIcon className="w-4 h-4" />
              )}
              Load
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4 text-zinc-500">
          <div className="flex-1 h-px bg-zinc-800"></div>
          <span className="text-sm font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-zinc-800"></div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative group rounded-3xl border-2 border-dashed p-12 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[300px]",
            isDragging 
              ? "border-indigo-500 bg-indigo-500/5" 
              : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900",
            isProcessing && "opacity-50 pointer-events-none"
          )}
        >
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-zinc-800 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-medium text-zinc-200">
                  {status === 'uploading' ? 'Uploading Video...' : 'AI Analyzing Content...'}
                </h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                  {status === 'uploading' 
                    ? 'Please keep this tab open while we upload your video securely.'
                    : 'Our Gemini AI is analyzing the transcript and visuals for high-retention moments.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-10 h-10 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                Click to upload or drag and drop
              </h3>
              <p className="text-zinc-500 text-sm text-center px-4">
                MP4 or MOV<br/>
                <span className="text-zinc-600 text-xs">(Supports long videos up to 120 mins)</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
