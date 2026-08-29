const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const videoEndpoint = `
  // Serve video for preview
  app.get("/api/video/:videoId", (req, res) => {
    const videoId = req.params.videoId;
    const videoPath = path.join(uploadDir, \`\${videoId}_combined.mp4\`);
    if (fs.existsSync(videoPath)) {
      res.sendFile(videoPath);
    } else {
      res.status(404).send("Video not found");
    }
  });
`;

if (!code.includes('/api/video/:videoId')) {
  code = code.replace(
    /app\.post\("\/api\/analyze"/,
    videoEndpoint + '\n  app.post("/api/analyze"'
  );
}

fs.writeFileSync('server.ts', code);
