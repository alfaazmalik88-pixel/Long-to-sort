const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change CHUNK_SIZE back to 256KB
code = code.replace(/const CHUNK_SIZE = 5 \* 1024 \* 1024;.*?$/m, "const CHUNK_SIZE = 256 * 1024; // 256KB chunks for slow networks");

// Change concurrency back to 1
code = code.replace(/const concurrency = 3;.*?$/m, "const concurrency = 1; // 1 concurrent chunk to avoid network congestion");

// Change watchdog timeout to 60000 (60 seconds)
code = code.replace(/if \(Date\.now\(\) - lastProgressTime > 30000\)/g, "if (Date.now() - lastProgressTime > 60000)");

fs.writeFileSync('src/App.tsx', code);
console.log("Patched to adapt to slow network");
