const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const concurrency = 3; \/\/ Upload up to 3 chunks in parallel to max out bandwidth/,
  "const concurrency = 2; // Reduced from 3 to 2 to prevent timeout clustering on slow networks"
);

fs.writeFileSync('src/App.tsx', code);
