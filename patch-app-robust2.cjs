const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Also update UI to show retry logic in errorMessage if possible, wait, it's a bit complex.
// Let's just make the retry backoff less aggressive so it doesn't take forever.
appCode = appCode.replace(
  /const waitTime = Math\.min\(10000, 3000 \* Math\.pow\(1\.5, 10 - retries\)\);/,
  "const waitTime = 2000; // Fixed 2s wait between retries"
);
appCode = appCode.replace(
  /const uploadChunk = async \(i: number, retries = 10\): Promise<void> => \{/,
  "const uploadChunk = async (i: number, retries = 20): Promise<void> => {" // 20 retries!
);

fs.writeFileSync('src/App.tsx', appCode);

