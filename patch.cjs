const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  "  uploadProgress?: number;",
  "  uploadProgress?: number;\n  uploadSpeed?: number; // in MB/s"
);
fs.writeFileSync('src/types.ts', code);
