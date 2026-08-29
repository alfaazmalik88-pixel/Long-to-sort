const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Reduce chunk size to 256KB for extreme reliability
appCode = appCode.replace(
  /const CHUNK_SIZE = 512 \* 1024;/,
  "const CHUNK_SIZE = 256 * 1024; // 256KB chunks for maximum reliability"
);

fs.writeFileSync('src/App.tsx', appCode);

