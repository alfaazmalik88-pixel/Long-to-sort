const fs = require('fs');

let vuContent = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

// Inside uploadNextChunk, we update overallProgress. Let's make sure setUploadProgress only sets a higher value.
// We can use a functional state update `setUploadProgress(prev => Math.max(prev, newProgress))`
vuContent = vuContent.replace(
  'setUploadProgress(Math.min(overallProgress, 99.9));',
  'setUploadProgress(prev => Math.max(prev, Math.min(overallProgress, 99.9)));'
);

// We should also replace the setUploadProgress in currentXhr.onload
// from `setUploadProgress((currentChunk / totalChunks) * 100);`
// to `setUploadProgress(prev => Math.max(prev, (currentChunk / totalChunks) * 100));`
vuContent = vuContent.replace(
  'setUploadProgress((currentChunk / totalChunks) * 100);',
  'setUploadProgress(prev => Math.max(prev, (currentChunk / totalChunks) * 100));'
);

fs.writeFileSync('src/components/VideoUploader.tsx', vuContent);
console.log("Upload progress visual glitch fixed.");
