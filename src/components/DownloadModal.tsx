import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Download, Clock } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string;
  fileName: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, downloadUrl, fileName }) => {
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(5); // 5 seconds timer

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setCountdown(5);
      return;
    }
    
    if (step === 1) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setStep(2);
      }
    }
  }, [isOpen, step, countdown]);

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#050505] animate-in fade-in duration-300 overflow-y-auto">
      
      {/* Top Navbar */}
      <div className="w-full h-16 bg-[#0a0a0a] border-b border-zinc-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ViralClip AI" className="w-8 h-8 rounded-lg" />
          <span className="text-white font-bold text-lg">ViralClip AI</span>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        
        <div className="w-full max-w-lg bg-[#0a0a0a] border border-zinc-900 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
            {step === 1 ? (
               <Clock className="w-10 h-10 text-indigo-400 animate-pulse" />
            ) : (
               <ShieldCheck className="w-10 h-10 text-emerald-400" />
            )}
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
             {step === 1 ? "Preparing your video..." : "Your Video is Ready!"}
          </h2>
          
          <p className="text-zinc-400 text-base leading-relaxed mb-8">
             {step === 1 
               ? "Please wait while we generate a secure download link for your device." 
               : "Your high-quality 1080p short has been rendered successfully. Click the button below to download the final MP4 file."}
          </p>

          <div className="w-full space-y-4 relative z-10">
            {step === 1 ? (
              <button disabled className="w-full py-4 bg-zinc-800 text-zinc-300 rounded-2xl font-bold flex items-center justify-center gap-3 border border-zinc-700">
                <span className="text-2xl text-indigo-400">{countdown}</span>
                <span className="text-lg">seconds remaining...</span>
              </button>
            ) : (
              <a 
                href="https://omg10.com/4/11757169"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Trigger the video download in the background
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`; 
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  
                  // Close modal smoothly
                  setTimeout(() => onClose(), 500);
                }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                <span className="text-lg">Download 1080p Video</span>
              </a>
            )}
            
            {/* Kept clean, removed Ad Support texts */}
          </div>

        </div>
      </div>
    </div>
  );
};
