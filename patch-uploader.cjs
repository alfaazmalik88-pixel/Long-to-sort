const fs = require('fs');
let code = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

code = code.replace(
  "  uploadProgress?: number;",
  "  uploadProgress?: number;\n  uploadSpeed?: number;"
);

code = code.replace(
  "export const VideoUploader: React.FC<VideoUploaderProps> = ({ onAnalyze, status, onOpenPolicy, uploadProgress = 0 }) => {",
  "export const VideoUploader: React.FC<VideoUploaderProps> = ({ onAnalyze, status, onOpenPolicy, uploadProgress = 0, uploadSpeed = 0 }) => {"
);

code = code.replace(
  /<span className="absolute text-lg font-bold text-zinc-100">\{Math\.round\(uploadProgress\)\}%<\/span>\s*<\/div>\s*\) : \(/,
  `<span className="absolute text-lg font-bold text-zinc-100">{Math.round(uploadProgress)}%</span>
                </div>
                {uploadSpeed > 0 && (
                  <div className="mt-2 text-indigo-400 font-medium text-sm bg-indigo-500/10 px-3 py-1 rounded-full">
                    Speed: {uploadSpeed.toFixed(1)} Mbps
                  </div>
                )}
              ) : (`
);

fs.writeFileSync('src/components/VideoUploader.tsx', code);
