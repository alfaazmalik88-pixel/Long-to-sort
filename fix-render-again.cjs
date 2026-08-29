const fs = require('fs');
let code = fs.readFileSync('src/lib/renderVideo.ts', 'utf8');

// Reduce chunk size to 2MB and concurrency to 1 to avoid network errors on mobile/proxy limits
code = code.replace(
  /const CHUNK_SIZE = 10 \* 1024 \* 1024;/g,
  "const CHUNK_SIZE = 2 * 1024 * 1024;"
);
code = code.replace(
  /const concurrency = 3;/g,
  "const concurrency = 1;"
);

fs.writeFileSync('src/lib/renderVideo.ts', code);
