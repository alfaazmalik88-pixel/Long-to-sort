const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');

// Update imports
code = code.replace(
  /import \{ EditorSettings, Clip \} from '\.\.\/types';/,
  "import { EditorSettings, Clip, RenderJob } from '../types';"
);

code = code.replace(
  /import \{ Type, Layout, Sliders, Smartphone, Square, Monitor, Captions, Clock, ListVideo \} from 'lucide-react';/,
  "import { Type, Layout, Sliders, Smartphone, Square, Monitor, Captions, Clock, ListVideo, Download, Loader2, CheckCircle2 } from 'lucide-react';"
);

// Update props
code = code.replace(
  /onExportAll: \(\) => void;/,
  "onExportAll: () => void;\n  renderJobs?: RenderJob[];"
);

code = code.replace(
  /onExportAll\n\}\) => \{/,
  "onExportAll,\n  renderJobs = []\n}) => {"
);

// Add the circular progress logic in the render button area
const replacement = `
      <div className="p-6 border-t border-zinc-800 shrink-0 space-y-3">
        {(() => {
          const currentJob = renderJobs.find(job => job.clipId === selectedClipId);
          
          if (currentJob && currentJob.status === 'processing') {
            return (
              <div className="w-full py-4 bg-zinc-900 rounded-xl flex flex-col items-center justify-center border border-zinc-800">
                <div className="relative flex items-center justify-center w-16 h-16 mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={28 * 2 * Math.PI} 
                            strokeDashoffset={28 * 2 * Math.PI - (currentJob.progress / 100) * (28 * 2 * Math.PI)}
                            className="text-indigo-500 transition-all duration-300" />
                  </svg>
                  <span className="absolute text-sm font-bold text-zinc-100">{Math.round(currentJob.progress)}%</span>
                </div>
                <span className="text-sm text-zinc-400 font-medium">Uploading & Rendering...</span>
              </div>
            );
          }
          
          if (currentJob && currentJob.status === 'ready' && currentJob.blobUrl) {
            return (
              <a
                href={currentJob.blobUrl}
                download={currentJob.title + '.mp4'}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download MP4
              </a>
            );
          }

          return (
            <>
              <button
                onClick={onExport}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
              >
                Render Current Part
              </button>
              <button
                onClick={onExportAll}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Render All Parts ({clips.length})
              </button>
            </>
          );
        })()}
      </div>
`;

code = code.replace(
  /<div className="p-6 border-t border-zinc-800 shrink-0 space-y-3">[\s\S]*?<\/div>/,
  replacement
);

fs.writeFileSync('src/components/SettingsPanel.tsx', code);
