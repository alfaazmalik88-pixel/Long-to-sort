import React from 'react';
import { X, FileText, ShieldAlert, Copyright, Zap } from 'lucide-react';

export const PolicyView = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative">
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Privacy & Terms
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 text-zinc-300 text-sm leading-relaxed custom-scrollbar">
          
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              1. Privacy Policy
            </h3>
            <p className="text-zinc-400 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              Your privacy is extremely important to us. All video processing (splitting, rendering, editing) is done 
              <strong> 100% locally in your browser</strong>. We do not upload, store, or share your videos to any external servers. 
              Your files never leave your device.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              2. Terms of Service
            </h3>
            <p className="text-zinc-400">
              By using WayinVideo, you agree to our terms. This service is provided "as is" without any warranties. 
              We are not responsible for any data loss, rendering issues, or copyright claims resulting from the use of this tool.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              3. Advertising & Cookies
            </h3>
            <p className="text-zinc-400">
              To keep this tool 100% free, we use third-party ad networks (like Monetag and Adsterra). 
              These networks may use cookies to serve relevant ads. By continuing to use the site, you consent to the use of these cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Copyright className="w-5 h-5 text-red-400" />
              4. Copyright & Fair Use
            </h3>
            <p className="text-zinc-400">
              You must own the rights or have explicit permission to edit and distribute the videos you upload to our tool. 
              WayinVideo does not condone copyright infringement and is strictly a utility tool for content creators.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
