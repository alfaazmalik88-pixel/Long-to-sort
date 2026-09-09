const fs = require('fs');

let content = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

const replacement1 = `
  const [showUrlNotice, setShowUrlNotice] = useState(false);
  const [resolutionWarning, setResolutionWarning] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setResolutionWarning(null);
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    const isUnder1080p = await new Promise<boolean>((resolve) => {
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        // If either dimension is greater than 1920, it's > 1080p
        if (video.videoWidth > 1920 || video.videoHeight > 1920) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      video.onerror = () => resolve(true); // if error, just pass it
      video.src = URL.createObjectURL(file);
    });

    if (!isUnder1080p) {
      setResolutionWarning("Your video is above 1080p (e.g. 4K/2K). Please upload a video with 1080p or lower resolution. High-resolution videos may crash the server.");
      return;
    }

    setPendingFile(file);
    setIsUploading(true);
    setUploadProgress(0);
  };
`;
content = content.replace('  const [showUrlNotice, setShowUrlNotice] = useState(false);', replacement1);


const replacement2 = `
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
`;
content = content.replace(/  const handleFileChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => {[\s\S]*?  };/, replacement2);


const replacement3 = `
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/10');
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  processFile(file);
                }
              }}
`;
content = content.replace(/              onDrop={\(e\) => {[\s\S]*?              }}/g, replacement3);

const replacement4 = `
            {showUrlNotice ? (
`;

const warningBlock = `
            {resolutionWarning && (
              <div className="relative bg-[#3b1515] border border-red-500/30 p-5 rounded-2xl flex flex-col gap-3 animate-in fade-in zoom-in duration-300">
                <button 
                  onClick={() => setResolutionWarning(null)} 
                  className="absolute top-3 right-3 text-red-400 hover:text-white transition-colors bg-black/20 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-4 pr-6">
                   <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                   <div>
                      <h3 className="text-base font-bold text-red-400">High Resolution Detected</h3>
                      <p className="text-sm text-red-300/80 mt-1 leading-relaxed">
                        {resolutionWarning}
                      </p>
                   </div>
                </div>
              </div>
            )}

            {showUrlNotice ? (
`;

content = content.replace('            {showUrlNotice ? (', warningBlock);

fs.writeFileSync('src/components/VideoUploader.tsx', content);
