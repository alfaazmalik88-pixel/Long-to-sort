const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /setVideoState\(\{ url: videoUrl, file, status: 'uploading', clips: \[\], uploadProgress: 0 \}\);/g,
  "setVideoState({ url: videoUrl, file, status: 'uploading', clips: [], uploadProgress: 1 });"
);

fs.writeFileSync('src/App.tsx', code);
