
import express from "express";
import youtubedl from 'youtube-dl-exec';
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

  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ limit: '500mb', extended: true }));

  // API Route for Video Analysis
  
  // API Route for downloading video from URL using youtube-dl-exec
  app.post("/api/download-url", express.json(), async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "URL is required" });

      const videoId = `video_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const outputFilename = path.join(uploadDir, `${videoId}_combined.mp4`);

      console.log("Downloading video from URL:", url);
      // MULTIPLE SERVER PROXY LOGIC to bypass YouTube blocks
      let success = false;
      let lastError = null;
      
      console.log("Fetching multiple servers (proxies) to avoid YouTube blocking...");
      let proxies = [];
      try {
        const proxyRes = await fetch("https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt");
        const proxyText = await proxyRes.text();
        proxies = proxyText.split('\n').map(p => p.trim()).filter(p => p.length > 5);
      } catch (e) {
        console.error("Could not fetch proxies:", e);
      }
      
      // Try without proxy first (might work for non-youtube links)
      proxies.unshift(null);
      
      // Try up to 4 different servers/proxies
      for (let i = 0; i < Math.min(4, proxies.length); i++) {
        const proxy = i === 0 ? null : proxies[Math.floor(Math.random() * Math.min(50, proxies.length))];
        console.log(`Attempt ${i+1} using server: ${proxy || 'Direct (No Proxy)'}`);
        
        try {
          const dlOptions = {
            output: outputFilename,
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            mergeOutputFormat: 'mp4',
            noCheckCertificates: true,
            noWarnings: true,
            addHeader: [
              'referer:youtube.com',
              'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            ],
            geoBypass: true,
          };
          
          if (proxy) {
            dlOptions.proxy = proxy;
          }
          
          await youtubedl(url, dlOptions);
          success = true;
          console.log("Download successful!");
          break; // It worked!
        } catch (err) {
          lastError = err;
          console.error(`Server attempt ${i+1} failed.`);
        }
      }
      
      if (!success) {
        throw lastError || new Error("Failed after trying multiple servers.");
      }

      console.log("Download complete:", outputFilename);
      res.json({ success: true, videoId });
    } catch (err) {
      console.error("Error downloading video:", err);
      res.status(500).json({ error: "Failed to download video from URL." });
    }
  });

  
  // Serve video for preview
  app.get("/api/video/:videoId", (req, res) => {
    const videoId = req.params.videoId;
    const videoPath = path.join(uploadDir, `${videoId}_combined.mp4`);
    if (fs.existsSync(videoPath)) {
      res.sendFile(videoPath);
    } else {
      res.status(404).send("Video not found");
    }
  });

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

      console.log(`Received video file: ${req.file.originalname} (${req.file.size} bytes), target duration: ${clipDuration}s`);

      // 1. Upload the file to Gemini
      console.log("Uploading file to Gemini...");
      const fileUpload = await ai.files.upload({
        file: req.file.path,
        mimeType: req.file.mimetype,
      });

      console.log(`File uploaded successfully. URI: ${fileUpload.uri}`);

      // 2. Prompt Gemini to analyze the video and identify the most viral segment
      const prompt = `
        You are an expert video editor and social media strategist.
        Analyze this video and find the MOST engaging, viral, and interesting contiguous segment that is exactly ${clipDuration} seconds long (or slightly shorter if the video is too short).
        
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
      `;

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
  app.post("/api/upload-chunk", (req, res, next) => { fs.appendFileSync('upload_logs.txt', new Date().toISOString() + " Received upload-chunk request\n"); next(); }, upload.single("chunk"), async (req, res) => {
    fs.appendFileSync('upload_logs.txt', new Date().toISOString() + " Multer parsed chunk, index: " + req.body.chunkIndex + "\n");
    
    try {
      const { jobId, chunkIndex, totalChunks } = req.body;
      const chunkPath = req.file.path;
      const targetPath = path.join(uploadDir, `${jobId}_chunk_${chunkIndex}`);
      fs.renameSync(chunkPath, targetPath); fs.appendFileSync('upload_logs.txt', new Date().toISOString() + " Renamed chunk " + chunkIndex + "\n");
      res.json({ success: true });
    } catch (e) {
      console.error(\"Chunk upload failed:\", e); fs.appendFileSync('upload_logs.txt', new Date().toISOString() + \" ERROR: \" + (e.stack || e.message) + \"\\n\");
      res.status(500).json({ error: "Chunk upload failed" });
    }
  });

  // API Route for Video Rendering using FFmpeg (Job-based)
  
  app.post("/api/upload-complete", async (req, res) => {
     
    try {
      const { videoId, totalChunks } = req.body;
      const videoPath = path.join(uploadDir, `${videoId}_combined.mp4`);
      
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(uploadDir, `${videoId}_chunk_${i}`);
        if (fs.existsSync(chunkPath)) {
          const data = await fs.promises.readFile(chunkPath);
          await fs.promises.appendFile(videoPath, data);
          await fs.promises.unlink(chunkPath);
        } else {
          return res.status(400).json({ error: `Missing chunk ${i} for video ${videoId}` });
        }
      }
      
      res.json({ success: true, videoId });
    } catch (e) {
      console.error("Upload complete failed:", e);
      res.status(500).json({ error: "Upload complete failed" });
    }
  });

  app.post("/api/render", upload.single("video"), async (req, res) => {
    req.setTimeout(0); res.setTimeout(0);
    try {
      const startTime = parseFloat(req.body.startTime || "0");
      const endTime = parseFloat(req.body.endTime || "10");
      const customTitle = req.body.customTitle || "";
      const subtitle = req.body.subtitle || "";
      const aspectRatio = req.body.aspectRatio || "9:16";
      const jobId = req.body.jobId || Date.now().toString();
      const totalChunks = parseInt(req.body.totalChunks || "0");
      
      let videoPath = req.file ? req.file.path : null;
      const videoId = req.body.videoId;
      const videoUrl = req.body.videoUrl;
      
      if (videoUrl) {
        videoPath = videoUrl;
      } else if (videoId) {
        videoPath = path.join(uploadDir, `${videoId}_combined.mp4`);
      }

      if (totalChunks > 0) {
        // Combine chunks asynchronously to avoid blocking the event loop
        videoPath = path.join(uploadDir, `${jobId}_combined.mp4`);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        
        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(uploadDir, `${jobId}_chunk_${i}`);
          if (fs.existsSync(chunkPath)) {
            const data = await fs.promises.readFile(chunkPath);
            await fs.promises.appendFile(videoPath, data);
            await fs.promises.unlink(chunkPath);
          } else {
            console.error(`Missing chunk ${i} for job ${jobId}`);
            throw new Error(`Missing chunk ${i} for job ${jobId}`);
          }
        }
      }

      if (!videoPath || !fs.existsSync(videoPath)) {
        return res.status(400).json({ error: "No video file provided or combination failed" });
      }

      renderJobs.set(jobId, { status: "processing", progress: 0, url: null, error: null });
      res.json({ jobId });

      const outputFileName = `render_${jobId}.mp4`;
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
        filters.push(`drawtext=text='${escapedTitle}':fontcolor=yellow:fontsize=48:x=(w-text_w)/2:y=(h/4):bordercolor=black:borderw=4`);
      }

      // 3. Subtitle Text
      if (subtitle) {
        const escapedSub = subtitle.replace(/[':\n\r]/g, "");
        filters.push(`drawtext=text='${escapedSub}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h-80):bordercolor=black:borderw=3`);
      }

      const vfString = filters.join(',');

      let command = ffmpeg(videoPath)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .outputOptions('-c:v', 'libx264')
        .outputOptions('-preset', 'fast')
        .outputOptions('-crf', '18') // High quality (visually lossless) // Good quality, much faster size
        .outputOptions('-c:a', 'aac') 
        .outputOptions('-b:a', '192k')
        .outputOptions('-threads', '2') // use all cores
        .outputOptions('-movflags', '+faststart'); // optimize for web

      if (vfString) {
        command = command.videoFilters(vfString);
      }

      console.log(`Starting FFmpeg render for job ${jobId}`);

      command.on('progress', (progress) => {
        if (progress.percent && renderJobs.has(jobId)) {
          const p = Math.floor(progress.percent);
          console.log(`Job ${jobId}: ${p}% done`);
          renderJobs.get(jobId).progress = p;
        }
      });

      command.on('end', () => {
        console.log(`Render complete for job ${jobId}: ${outputPath}`);
        if (renderJobs.has(jobId)) {
          const job = renderJobs.get(jobId);
          job.progress = 100;
          job.status = "completed";
          job.url = `/uploads/${outputFileName}`;
        }
        if (videoPath && fs.existsSync(videoPath)) {
          // fs.unlinkSync(videoPath); // Do not delete so we can render multiple parts
        }
      })
      .on('error', (err, stdout, stderr) => {
        console.error(`FFmpeg error for job ${jobId}:`, err.message); 
        console.error("FFmpeg stderr:", stderr);
        if (renderJobs.has(jobId)) {
          const job = renderJobs.get(jobId);
          job.status = "failed";
          job.error = err.message + '\n' + stderr;
        }
        if (videoPath && fs.existsSync(videoPath)) {
          // fs.unlinkSync(videoPath); // Do not delete so we can render multiple parts
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
          // fs.unlinkSync(videoPath); // Do not delete so we can render multiple parts
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
