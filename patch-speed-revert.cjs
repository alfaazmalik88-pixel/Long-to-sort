const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const CHUNK_SIZE = 2 \* 1024 \* 1024; \/\/ 2MB chunks for maximum upload speed/,
  "const CHUNK_SIZE = 512 * 1024; // 512KB chunks for smooth progress and stable speed"
);

code = code.replace(
  /const timeoutId = setTimeout\(\(\) => controller\.abort\(\), 60000\); \/\/ 60s timeout for larger 2MB chunks/,
  "const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout to catch dropped connections fast"
);

code = code.replace(
  /const concurrency = 3; \/\/ Upload 3 chunks in parallel for 1Mbps\+ speeds/,
  "const concurrency = 4; // Upload 4 chunks in parallel for max throughput"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Reverted to 512KB chunks with 15s timeout and concurrency 4");
