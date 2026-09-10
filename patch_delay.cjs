const fs = require('fs');
let content = fs.readFileSync('src/components/DownloadModal.tsx', 'utf8');

const searchRegex = /onClick=\{\(\) => \{[\s\S]*?\/\/ Keeping modal open so user can retry if browser blocked it\s*\}\}/m;

const replacement = `onClick={(e) => {
                  const btn = e.currentTarget;
                  const originalContent = btn.innerHTML;
                  btn.innerHTML = '<span class="text-lg">Downloading in 5s...</span>';
                  btn.style.pointerEvents = 'none'; // Prevent multiple clicks while waiting
                  
                  // Trigger the video download in the background AFTER 5 SECONDS
                  setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = \`\${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4\`; 
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // Reset button after download starts
                    btn.innerHTML = originalContent;
                    btn.style.pointerEvents = 'auto';
                  }, 5000);
                }}`;

content = content.replace(searchRegex, replacement);

fs.writeFileSync('src/components/DownloadModal.tsx', content);
console.log("Updated DownloadModal with 5s delay.");
