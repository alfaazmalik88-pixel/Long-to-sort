const fs = require('fs');
let code = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

code = code.replace(
  /status: 'idle' \| 'uploading' \| 'analyzing' \| 'ready';/,
  "status: 'idle' | 'uploading' | 'analyzing' | 'ready' | 'error';\n  errorMessage?: string;\n  onCancel?: () => void;"
);

code = code.replace(
  /export const VideoUploader: React\.FC<VideoUploaderProps> = \(\{ onAnalyze, status, onOpenPolicy, uploadProgress = 0, uploadSpeed = 0 \}\) => \{/,
  "export const VideoUploader: React.FC<VideoUploaderProps> = ({ onAnalyze, status, onOpenPolicy, uploadProgress = 0, uploadSpeed = 0, errorMessage, onCancel }) => {"
);

code = code.replace(
  /const isProcessing = status === 'uploading' \|\| status === 'analyzing';/,
  "const isProcessing = status === 'uploading' || status === 'analyzing' || status === 'error';"
);

code = code.replace(
  /\{status === 'uploading' \? \(/,
  `{status === 'error' ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-500/20 text-red-400 flex items-center justify-center rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium text-red-400 mb-2">Upload Failed</h3>
                  <p className="text-zinc-400 text-sm max-w-sm text-center mb-6">{errorMessage || "Please check your internet connection and try again."}</p>
                  <button onClick={() => onCancel?.()} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
                    Try Again
                  </button>
                </div>
              ) : status === 'uploading' ? (`
);

fs.writeFileSync('src/components/VideoUploader.tsx', code);
