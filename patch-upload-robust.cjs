const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the fetch call to include an AbortController with a 25-second timeout
const fetchTarget = `const res = await fetch('/api/upload-chunk', { method: 'POST', body: formData }); // Let browser handle timeout natively`;
const fetchReplacement = `const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds timeout to prevent hanging forever
    const res = await fetch('/api/upload-chunk', { method: 'POST', body: formData, signal: controller.signal });
    clearTimeout(timeoutId);`;

appCode = appCode.replace(fetchTarget, fetchReplacement);

const concurrencyTarget = `const concurrency = 1; // Safest for very slow connections`;
const concurrencyReplacement = `const concurrency = 2; // Reduced to 2 for stability but keeping it slightly parallel`;

appCode = appCode.replace(concurrencyTarget, concurrencyReplacement);

fs.writeFileSync('src/App.tsx', appCode);

