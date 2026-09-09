const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/components/DownloadModal.tsx', 'utf8');

const replacementContent = `  const handleDownload = () => {
    try {
      // 1. Open Monetag Direct Ad Link in a new tab
      window.open("https://omg10.com/4/11757169", "_blank");

      // 2. Wait for 1.5 seconds so the Ad page loads, then start the download
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = \`\${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4\`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        onClose();
      }, 1500); // 1.5 seconds delay
      
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again or right-click the video to save.");
    }
  };`;

content = content.replace(/  const handleDownload = \(\) => \{[\s\S]*?  \};/, replacementContent);
fs.writeFileSync('/app/applet/src/components/DownloadModal.tsx', content);
