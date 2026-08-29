const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Use async chunk combining
code = code.replace(
  /if \(totalChunks > 0\) \{([\s\S]*?)if \(\!videoPath \|\| \!fs\.existsSync\(videoPath\)\)/,
  `if (totalChunks > 0) {
        // Combine chunks asynchronously to avoid blocking the event loop
        videoPath = path.join(uploadDir, \`\${jobId}_combined.mp4\`);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        
        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(uploadDir, \`\${jobId}_chunk_\${i}\`);
          if (fs.existsSync(chunkPath)) {
            const data = await fs.promises.readFile(chunkPath);
            await fs.promises.appendFile(videoPath, data);
            await fs.promises.unlink(chunkPath);
          } else {
            console.error(\`Missing chunk \${i} for job \${jobId}\`);
            throw new Error(\`Missing chunk \${i} for job \${jobId}\`);
          }
        }
      }

      if (!videoPath || !fs.existsSync(videoPath))`
);

// Optimize ffmpeg threads and add scale for faster processing
code = code.replace(
  /\.outputOptions\('-threads', '1'\)/,
  ".outputOptions('-threads', '2')" // More threads for speed
);

// Scale video down slightly before cropping if possible, actually let's just keep crop but use veryfast or ultrafast
code = code.replace(
  /\.outputOptions\('-preset', 'ultrafast'\)/,
  ".outputOptions('-preset', 'ultrafast')"
);

fs.writeFileSync('server.ts', code);
