const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const CHUNK_SIZE = 256 \* 1024;.*?$/m, "const CHUNK_SIZE = 128 * 1024; // 128KB chunks for extreme slow networks");

fs.writeFileSync('src/App.tsx', code);
console.log("Patched chunk size");
