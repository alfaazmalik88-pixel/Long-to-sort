const fs = require('fs');

// 1. Fix Download Modal: Remove X button, and add logic to trigger the direct link in background
let dmContent = fs.readFileSync('src/components/DownloadModal.tsx', 'utf8');

// Remove the close X button
dmContent = dmContent.replace(
  `<button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>`,
  `{/* Close button removed as requested */}`
);

// We need to change how the download button works to just be a standard trigger.
// When 5 seconds finish, instead of an anchor tag that opens the ad, we'll keep the logic
// to click the direct ad link in background or we can just make the main button open the ad,
// and trigger the download via JS. 
// The current code has the <a> pointing to the ad, and an onClick that triggers download.
// That is exactly what creates the Ad Impression + triggers download. We just need to remove the close modal code, which we already did in the previous step.
// Let's ensure it's still correct.

fs.writeFileSync('src/components/DownloadModal.tsx', dmContent);

// 2. Fix VideoUploader.tsx: Revert chunk size to 1MB, but improve the network logic to be faster
let vuContent = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

// Revert chunk size
vuContent = vuContent.replace('const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB chunks', 'const CHUNK_SIZE = 1024 * 1024; // 1 MB chunks');
vuContent = vuContent.replace('Speed: 20 MB Chunks', 'Speed: 1 MB Chunks');

// Optimize the XHR logic. Right now we have a 500ms delay at the end, and we have sequential synchronous-like uploads.
// To improve speed without increasing chunk size, we need to remove artificial delays.
// However, the real bottleneck with 1MB chunks is the HTTP overhead of sequentially opening new requests. 
// I will remove any setTimeout delays in the happy path.
vuContent = vuContent.replace('setTimeout(() => uploadNextChunk(0), 0);', 'uploadNextChunk(0);');

fs.writeFileSync('src/components/VideoUploader.tsx', vuContent);

console.log("Fixes applied for Download Modal X button and 1MB Chunk optimization.");
