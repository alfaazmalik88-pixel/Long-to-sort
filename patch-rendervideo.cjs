const fs = require('fs');
let code = fs.readFileSync('src/lib/renderVideo.ts', 'utf8');

code = code.replace(
  /renderFormData\.append\('videoId', videoId\);/,
  `if (videoId.startsWith('http') || videoId.startsWith('blob:') || videoId.startsWith('data:')) {
        renderFormData.append('videoUrl', videoId);
      } else {
        renderFormData.append('videoId', videoId);
      }`
);

fs.writeFileSync('src/lib/renderVideo.ts', code);
