const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace CHUNK_SIZE
code = code.replace(/const CHUNK_SIZE = 128 \* 1024;.*?\n/, 'const CHUNK_SIZE = 256 * 1024; // 256KB for better scaling\n');

// Replace the concurrency loop
const oldLoopRegex = /const concurrency = 1;[\s\S]*?(?=\/\/ Notify server that upload is complete)/;
const newLoop = `let currentConcurrency = 1;
        for (let i = 0; i < totalChunks; ) {
          while (isPausedRef.current) {
            await new Promise(r => setTimeout(r, 1000));
          }
          const tasks = [];
          for (let j = 0; j < currentConcurrency && i + j < totalChunks; j++) {
            tasks.push(uploadChunk(i + j));
          }
          
          const batchStart = Date.now();
          await Promise.all(tasks);
          const elapsed = Date.now() - batchStart;
          
          i += tasks.length;
          
          if (elapsed < 1000) {
             currentConcurrency = Math.min(6, currentConcurrency + 1);
          } else if (elapsed > 3000) {
             currentConcurrency = Math.max(1, currentConcurrency - 1);
          }
          
          if (elapsed > 2000 && currentConcurrency === 1) {
             await new Promise(r => setTimeout(r, 200)); 
          }
        }

        `;
code = code.replace(oldLoopRegex, newLoop);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched to adaptive network speed");
