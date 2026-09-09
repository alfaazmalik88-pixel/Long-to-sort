const fs = require('fs');
let content = fs.readFileSync('src/components/DownloadModal.tsx', 'utf8');

const targetContent = `  const handleDownload = () => {
    try {
      // Direct video download (No ads for now)
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = \`\${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4\`; 
      a.target = '_blank'; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Removed Monetag Ad link completely as requested.
      // You can add it back here later when you are ready.
      onClose();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again or right-click the video to save.");
    }
  };`;

const replacementContent = `  const handleDownload = () => {
    try {
      // 1. Open Monetag Direct Ad Link in a new tab
      window.open("https://omg10.com/4/11757169", "_blank");

      // 2. Direct video download in the current tab
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = \`\${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4\`; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      onClose();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again or right-click the video to save.");
    }
  };`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync('src/components/DownloadModal.tsx', content);
