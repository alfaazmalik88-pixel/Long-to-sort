const fs = require('fs');
let code = fs.readFileSync('src/lib/renderVideo.ts', 'utf8');

// Increase chunk size to 10MB
code = code.replace(
  /const CHUNK_SIZE = 5 \* 1024 \* 1024;/g,
  "const CHUNK_SIZE = 10 * 1024 * 1024;"
);

// Parallelize the chunk uploading slightly to speed it up
code = code.replace(
  /for \(let i = 0; i < totalChunks; i\+\+\) \{([\s\S]*?)onProgress\(Math\.floor\(\(\(i \+ 1\) \/ totalChunks\) \* 40\)\);\s*\}/,
  `// Use Promise.all with concurrency limit for faster upload
      let uploadedChunks = 0;
      const uploadChunk = async (i) => {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, blobToUpload.size);
        const chunk = blobToUpload.slice(start, end);
        
        const formData = new FormData();
        formData.append('chunk', chunk, 'chunk.mp4');
        formData.append('jobId', generatedJobId);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());

        const res = await fetch('/api/upload-chunk', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(\`Failed to upload chunk \${i}\`);
        }
        uploadedChunks++;
        onProgress(Math.floor((uploadedChunks / totalChunks) * 40));
      };

      // Run 3 uploads concurrently
      const concurrency = 3;
      for (let i = 0; i < totalChunks; i += concurrency) {
        const tasks = [];
        for (let j = 0; j < concurrency && i + j < totalChunks; j++) {
          tasks.push(uploadChunk(i + j));
        }
        await Promise.all(tasks);
      }`
);

fs.writeFileSync('src/lib/renderVideo.ts', code);
