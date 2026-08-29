const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change CHUNK_SIZE to 512KB for better reliability on flaky mobile networks
code = code.replace(
  /const CHUNK_SIZE = 2 \* 1024 \* 1024; \/\/ 2MB chunks for much faster uploading/,
  "const CHUNK_SIZE = 512 * 1024; // 512KB chunks for maximum reliability on mobile networks"
);

// Add AbortController to fetch
code = code.replace(
  /const res = await fetch\('\/api\/upload-chunk', \{ method: 'POST', body: formData \}\);/,
  `const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    const res = await fetch('/api/upload-chunk', { method: 'POST', body: formData, signal: controller.signal });
    clearTimeout(timeoutId);`
);

fs.writeFileSync('src/App.tsx', code);
