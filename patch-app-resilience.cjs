const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const timeoutId = setTimeout\(\(\) => controller\.abort\(\), 15000\); \/\/ 15s timeout to catch dropped connections fast/,
  "const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout to allow slow connections to finish"
);

code = code.replace(
  /const waitTime = 2000; \/\/ Fixed 2s wait between retries/,
  "const waitTime = Math.min(15000, 2000 * Math.pow(1.5, 20 - retries)); // Exponential backoff for bad networks"
);

code = code.replace(
  /const concurrency = 4; \/\/ Upload 4 chunks in parallel for max throughput/,
  "const concurrency = 2; // Reduced to 2 to prevent bandwidth splitting on slow connections"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with higher resilience!");
