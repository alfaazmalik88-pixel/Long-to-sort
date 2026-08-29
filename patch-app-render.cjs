const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /videoState\.videoId \|\| 'demo_video',/,
  "videoState.videoId || videoState.url || 'demo_video',"
);

fs.writeFileSync('src/App.tsx', code);
