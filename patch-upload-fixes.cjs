const fs = require('fs');

// 1. Fix VideoUploader logic
let uploaderCode = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');
uploaderCode = uploaderCode.replace(
  /const isProcessing = status === 'uploading' \|\| status === 'analyzing';/,
  "const isProcessing = status === 'uploading' || status === 'analyzing' || status === 'error';"
);
fs.writeFileSync('src/components/VideoUploader.tsx', uploaderCode);

// 2. Fix App.tsx: Remove aggressive timeouts, decrease concurrency
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  /const controller = new AbortController\(\);\s*const timeoutId = setTimeout\(\(\) => controller\.abort\(\), 15000\); \/\/ 15 seconds timeout\s*const res = await fetch\('\/api\/upload-chunk', \{ method: 'POST', body: formData, signal: controller\.signal \}\);\s*clearTimeout\(timeoutId\);/g,
  "const res = await fetch('/api/upload-chunk', { method: 'POST', body: formData }); // Let browser handle timeout natively"
);

appCode = appCode.replace(
  /const concurrency = 2; \/\/ Reduced from 3 to 2 to prevent timeout clustering on slow networks/,
  "const concurrency = 1; // Safest for very slow connections"
);

appCode = appCode.replace(
  /const CHUNK_SIZE = 512 \* 1024; \/\/ 512KB chunks for maximum reliability on mobile networks/,
  "const CHUNK_SIZE = 512 * 1024;"
);

// We should also implement a much slower exponential backoff instead of 3000ms fixed.
appCode = appCode.replace(
  /await new Promise\(r => setTimeout\(r, 3000\)\); \/\/ wait 3 seconds on slow network/,
  "const waitTime = Math.min(10000, 3000 * Math.pow(1.5, 10 - retries));\n              await new Promise(r => setTimeout(r, waitTime));"
);

fs.writeFileSync('src/App.tsx', appCode);

