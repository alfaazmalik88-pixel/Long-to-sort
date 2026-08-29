const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const uploadChunk = async \(i: number, retries = 3\): Promise<void> => \{/,
  "const uploadChunk = async (i: number, retries = 10): Promise<void> => {"
);

code = code.replace(
  /console\.log\(\`Retrying chunk \$\{i\}\.\.\. \(\$\{retries\} left\)\`\);\s*await new Promise\(r => setTimeout\(r, 1000\)\);\s*return uploadChunk\(i, retries - 1\);/g,
  `console.log(\`Retrying chunk \${i}... (\${retries} left)\`);
              await new Promise(r => setTimeout(r, 3000)); // wait 3 seconds on slow network
              return uploadChunk(i, retries - 1);`
);

fs.writeFileSync('src/App.tsx', code);
