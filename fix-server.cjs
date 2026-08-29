const fs = require('fs');

let code = `
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";

// Setup ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 4GB limit for multer
const upload = multer({ dest: "uploads/", limits: { fileSize: 4000 * 1024 * 1024 } });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Video Analysis
  app.post("/api/analyze", upload.single("video"), async (req, res) => {
    // Increase server timeout for long videos
    req.setTimeout(0);
    res.setTimeout(0);
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in the environment.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const durationMatch = req.body.duration || "10";
      const clipDuration = parseInt(durationMatch, 10);

      console.log(\`Received video file: \${req.file.originalname} (\${req.file.size} bytes), target duration: \${clipDuration}s\`);

      // 1. Upload the file to Gemini
      console.log("Uploading file to Gemini...");
      const fileUpload = await ai.files.upload({
        file: req.file.path,
        mimeType: req.file.mimetype,
      });

      console.log(\`File uploaded successfully. URI: \${fileUpload.uri}\`);

      // 2. Prompt Gemini to analyze the video and identify the most viral segment
      const prompt = \`
        You are an expert video editor and social media strategist.
        Analyze this video and find the MOST engaging, viral, and interesting contiguous segment that is exactly \${clipDuration} seconds long (or slightly shorter if the video is too short).
        
        Focus on:
        - High energy moments
        - Complete thoughts or jokes
        - Visually striking scenes
        - Emotional peaks

        Return the result as a JSON object with this exact structure:
        {
          "clips": [
            {
              "title": "A catchy title for the clip",
              "startTime": <start time in seconds (number)>,
              "endTime": <end time in seconds (number)>,
              "score": <virality score from 1-10 (number)>,
              "explanation": "Why this clip is highly engaging",
              "transcript": "The main spoken text or description of the clip"
            }
          ]
        }
      \`;

      // 3. Generate content with JSON schema
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { fileData: { fileUri: fileUpload.uri, mimeType: fileUpload.mimeType } },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "";
      console.log("Gemini response:", responseText);

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", responseText);
        throw new Error("Invalid response format from Gemini");
      }

      // 4. Clean up local file and optionally the Gemini file
      fs.unlinkSync(req.file.path);
      try {
        await ai.files.delete({ name: fileUpload.name });
      } catch (cleanupErr) {
        console.error("Failed to delete file from Gemini:", cleanupErr);
      }

      res.json(parsedData);

    } catch (error: any) {
      console.error("Error during analysis:", error);
      // Ensure file cleanup on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message || "Failed to analyze video" });
    }
  });

  const renderJobs = new Map();

  // Route to handle chunk uploads
  app.post("/api/upload-chunk", upload.single("chunk"), async (req, res) => {
    try {
      const { jobId, chunkIndex, totalChunks } = req.body;
      const chunkPath = req.file.path;
      const targetPath = path.join(uploadDir, \`\${jobId}_chunk_\${chunkIndex}\`);
      fs.renameSync(chunkPath, targetPath);
      res.json({ success: true });
    } catch (e) {
      console.error("Chunk upload failed:", e);
      res.status(500).json({ error: "Chunk upload failed" });
    }
  });

  // API Route for Video Rendering using FFmpeg (Job-based)
  app.post("/api/render", upload.single("video"), async (req, res) => {
    try {
      const startTime = parseFloat(req.body.startTime || "0");
      const endTime = parseFloat(req.body.endTime || "10");
      const customTitle = req.body.customTitle || "";
      const subtitle = req.body.subtitle || "";
      const aspectRatio = req.body.aspectRatio || "9:16";
      const jobId = req.body.jobId || Date.now().toString();
      const totalChunks = parseInt(req.body.totalChunks || "0");
      
      let videoPath = req.file ? req.file.path : null;

      if (totalChunks > 0) {
        // Combine chunks
        videoPath = path.join(uploadDir, \`\${jobId}_combined.mp4\`);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(uploadDir, \`\${jobId}_chunk_\${i}\`);
          if (fs.existsSync(chunkPath)) {
            const data = fs.readFileSync(chunkPath);
            fs.appendFileSync(videoPath, data);
            fs.unlinkSync(chunkPath);
          }
        }
      }

      if (!videoPath || !fs.existsSync(videoPath)) {
        return res.status(400).json({ error: "No video file provided or combination failed" });
      }

      renderJobs.set(jobId, { status: "processing", progress: 0, url: null, error: null });
      res.json({ jobId });

      const outputFileName = \`render_\${jobId}.mp4\`;
      const outputPath = path.join(uploadDir, outputFileName);

      // Build FFmpeg filters
      const filters = [];
      
      // 1. Crop
      if (aspectRatio === "9:16") {
        filters.push('crop=ih*(9/16):ih');
      } else if (aspectRatio === "16:9") {
        filters.push('crop=iw:iw*(9/16)');
      }

      // 2. Title Text
      if (customTitle) {
        const escapedTitle = customTitle.replace(/[':\n\r]/g, "");
        filters.push(\`drawtext=text='\${escapedTitle}':fontcolor=yellow:fontsize=72:x=(w-text_w)/2:y=(h/6):box=1:boxcolor=black@0.6:boxborderw=20\`);
      }

      // 3. Subtitle Text
      if (subtitle) {
        const escapedSub = subtitle.replace(/[':\n\r]/g, "");
        filters.push(\`drawtext=text='\${escapedSub}':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-150):bordercolor=black:borderw=4\`);
      }

      const vfString = filters.join(',');

      let command = ffmpeg(videoPath)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .outputOptions('-c:v', 'libx264')
        .outputOptions('-preset', 'ultrafast')
        .outputOptions('-crf', '24') // Good quality, much faster size
        .outputOptions('-c:a', 'aac') 
        .outputOptions('-b:a', '192k')
        .outputOptions('-threads', '0') // use all cores
        .outputOptions('-movflags', '+faststart'); // optimize for web

      if (vfString) {
        command = command.videoFilters(vfString);
      }

      console.log(\`Starting FFmpeg render for job \${jobId}\`);

      command.on('progress', (progress) => {
        if (progress.percent && renderJobs.has(jobId)) {
          const p = Math.floor(progress.percent);
          console.log(\`Job \${jobId}: \${p}% done\`);
          renderJobs.get(jobId).progress = p;
        }
      });

      command.on('end', () => {
        console.log(\`Render complete for job \${jobId}: \${outputPath}\`);
        if (renderJobs.has(jobId)) {
          const job = renderJobs.get(jobId);
          job.progress = 100;
          job.status = "completed";
          job.url = \`/uploads/\${outputFileName}\`;
        }
        if (videoPath && fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      })
      .on('error', (err, stdout, stderr) => {
        console.error(\`FFmpeg error for job \${jobId}:\`, err.message); 
        console.error("FFmpeg stderr:", stderr);
        if (renderJobs.has(jobId)) {
          const job = renderJobs.get(jobId);
          job.status = "failed";
          job.error = err.message;
        }
        if (videoPath && fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      })
      .save(outputPath);
      
    } catch (error: any) {
      console.error("Error starting render job:", error);
      const jobId = req.body.jobId;
      if (jobId && renderJobs.has(jobId)) {
        renderJobs.get(jobId).status = "failed";
        renderJobs.get(jobId).error = error.message;
      }
      
      // Cleanup if needed
      let videoPath = req.file ? req.file.path : null;
      if (videoPath && fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to start render job" });
      }
    }
  });

  app.get("/api/render/status/:jobId", (req, res) => {
    const job = renderJobs.get(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  });

  // Serve completed files
  app.use("/uploads", express.static(path.join(uploadDir)));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on port \${PORT}\`);
  });
}

startServer();
`
fs.writeFileSync('server.ts', code);
