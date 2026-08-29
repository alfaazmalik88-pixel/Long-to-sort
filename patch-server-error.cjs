const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /console.error\("Chunk upload failed:", e\);/,
  "console.error(\\\"Chunk upload failed:\\\", e); fs.appendFileSync('upload_logs.txt', new Date().toISOString() + \\\" ERROR: \\\" + (e.stack || e.message) + \\\"\\\\n\\\");"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with better error logging");
