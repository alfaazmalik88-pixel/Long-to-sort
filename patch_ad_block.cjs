const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/components/DownloadModal.tsx', 'utf8');

const targetStr = `            ) : (
              <button 
                onClick={handleDownload}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                <span className="text-lg">Download 1080p Video</span>
              </button>
            )}`;

const replaceStr = `            ) : (
              <a 
                href="https://omg10.com/4/11757169"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Trigger the video download in the background
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = \`\${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4\`; 
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
            )}`;

content = content.replace(targetStr, replaceStr);

// We can also remove the old handleDownload method entirely since we put the logic inside onClick
const handleDownloadRegex = /  const handleDownload = \(\) => \{[\s\S]*?  \};/;
content = content.replace(handleDownloadRegex, '');

fs.writeFileSync('/app/applet/src/components/DownloadModal.tsx', content);
