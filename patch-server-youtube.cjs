const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add import if not present
if (!code.includes('youtube-dl-exec')) {
  code = code.replace(
    /import express from "express";/,
    "import express from \"express\";\nimport youtubedl from 'youtube-dl-exec';"
  );
}

// Add the download endpoint before the catch-all or Vite middleware
const downloadEndpoint = `
  // API Route for downloading video from URL using youtube-dl-exec
  app.post("/api/download-url", express.json(), async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "URL is required" });

      const videoId = \`video_\${Date.now()}_\${Math.random().toString(36).substring(7)}\`;
      const outputFilename = path.join(uploadDir, \`\${videoId}_combined.mp4\`);

      console.log("Downloading video from URL:", url);
      await youtubedl(url, {
        output: outputFilename,
        format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        mergeOutputFormat: 'mp4',
      });

      console.log("Download complete:", outputFilename);
      res.json({ success: true, videoId });
    } catch (err) {
      console.error("Error downloading video:", err);
      res.status(500).json({ error: "Failed to download video from URL." });
    }
  });
`;

if (!code.includes('/api/download-url')) {
  code = code.replace(
    /app\.post\("\/api\/analyze"/,
    downloadEndpoint + '\n  app.post("/api/analyze"'
  );
}

fs.writeFileSync('server.ts', code);
