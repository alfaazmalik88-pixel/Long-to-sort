const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /if \(fs\.existsSync\(chunkPath\)\) \{([\s\S]*?)fs\.unlinkSync\(chunkPath\);\s*\}/,
  `if (fs.existsSync(chunkPath)) {
            $1fs.unlinkSync(chunkPath);
          } else {
            console.error(\`Missing chunk \${i} for job \${jobId}\`);
            throw new Error(\`Missing chunk \${i} for job \${jobId}\`);
          }`
);

fs.writeFileSync('server.ts', code);
