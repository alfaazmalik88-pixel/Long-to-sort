const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add upload-complete endpoint
const uploadCompleteCode = `
  app.post("/api/upload-complete", async (req, res) => {
    try {
      const { videoId, totalChunks } = req.body;
      const videoPath = path.join(uploadDir, \`\${videoId}_combined.mp4\`);
      
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(uploadDir, \`\${videoId}_chunk_\${i}\`);
        if (fs.existsSync(chunkPath)) {
          const data = await fs.promises.readFile(chunkPath);
          await fs.promises.appendFile(videoPath, data);
          await fs.promises.unlink(chunkPath);
        } else {
          return res.status(400).json({ error: \`Missing chunk \${i} for video \${videoId}\` });
        }
      }
      
      res.json({ success: true, videoId });
    } catch (e) {
      console.error("Upload complete failed:", e);
      res.status(500).json({ error: "Upload complete failed" });
    }
  });
`;

code = code.replace('app.post("/api/render"', uploadCompleteCode + '\n  app.post("/api/render"');

// Update render endpoint to use videoId if provided
code = code.replace(
  /let videoPath = req\.file \? req\.file\.path : null;/,
  `let videoPath = req.file ? req.file.path : null;
      const videoId = req.body.videoId;
      if (videoId) {
        videoPath = path.join(uploadDir, \`\${videoId}_combined.mp4\`);
      }`
);

// Remove the chunk combining logic from render, as it's now handled by upload-complete
// We will just keep it for backward compatibility or if totalChunks is passed
// Actually, it's safer to keep it, but it will be bypassed if totalChunks is 0 (which it will be from the new client code)

fs.writeFileSync('server.ts', code);
