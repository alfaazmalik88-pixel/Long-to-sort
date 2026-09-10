const fs = require('fs');

let vuContent = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

// Use 5 MB chunks as a sweet spot. 1MB is too many requests, 20MB might hit server limits.
vuContent = vuContent.replace(/const CHUNK_SIZE = [\d\s\*]+; \/\/ .*?chunks/, 'const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB chunks');
vuContent = vuContent.replace(/Speed: \d+ MB Chunks/, 'Speed: Fast Uploads');

// Fix the recursive call by adding a small setTimeout to yield the event loop and prevent stack overflow
vuContent = vuContent.replace('uploadNextChunk(0); // Reset retry count', 'setTimeout(() => uploadNextChunk(0), 10); // Reset retry count with slight delay');

fs.writeFileSync('src/components/VideoUploader.tsx', vuContent);
console.log("Upload chunk size and logic fixed.");
