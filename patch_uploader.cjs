const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/components/VideoUploader.tsx', 'utf8');

const targetStr = `      video.onerror = () => resolve(true); // if error, just pass it
      video.src = URL.createObjectURL(file);
    });`;

const replaceStr = `      video.onerror = () => resolve(true); // if error, just pass it
      video.src = URL.createObjectURL(file);
      
      // Fallback timeout just in case metadata takes too long or fails silently
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('/app/applet/src/components/VideoUploader.tsx', content);
