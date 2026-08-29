const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const uploadChunk = async \(i: number, retries = 3\): Promise<void> => \{([\s\S]*?)const formData = new FormData\(\);/m,
  `const uploadChunk = async (i: number, retries = 3): Promise<void> => {
    $1
    console.log(\`Preparing chunk \${i} (size: \${chunk.size})\`);
    const formData = new FormData();`
);

code = code.replace(
  /try \{\s*const res = await fetch\('\/api\/upload-chunk', \{ method: 'POST', body: formData \}\);/m,
  `try {
    console.log(\`Sending fetch for chunk \${i}...\`);
    const res = await fetch('/api/upload-chunk', { method: 'POST', body: formData });
    console.log(\`Fetch returned for chunk \${i} with status \${res.status}\`);`
);

code = code.replace(
  /\} catch \(err\) \{\s*if \(retries > 0\) \{/m,
  `} catch (err) {
    console.error(\`Error uploading chunk \${i}:\`, err);
    if (retries > 0) {`
);

code = code.replace(
  /throw new Error\(\`Failed to upload chunk \$\{i\} after retries\`\);/m,
  `throw err;`
);

fs.writeFileSync('src/App.tsx', code);
