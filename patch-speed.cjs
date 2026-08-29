const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Restore chunk size to 2MB for speed
appCode = appCode.replace(
  /const CHUNK_SIZE = 256 \* 1024; \/\/ 256KB chunks for maximum reliability/,
  "const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks for maximum upload speed"
);

// Restore concurrency to 3
appCode = appCode.replace(
  /const concurrency = 2; \/\/ Reduced to 2 for stability but keeping it slightly parallel/,
  "const concurrency = 3; // Upload 3 chunks in parallel for 1Mbps+ speeds"
);

// Increase timeout to 60s for the 2MB chunks
appCode = appCode.replace(
  /const timeoutId = setTimeout\(\(\) => controller\.abort\(\), 25000\); \/\/ 25 seconds timeout to prevent hanging forever/,
  "const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for larger 2MB chunks"
);

fs.writeFileSync('src/App.tsx', appCode);
console.log("Patched speed!");
