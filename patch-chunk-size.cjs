const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const CHUNK_SIZE = 256 \* 1024; \/\/ 256KB chunks for faster progress updates/,
  "const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks for much faster uploading"
);

code = code.replace(
  /const concurrency = 1;/,
  "const concurrency = 3; // Upload up to 3 chunks in parallel to max out bandwidth"
);

fs.writeFileSync('src/App.tsx', code);
