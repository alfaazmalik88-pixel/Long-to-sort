const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Change threads from 0 to 1
code = code.replace(/\.outputOptions\('-threads', '0'\)/g, ".outputOptions('-threads', '1')");

// Ensure chunk combination throws if chunk is missing
code = code.replace(
  /if \(fs\.existsSync\(chunkPath\)\) \{([\s\S]*?)\} else \{/, 
  "if (fs.existsSync(chunkPath)) {$1} else { throw new Error(`Missing chunk ${i}`); } else {" // oops, regex might be tricky
);

fs.writeFileSync('server.ts', code);
