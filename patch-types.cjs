const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  /status: 'idle' \| 'uploading' \| 'analyzing' \| 'ready';/,
  "status: 'idle' | 'uploading' | 'analyzing' | 'ready' | 'error';\n  errorMessage?: string;"
);
fs.writeFileSync('src/types.ts', code);
